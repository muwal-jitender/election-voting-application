import { IUserResponse } from "types";

const USER = "user";

export const getToken = () => {
  return localStorage.getItem(USER);
};
/**Get the User's detail from the token */
export const getUser = () => {
  const storage = localStorage.getItem(USER);
  return storage ? (JSON.parse(storage) as IUserResponse) : undefined;
};

export const isAdminUser = () => {
  const user = getUser();
  return user?.isAdmin === true;
};

export const setUser = (user: IUserResponse) => {
  localStorage.setItem(USER, JSON.stringify(user));
};
export const removeToken = () => {
  localStorage.removeItem(USER);
};
