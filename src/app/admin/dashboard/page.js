"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome to the Church Team Management System.</p>

      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Signup Requests</h3>
          <p>Approve or reject new members.</p>
        </div>

        <div style={styles.card}>
          <h3>Users</h3>
          <p>View and manage all users.</p>
        </div>

        <div style={styles.card}>
          <h3>Teams</h3>
          <p>Create teams and assign leaders.</p>
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

const styles = {
  cards: {
    display: "flex",
    gap: "20px",
    marginTop: "30px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    width: "200px"
  }
};