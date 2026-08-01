import mongoose, { type ClientSession } from "mongoose";

// Wraps Mongoose's session/transaction boilerplate into a single call.
// Pass the session `fn` receives to every query you want inside the
// transaction (e.g. `Model.create([doc], { session })`, `Model.updateOne(
// filter, update, { session })`) — anything not given the session runs
// outside it and won't be rolled back if the transaction aborts.
// session.withTransaction() already retries/commits/aborts for you; this
// just adds the missing piece (returning your callback's result) and
// guarantees the session itself always gets cleaned up.
//
// Requires MongoDB to be running as a replica set (even a single-node
// one) — a plain standalone `mongod`/`mongo` Docker image does NOT
// support transactions. Mongoose's default retryable-writes behavior
// means the error you'll actually see is usually "This MongoDB
// deployment does not support retryable writes" (older driver/server
// combinations instead throw "Transaction numbers are only allowed on a
// replica set member or mongos"). To run one locally:
//
//   docker run -d -p 27017:27017 mongo:7 --replSet rs0
//   docker exec <container> mongosh --eval "rs.initiate()"
//
// Example:
//   await withTransaction(async (session) => {
//     const [order] = await Order.create([{ ... }], { session });
//     await Inventory.updateOne({ _id: itemId }, { $inc: { stock: -1 } }, { session });
//     return order;
//   });
export async function withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
  const session = await mongoose.startSession();
  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result!;
  } finally {
    await session.endSession();
  }
}
