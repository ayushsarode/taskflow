"use client";
import { useAuth } from "../../context/AuthContext.jsx";
import Link from "next/link";

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold tracking-tight">
          taskflow.
        </a>
        <nav className="flex items-center gap-2 text-sm">
          {isLoading ? (
            <>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
              >
                Projects
              </Link>
              <button
                onClick={logout}
                className="rounded-md px-3 py-2 bg-gray-900 text-white hover:bg-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-2 bg-gray-900 text-white hover:bg-black"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
