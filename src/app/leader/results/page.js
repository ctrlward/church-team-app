"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function LeaderResults() {
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // bring announcements
    const q = query(
      collection(db, "announcements"),
      where("leaderId", "==", user.uid)
    );

    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAnnouncements(list);

    // user
    const userSnap = await getDocs(collection(db, "users"));
    setUsers(userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    // teams
    const teamSnap = await getDocs(collection(db, "teams"));
    setTeams(teamSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // delete announcement
  const deleteAnnouncement = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await deleteDoc(doc(db, "announcements", id));
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };


  const getName = (uid) => {
    const u = users.find((user) => user.id === uid);
    return u ? u.name : uid;
  };

  const getTeamMembers = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.members || [];
  };


  const filteredAnnouncements = announcements.filter((a) => {
    if (!selectedDate) return true;
    return a.date === selectedDate;
  });

  return (
    <div style={styles.content}>
      <h1>Announcement Results</h1>

      
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={styles.dateInput}
      />

      {filteredAnnouncements.length === 0 && <p>No announcements</p>}

      {filteredAnnouncements.map((a) => {
        const responses = a.responses || {};

   
        let targetList = [];
        if (a.targetType === "all") {
          targetList = getTeamMembers(a.teamId);
        } else {
          targetList = a.targetUsers || [];
        }

   
        const yesList = targetList.filter((uid) => responses[uid] === "yes");
        const noList = targetList.filter((uid) => responses[uid] === "no");
        const notResponded = targetList.filter((uid) => !responses[uid]);

        return (
          <div key={a.id} style={styles.card}>

            <button
              onClick={() => deleteAnnouncement(a.id)}
              style={styles.deleteBtn}
            >
              ❌
            </button>

            <h3>{a.title}</h3>
            <p>{a.content}</p>
            <p>📅 {a.date}</p>

            <div style={styles.stats}>
              <p>✅ Yes: {yesList.length}</p>
              <p>❌ No: {noList.length}</p>
              <p>👥 Total: {yesList.length + noList.length}</p>
            </div>

            <div style={styles.lists}>
              <div>
                <h4>Yes</h4>
                {yesList.map((uid) => (
                  <p key={uid}>{getName(uid)}</p>
                ))}
              </div>

              <div>
                <h4>No</h4>
                {noList.map((uid) => (
                  <p key={uid}>{getName(uid)}</p>
                ))}
              </div>

              <div>
                <h4>Not Responded ({notResponded.length})</h4>
                {notResponded.map((uid) => (
                  <p key={uid}>{getName(uid)}</p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  content: {
    padding: "30px",
    flex: 1,
    background: "#f9fafb",
    minHeight: "100vh",
  },
  dateInput: {
    padding: "8px",
    marginTop: "10px",
  },
  card: {
    position: "relative",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  deleteBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "5px 8px",
  },
  stats: {
    display: "flex",
    gap: "20px",
    marginTop: "10px",
  },
  lists: {
    display: "flex",
    gap: "50px",
    marginTop: "15px",
  },
};