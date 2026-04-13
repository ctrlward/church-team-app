"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(list);
    };

    fetchUsers();
  }, []);

  // change role
  const changeRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      });

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  // filtering
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchRole =
      filterRole === "all" || user.role === filterRole;

    return matchSearch && matchRole;
  });

  return (
    <div style={styles.container}>
      
      
      <div style={styles.topbar}>
        
        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div style={styles.filterBox}>
          <button
            style={filterRole === "all" ? styles.activeBtn : styles.btn}
            onClick={() => setFilterRole("all")}
          >
            All
          </button>

          <button
            style={filterRole === "leader" ? styles.activeBtn : styles.btn}
            onClick={() => setFilterRole("leader")}
          >
            Leader
          </button>

          <button
            style={filterRole === "member" ? styles.activeBtn : styles.btn}
            onClick={() => setFilterRole("member")}
          >
            Member
          </button>
        </div>
      </div>

    
      <div style={styles.list}>
        {filteredUsers.map(user => (
          <div key={user.id} style={styles.card}>

            <p><b>{user.name}</b></p>
            <p>{user.email}</p>

            <p>
              Role:{" "}
              {user.role === "admin" ? (
                <b>admin (locked)</b>
              ) : (
                <select
                  value={user.role}
                  onChange={(e) =>
                    changeRole(user.id, e.target.value)
                  }
                >
                  <option value="member">member</option>
                  <option value="leader">leader</option>
                </select>
              )}
            </p>

            <p>
              Approved: {user.approved ? "Yes" : "No"}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  topbar: {
    position: "sticky",
    top: 0,
    background: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    zIndex: 10
  },

  search: {
    padding: "8px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  filterBox: {
    display: "flex",
    gap: "10px"
  },

  btn: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    background: "#f3f4f6",
    cursor: "pointer",
    borderRadius: "5px"
  },

  activeBtn: {
    padding: "8px 12px",
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px"
  },

  list: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    background: "#f9fafb"
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "white"
  }
};