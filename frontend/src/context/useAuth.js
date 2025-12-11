import { useContext } from "react";
import { AuthContext } from "./AuthContextProvider";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider. Wrap your app with <AuthProvider> in App.jsx.");
  }
  return ctx;
}
