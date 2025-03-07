import { jwtDecode, JwtPayload } from "jwt-decode";

interface IUser extends JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}
export const getToken = () => {
  return localStorage.getItem("token");
};
/**Get the User's detail from the token */
export const getUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return jwtDecode<IUser>(token);
  }
};

export const isAdminUser = () => {
  const user = getUser();
  return user?.isAdmin === true;
};

export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false; // ✅ No token means user is NOT logged in

  try {
    const decoded = jwtDecode<IUser>(token);

    if (!decoded.exp) return true; // ✅ If no expiry, assume valid (not ideal, but safe)

    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    return decoded.exp > currentTime; // ✅ Returns true if token is still valid
  } catch (error) {
    return false; // ✅ Invalid token means user is NOT logged in
  }
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};
export const removeToken = () => {
  localStorage.removeItem("token");
};
