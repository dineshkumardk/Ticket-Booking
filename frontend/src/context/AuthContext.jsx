import { useState } from "react";
import { AuthContext } from "./AuthContextProvider";

export function AuthProvider({ children }) {
  const [role, setRole] = useState("user");

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}