import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import { changePassword } from "services/shared/accounts";
import { toast } from "react-toastify";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import CommonLayout from "./CommonLayout";

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const AccountPass = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [message, setMessage] = useState("");

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    const strength = zxcvbn(password);
    setPasswordStrength(strength.score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setMessage("Password changed successfully.");
      toast.success(message);
    } catch (error: any) {
      toast.error(error.error || message)
      setMessage("Error changing password. Please try again.");
    }
  };

  const handleGeneratePassword = () => {
    const newGeneratedPassword = generatePassword();
    setNewPassword(newGeneratedPassword);
    const strength = zxcvbn(newGeneratedPassword);
    setPasswordStrength(strength.score);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            <div>
              <Label>Current password</Label>
              <Input
                type="password"
                className="mt-1.5"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>New password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                className="mt-1.5"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              <div className="mt-1.5">
                <PasswordStrengthIndicator score={passwordStrength} />
              </div>
              <button
                type="button"
                className="mt-1 text-sm text-blue-500"
                onClick={toggleShowPassword}
              >
                {showPassword ? "Hide" : "Show"} password
              </button>
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input
                type="password"
                className="mt-1.5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="pt-2">
              <ButtonPrimary type="submit">Update password</ButtonPrimary>
              <ButtonPrimary type="button" onClick={handleGeneratePassword} className="ml-4">
                Generate Strong Password
              </ButtonPrimary>
            </div>
            {message && <p className="mt-4 text-red-600">{message}</p>}
          </form>
        </div>
      </CommonLayout>
    </div>
  );
};

const PasswordStrengthIndicator: React.FC<{ score: number }> = ({ score }) => {
  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <p>Password strength: {getStrengthLabel(score)}</p>
      <div className="h-2 w-full bg-gray-300">
        <div
          className={`h-2 ${score === 0 ? 'bg-red-600' : score === 1 ? 'bg-orange-500' : score === 2 ? 'bg-yellow-500' : score === 3 ? 'bg-green-500' : 'bg-green-700'}`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AccountPass;
