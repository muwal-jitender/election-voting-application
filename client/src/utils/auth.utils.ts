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

/** Reset the isAdmin to true after Forbidden error (means some tempered the local storage to IsAdmin=true)  */
export const resetFakeAdminFlag = () => {
  const user = getUser();
  if (user) setUser({ ...user, isAdmin: false });
};
export const isAdminUser = () => {
  const user = getUser();
  return user?.isAdmin === true;
};

export const setUser = (user: IUserResponse) => {
  localStorage.setItem(USER, JSON.stringify(user));
};
export const removeUser = () => {
  localStorage.removeItem(USER);
};
