"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

export default function LeaderAnnouncements() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const [targetType, setTargetType] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "teams"),
        where("leader", "==", user.uid)
      );

      const snap = await getDocs(q);
      if (snap.empty) return;

      const teamData = { id: snap.docs[0].id, ...snap.docs[0].data() };
      setTeam(teamData);

      const userSnap = await getDocs(collection(db, "users"));

      const teamMembers = userSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => teamData.members?.includes(u.id));

      setMembers(teamMembers);
    };

    fetchData();
  }, []);

  const toggleUser = (uid) => {
    setSelectedUsers(prev =>
      prev.includes(uid)
        ? prev.filter(id => id !== uid)
        : [...prev, uid]
    );
  };

  const createAnnouncement = async () => {
    if (!title || !content) return;

    await addDoc(collection(db, "announcements"), {
      teamId: team.id,
      title,
      content,
      date,
      targetType,
      targetUsers: targetType === "all" ? [] : selectedUsers,
      leaderId: auth.currentUser.uid,
      responses: {}
    });

    alert("Announcement created!");

    setTitle("");
    setContent("");
    setDate("");
    setSelectedUsers([]);
  };

  return (
    <div style={styles.container}>
      <h1>Announcements</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />

      
      <div>
        <p style={styles.label}>Target</p>

        <div style={styles.switchBox}>
          <button
            onClick={() => setTargetType("all")}
            style={{
              ...styles.switchBtn,
              background: targetType === "all" ? "#2563eb" : "#e5e7eb",
              color: targetType === "all" ? "white" : "black"
            }}
          >
            All Members
          </button>

          <button
            onClick={() => setTargetType("selected")}
            style={{
              ...styles.switchBtn,
              background: targetType === "selected" ? "#2563eb" : "#e5e7eb",
              color: targetType === "selected" ? "white" : "black"
            }}
          >
            Select Members
          </button>
        </div>
      </div>

      
      {targetType === "selected" && (
        <div style={styles.memberBox}>
          {members.map((m) => (
            <label key={m.id} style={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(m.id)}
                onChange={() => toggleUser(m.id)}
              />
              {m.name}
            </label>
          ))}
        </div>
      )}

      <button onClick={createAnnouncement} style={styles.createBtn}>
        Create Announcement
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "100px"
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold"
  },
  switchBox: {
    display: "flex",
    gap: "10px",
    marginTop: "5px"
  },
  switchBtn: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },
  memberBox: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  checkbox: {
    display: "flex",
    gap: "8px"
  },
  createBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};