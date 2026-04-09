"use client";

import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.container}>
      <AdminSidebar />

      <div style={styles.content}>
        {children} 
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
};