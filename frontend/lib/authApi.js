"use client";
import { api } from "./api.js";

export function authApi() {
  const instance = api;
  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  });
  return instance;
}


