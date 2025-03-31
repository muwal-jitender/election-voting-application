import React, { createContext, useContext, useEffect, useState } from "react";

import { voterService } from "services/voter.service";
import { IUserResponse } from "types";

type UserContextType = {
  user: IUserResponse | null;
  setUser: (user: IUserResponse | null) => void;
  isAdmin: boolean;
  logout: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<IUserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await voterService.me(); // HTTP-only cookie sends auth
      if (res.data) {
        setUserState(res.data);
      } else {
        setUserState(null);
      }
    } catch (err) {
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUserState(null);
  };

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
