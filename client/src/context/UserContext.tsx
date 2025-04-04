import React, { createContext, useContext, useEffect, useState } from "react";

import { voterService } from "services/voter.service";
import { IUserResponse } from "types";

// 📦 Define the shape of the context data
type UserContextType = {
  user: IUserResponse | null;
  setUser: (user: IUserResponse | null) => void;
  isAdmin: boolean;
  logout: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
};

// 🧩 Create the context (initially undefined to enforce proper usage)
const UserContext = createContext<UserContextType | undefined>(undefined);

// 👤 UserProvider wraps the app and supplies user info
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<IUserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔁 Fetch current user from backend on initial render
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await voterService.me(); // ✅ Secure call using HTTP-only cookie
      setUserState(res.data || null); // Set user if exists, else null
    } catch (err) {
      setUserState(null); // Set null if error occurs
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  // 📦 Load user data once on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // ❌ Logout user (frontend only; backend logout likely handled elsewhere)
  const logout = () => {
    setUserState(null);
  };

  // 🛡️ Check if current user is admin
  const isAdmin = user?.isAdmin === true;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: setUserState,
        isAdmin,
        logout,
        loading,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 🪝 Custom hook to access user context safely
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider"); // ✅ Guard against misuse
  return context;
};
