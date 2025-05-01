import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../styles/ProfilePage.css"; // Custom CSS file for styling

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Fetching user data (simulating data from localStorage)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {
      name: "John Doe",
      email: "johndoe@example.com",
      username: "john_doe123",
    };
    setUser(userData);
  }, []);

  // Handle saving changes
  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    // Save profile changes
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated successfully.");
    setEditing(false);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", newTheme === "dark");
    toast.success(`Switched to ${newTheme} mode!`);
  };

  return (
    <div className={`profile-container ${theme}`}>
      <h2>Profile Settings</h2>

      {/* Profile Information */}
      <div className="profile-info">
        <div className="profile-item">
          <label>Name:</label>
          {editing ? (
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>
        <div className="profile-item">
          <label>Email:</label>
          {editing ? (
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>
        <div className="profile-item">
          <label>Username:</label>
          {editing ? (
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          ) : (
            <span>{user.username}</span>
          )}
        </div>
        <div className="profile-item">
          <button onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit Profile"}
          </button>
          {editing && (
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Change Password */}
      {editing && (
        <div className="password-change">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      )}

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button onClick={handleThemeToggle}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
