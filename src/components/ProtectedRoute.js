"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        router.replace("/login");
        return;
      }

      const role = userDoc.data().role;
      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        setHasAccess(true);
      } else {
        router.replace("/login");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (loading) return <p>Loading...</p>;
  if (!hasAccess) return null;
  return children;
}