"use client";

import LeaderSidebar from "../../components/LeaderSidebar";

export default function LeaderLayout({ children }) {
  return (
    <div style={styles.container}>
      <LeaderSidebar />

      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex"
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#f9fafb"
  }
};