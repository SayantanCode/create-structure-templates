import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { Button, Spinner } from "@/components";

// Demonstrates useAuth() end to end — safe to delete once you've wired
// login/register into your own pages/routes.
export function AuthStatus() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="demo-card auth-card">
        <Spinner label="Checking session..." />
      </div>
    );
  }

  if (user) {
    return (
      <div className="demo-card auth-card">
        <h2>Auth</h2>
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <Button onClick={logout}>Log out</Button>
      </div>
    );
  }

  return (
    <div className="demo-card auth-card">
      <h2>{showRegister ? "Create an account" : "Log in"}</h2>
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <p className="form-switch">
        {showRegister ? "Have an account?" : "Need an account?"}{" "}
        <button type="button" className="form-switch-link" onClick={() => setShowRegister((v) => !v)}>
          {showRegister ? "Log in" : "Register"}
        </button>
      </p>
    </div>
  );
}
