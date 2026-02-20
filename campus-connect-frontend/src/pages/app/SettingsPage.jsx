import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials, fetchMe } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Tabs from "../../components/ui/Tabs";

import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineColorSwatch,
  HiOutlineTrash,
} from "react-icons/hi";

const TABS = ["Account", "Privacy"];

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Account");
  const [loading, setLoading] = useState(false);


  const [account, setAccount] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    university: user?.university || "",
    major: user?.major || "",
    academicYear: user?.academicYear || "",
    location: user?.location || "",
  });

  const handleAccountSave = async () => {
    try {
      setLoading(true);

      await client.put("/users/me", account);

      await dispatch(fetchMe());

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };


  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    try {
      setLoading(true);

      await client.put("/users/change-password", passwordData);

      alert("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };


  const [privacy, setPrivacy] = useState({
    isPrivate: user?.isPrivate || false,
  });

  const handlePrivacySave = async () => {
    try {
      setLoading(true);

      await client.patch("/users/privacy", privacy);

      await dispatch(fetchMe());

      alert("Privacy updated");
    } catch (err) {
      alert(err.response?.data?.message || "Privacy update failed");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await client.delete("/users/delete-account");

      dispatch(clearCredentials());
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">
          Manage your account preferences.
        </p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />


      {activeTab === "Account" && (
        <div className="space-y-6">

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HiOutlineUser /> Personal Information
            </h2>

            <Input
              label="First Name"
              value={account.firstName}
              onChange={(e) =>
                setAccount({ ...account, firstName: e.target.value })
              }
            />

            <Input
              label="Last Name"
              value={account.lastName}
              onChange={(e) =>
                setAccount({ ...account, lastName: e.target.value })
              }
            />

            <Input
              label="University"
              value={account.university}
              onChange={(e) =>
                setAccount({ ...account, university: e.target.value })
              }
            />

            <Input
              label="Major"
              value={account.major}
              onChange={(e) =>
                setAccount({ ...account, major: e.target.value })
              }
            />

            <Select
              label="Academic Year"
              value={account.academicYear}
              onChange={(e) =>
                setAccount({ ...account, academicYear: e.target.value })
              }
              options={[
                { value: "", label: "Select Year" },
                { value: "Freshman", label: "Freshman" },
                { value: "Sophomore", label: "Sophomore" },
                { value: "Junior", label: "Junior" },
                { value: "Senior", label: "Senior" },
                { value: "Graduate", label: "Graduate" },
              ]}
            />

            <Input
              label="Location"
              value={account.location}
              onChange={(e) =>
                setAccount({ ...account, location: e.target.value })
              }
            />

            <Button onClick={handleAccountSave} disabled={loading}>
              Save Changes
            </Button>
          </Card>

         

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HiOutlineShieldCheck /> Change Password
            </h2>

            <Input
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              label="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Button onClick={handleChangePassword} disabled={loading}>
              Update Password
            </Button>
          </Card>

        

          <Card className="p-6 border-rose-200">
            <h2 className="text-lg font-semibold text-rose-600 flex items-center gap-2">
              <HiOutlineTrash /> Danger Zone
            </h2>

            <Button
              variant="outline"
              className="mt-4 border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Card>

        </div>
      )}


      {activeTab === "Privacy" && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HiOutlineEye /> Privacy
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacy.isPrivate}
              onChange={(e) =>
                setPrivacy({ isPrivate: e.target.checked })
              }
            />
            Make my profile private
          </label>

          <Button onClick={handlePrivacySave} disabled={loading}>
            Save Privacy
          </Button>
        </Card>
      )}
    </div>
  );
}
