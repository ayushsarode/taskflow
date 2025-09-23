"use client";
export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-black/90 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


