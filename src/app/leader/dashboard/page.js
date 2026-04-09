"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import ProtectedRoute from "../../../components/ProtectedRoute";

function LeaderDashboard() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // bring only my team
      const q = query(
        collection(db, "teams"),
        where("leader", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return;

      const docSnap = snapshot.docs[0];
      const myTeam = { id: docSnap.id, ...docSnap.data() };

      setTeam(myTeam);

      // members info
      const users = [];

      for (let uid of myTeam.members || []) {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          users.push({ id: uid, ...userSnap.data() });
        }
      }

      setMembers(users);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Leader Dashboard</h1>

      {!team && <p>No team assigned</p>}

      {team && (
        <>
          <h2>Team: {team.name}</h2>
          <p>Total Members: {members.length}</p>

          <h3>Member List</h3>

          {members.length === 0 && <p>No members in this team</p>}

          {members.map((m) => (
            <div key={m.id} style={styles.card}>
              <p><b>{m.name}</b></p>
              <p>{m.email}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["leader"]}>
      <LeaderDashboard />
    </ProtectedRoute>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "white"
  }
};