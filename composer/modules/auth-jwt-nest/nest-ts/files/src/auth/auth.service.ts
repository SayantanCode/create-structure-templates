import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt.util";
import { RegisterDto, LoginDto } from "./dto/auth.dto";

function issueTokens(user: UserDocument) {
  const identity = { id: user._id.toString(), role: user.role };
  return { accessToken: signAccessToken(identity), refreshToken: signRefreshToken(identity) };
}

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException("Email already in use");

    const user = await this.userModel.create(dto);
    return { user: user.toJSON(), ...issueTokens(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).select("+password");
    if (!user || !(await user.comparePassword(dto.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return { user: user.toJSON(), ...issueTokens(user) };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedException("Missing refresh token");

    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) throw new UnauthorizedException("User no longer exists");

    return issueTokens(user);
  }

  async me(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    return user.toJSON();
  }
}
