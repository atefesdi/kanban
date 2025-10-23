import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";
import Layout from "../components/layout/layout";


const Profile: React.FC = () => {
  const { jwt, user, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState(user?.name);
  const [message, setMessage] = useState("");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const formData = new FormData();
    if (name) formData.append("name", name);
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

  return (
    <Layout pageTitle="My Profile">
    <div className={styles.container}>
      <h2 className={styles.title}>Profile Settings</h2>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img
            src={preview || user?.avatar_url || "/default-avatar.png"}
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
            <input type="text" value={user?.email || ""} disabled />
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={name ?? user?.name ?? ""}
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
