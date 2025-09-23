"use client";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <main className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }
  if (!isAuthenticated) {
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    return null;
  }
  return children;
}


