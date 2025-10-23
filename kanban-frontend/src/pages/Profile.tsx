import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";
import Layout from "../components/layout/layout";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

const Profile: React.FC = () => {
  const { jwt, user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await res.json();
        console.log('data :>> ', data);
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [jwt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setUser(updated);
        setMessage("Profile updated successfully!");
        setFile(null);
      } else {
        const errData = await res.json();
        setMessage(errData.errors?.join(", ") || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Something went wrong");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <Layout pageTitle="My Profile">
    <div className={styles.container}>
      <h2 className={styles.title}>Profile Settings</h2>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img
            src={preview || profile?.avatar_url || "/default-avatar.png"}
            alt="Profile Avatar"
            className={styles.avatar}
          />
          <label className={styles.uploadBtn}>
            Change Photo
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="text" value={profile?.email || ""} disabled />
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Profile;
