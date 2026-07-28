import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

// Demonstrates useAuth() end to end — safe to delete once you've wired
// login/register into your own pages/routes.
export function AuthStatus() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) return <Spinner label="Checking session..." />;

  if (user) {
    return (
      <div>
        <p>Signed in as {user.email}</p>
        <Button onClick={logout}>Log out</Button>
      </div>
    );
  }

  return (
    <div>
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <p>
        <Button className="link" onClick={() => setShowRegister((v) => !v)}>
          {showRegister ? "Have an account? Log in" : "Need an account? Register"}
        </Button>
      </p>
    </div>
  );
}
