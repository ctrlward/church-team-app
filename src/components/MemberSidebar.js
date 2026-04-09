"use client";

import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function MemberSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Home", path: "/member/home" }
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div style={styles.sidebar}>
      
      {/* 🔝 상단 */}
      <div>
        <h2 style={styles.title}>Member Panel</h2>

        <div style={styles.menu}>
          {menu.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                ...styles.button,
                background:
                  pathname === item.path ? "#1e293b" : "transparent"
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🔻 Logout */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>

    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  title: {
    marginBottom: "30px"
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    cursor: "pointer",
    textAlign: "left"
  },
  logoutBtn: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    background: "#111827",
    cursor: "pointer",
    textAlign: "center"
  }
};