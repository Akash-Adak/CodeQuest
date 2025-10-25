import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  LocationMarkerIcon,
  LinkIcon,
  PhotographIcon,
  PencilIcon,
  SaveIcon,
} from "@heroicons/react/outline";

const dummyProfile = {
  name: "",
  email: "email@example.com",
  dob: "yyyy-mm-dd",
  city: "Unknown",
  gender: "Other",
  linkedin: "https://linkedin.com/in/xxxx",
  github: "https://github.com/xxxx",
  profilePhotoBase64: "",
};

export default function Profile() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [profile, setProfile] = useState(dummyProfile);
  const [editing, setEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = localStorage.getItem("user_email");

  useEffect(() => {
    if (!userEmail) {
      console.warn("User email not found, using dummy profile.");
      setProfile(dummyProfile);
      return;
    }

    const cachedProfile = localStorage.getItem("profile");
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        setPreviewPhoto(parsed.profilePhotoBase64 || "");
      } catch (error) {
        console.error("Error parsing cached profile:", error);
        fetchProfile();
      }
    } else {
      fetchProfile();
    }
  }, [userEmail]);

  const fetchProfile = () => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/profile?email=${userEmail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setProfile(res.data);
          setPreviewPhoto(res.data.profilePhotoBase64 || "");
          localStorage.setItem("profile", JSON.stringify(res.data));
        }
      })
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedProfile = { ...profile, profilePhotoBase64: base64String };
      setProfile(updatedProfile);
      setPreviewPhoto(base64String);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Error reading image file");
    };
    reader.readAsDataURL(file);
  };

  const toggleEdit = () => {
    if (editing) {
      setIsLoading(true);
      axios
        .post(`${baseUrl}/api/profile`, profile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setProfile(res.data);
          setPreviewPhoto(res.data.profilePhotoBase64 || "");
          localStorage.setItem("profile", JSON.stringify(res.data));
          setEditing(false);
          alert("Profile updated successfully!");
        })
        .catch((err) => {
          console.error("Failed to update profile", err);
          alert("Failed to save profile.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setEditing(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toggleEdit();
  };

  const inputFields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      icon: <UserIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      icon: <MailIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Date of Birth",
      name: "dob",
      type: "date",
      icon: <CalendarIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      icon: <LocationMarkerIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "LinkedIn URL",
      name: "linkedin",
      type: "url",
      icon: <LinkIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "GitHub URL",
      name: "github",
      type: "url",
      icon: <LinkIcon className="h-5 w-5 text-gray-400" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 text-center">
        Profile Details
      </h2>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-4 border-indigo-600 dark:border-indigo-400 shadow-md overflow-hidden relative group">
            {previewPhoto ? (
              <img
                src={previewPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <PhotographIcon className="h-12 w-12" />
              </div>
            )}
          </div>

          {editing && (
            <label className="mt-4 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              <PhotographIcon className="h-5 w-5" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-grow w-full">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Input Fields */}
            {inputFields.map(({ label, name, type, icon }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                  </span>
                  <input
                    type={type}
                    name={name}
                    value={profile[name]}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      editing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  editing
                    ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Edit / Save Button */}
            {userEmail && (
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md shadow transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : editing ? (
                  <>
                    <SaveIcon className="h-5 w-5" /> Save Changes
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-5 w-5" /> Edit Profile
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}