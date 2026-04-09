"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("approved", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(users);
    });

    return () => unsubscribe();
  }, []);

  const approveUser = async (uid, role) => {
    await updateDoc(doc(db, "users", uid), {
      approved: true,
      role: role
    });
  };

  const rejectUser = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
  };

  return (
    <div>
      <h1>Signup Requests</h1>

      {requests.length === 0 && <p>No requests</p>}

      {requests.map((user) => (
        <div key={user.id} style={styles.card}>
          <p><b>{user.name}</b></p>
          <p>{user.email}</p>

          <div style={styles.buttons}>
            <button
              onClick={() => approveUser(user.id, "member")}
              style={styles.member}
            >
              Member
            </button>

            <button
              onClick={() => approveUser(user.id, "leader")}
              style={styles.leader}
            >
              Leader
            </button>

            <button
              onClick={() => rejectUser(user.id)}
              style={styles.reject}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "8px"
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  member: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  leader: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  reject: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};