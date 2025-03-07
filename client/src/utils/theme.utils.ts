const VOTING_APP_THEME = "voting-app-theme";
export const setTheme = (setDarkTheme: (name: "dark" | "") => void) => {
  const currentTheme = localStorage.getItem(VOTING_APP_THEME);
  const newTheme = currentTheme === "dark" ? "" : "dark";
  localStorage.setItem(VOTING_APP_THEME, newTheme);
  setDarkTheme(newTheme);
};

export const getTheme = () => {
  return localStorage.getItem(VOTING_APP_THEME) ?? "";
};
