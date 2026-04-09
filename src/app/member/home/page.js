"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";
import MemberSidebar from "../../../components/MemberSidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";

function MemberHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const teamSnap = await getDocs(collection(db, "teams"));

      let myTeam = null;

      teamSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.members?.includes(user.uid)) {
          myTeam = { id: docSnap.id, ...data };
        }
      });

      if (!myTeam) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "announcements"),
        where("teamId", "==", myTeam.id)
      );

      const annSnap = await getDocs(q);

      const list = annSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      const filtered = list.filter((a) => {
        if (a.targetType === "all") return true;
        return a.targetUsers?.includes(user.uid);
      });

      setAnnouncements(filtered);
      setLoading(false);
    };

    fetchData();
  }, []);

  const respond = async (announcementId, answer) => {
    const user = auth.currentUser;

    await updateDoc(doc(db, "announcements", announcementId), {
      [`responses.${user.uid}`]: answer
    });

    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId
          ? {
              ...a,
              responses: {
                ...a.responses,
                [user.uid]: answer
              }
            }
          : a
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <MemberSidebar />

      <div style={styles.content}>
        <h1>My Announcements</h1>

        {announcements.length === 0 && <p>No announcements</p>}

        {announcements.map((a) => {
          const myResponse = a.responses?.[auth.currentUser.uid];
          const isUnread = !myResponse;

          return (
            <div key={a.id} style={styles.card}>
              <div style={styles.header}>
                <h3>{a.title}</h3>
                {isUnread && <span style={styles.badge}>NEW</span>}
              </div>

              <p>{a.content}</p>
              <p>📅 {a.date}</p>

              {myResponse ? (
                <p style={styles.done}>
                  ✅ You responded: <b>{myResponse.toUpperCase()}</b>
                </p>
              ) : (
                <div style={styles.buttons}>
                  <button
                    style={styles.yes}
                    onClick={() => respond(a.id, "yes")}
                  >
                    YES
                  </button>
                  <button
                    style={styles.no}
                    onClick={() => respond(a.id, "no")}
                  >
                    NO
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["member"]}>
      <MemberHome />
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    display: "flex"
  },
  content: {
    padding: "30px",
    flex: 1,
    background: "#f9fafb",
    minHeight: "100vh"
  },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    marginTop: "15px",
    borderRadius: "10px",
    background: "white"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    background: "#ef4444",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px"
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  yes: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  no: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  done: {
    marginTop: "10px",
    color: "#2563eb"
  }
};