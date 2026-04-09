"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);

  // call teams
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "teams"), (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsub();
  }, []);

  // call users
  useEffect(() => {
    const q1 = query(collection(db, "users"), where("role", "==", "leader"));
    const q2 = query(collection(db, "users"), where("role", "==", "member"));

    const unsub1 = onSnapshot(q1, snap => {
      setLeaders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsub2 = onSnapshot(q2, snap => {
      setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // no duplicate user in teams
  const usedUserIds = [
    ...teams.flatMap(t => t.members || []),
    ...teams.map(t => t.leader).filter(Boolean)
  ];

  // create teams
  const createTeam = async () => {
    await addDoc(collection(db, "teams"), {
      name: "New Team",
      leader: null,
      members: []
    });
  };

  // delete teams
  const deleteTeam = async (id) => {
    await deleteDoc(doc(db, "teams", id));
  };

  // change team name
  const updateName = async (id, name) => {
    await updateDoc(doc(db, "teams", id), { name });
  };

  // set leader
  const setLeader = async (teamId, userId) => {
    await updateDoc(doc(db, "teams", teamId), {
      leader: userId
    });
  };

  // delete leader
  const removeLeader = async (teamId) => {
    await updateDoc(doc(db, "teams", teamId), {
      leader: null
    });
  };

  // add member
  const addMember = async (team, userId) => {
    if (!userId) return;

    if (team.members?.includes(userId)) {
      alert("this user is already a member of this/other team");
      return;
    }

    const updated = [...(team.members || []), userId];

    await updateDoc(doc(db, "teams", team.id), {
      members: updated
    });
  };

  // delete member
  const removeMember = async (team, userId) => {
    const updated = team.members.filter(id => id !== userId);

    await updateDoc(doc(db, "teams", team.id), {
      members: updated
    });
  };


  const getUserName = (uid) => {
    const user = [...leaders, ...members].find(u => u.id === uid);
    return user ? user.name : uid;
  };

  return (
    <div>
      <h1>Teams</h1>

      <button onClick={createTeam}>+ Create Team</button>

      <div style={styles.grid}>
        {teams.map((team) => (
          <div key={team.id} style={styles.card}>
            
            
            <input
              value={team.name}
              onChange={(e) => updateName(team.id, e.target.value)}
              style={styles.title}
            />

            
            <button
              onClick={() => deleteTeam(team.id)}
              style={styles.deleteTeam}
            >
              Delete Team
            </button>

            
            <div>
              <p>Leader</p>

              {team.leader ? (
                <div style={styles.memberRow}>
                  <span>👑 {getUserName(team.leader)}</span>
                  <button
                    onClick={() => removeLeader(team.id)}
                    style={styles.removeBtn}
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <select
                  onChange={(e) => setLeader(team.id, e.target.value)}
                >
                  <option value="">Select Leader</option>

                  {leaders
                    .filter(l => !usedUserIds.includes(l.id))
                    .map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Members */}
            <div>
              <p>Members</p>

              {team.members?.map((m) => (
                <div key={m} style={styles.memberRow}>
                  <span>{getUserName(m)}</span>

                  <button
                    onClick={() => removeMember(team, m)}
                    style={styles.removeBtn}
                  >
                    ❌
                  </button>
                </div>
              ))}

              <select onChange={(e) => addMember(team, e.target.value)}>
                <option value="">Add Member</option>

                {members
                  .filter(m => !usedUserIds.includes(m.id))
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  card: {
    width: "260px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px"
  },
  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px"
  },
  removeBtn: {
    background: "white",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "2px 6px"
  },
  deleteTeam: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "5px",
    marginBottom: "10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};