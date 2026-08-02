import { ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, useState } from "react";
import { Input } from "@/components/Input";

// Narrow, explicit prop set (not a blanket InputHTMLAttributes spread) so
// this stays structurally compatible with whichever styling library's
// Input is active — MUI's TextFieldProps and antd's InputProps redeclare
// attributes like `size`/`color` with their own restrictive types, which a
// wide native-attribute spread collides with.
type FormFieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
};

// Consolidates the icon + label + input (+ show/hide toggle, for
// type="password") markup every form in this project needs. Before this
// existed, LoginForm/RegisterForm each hand-rolled the identical markup —
// same icon SVGs, same password toggle — independently. Add a new form the
// same way: one <FormField icon={...} /> per field instead of re-deriving
// this again.
export function FormField({ id, label, icon, type, ...props }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        <span className="input-icon" aria-hidden="true">
          {icon}
        </span>
        <Input id={id} type={isPassword && showPassword ? "text" : type} {...props} />
        {isPassword && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}
