import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Add this hook for easy context usage
export const useAuth = () => useContext(AuthContext);