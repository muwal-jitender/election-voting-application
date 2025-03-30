const VOTING_APP_THEME = "voting-app-theme";

type THEME = "dark" | "light";
export const setTheme = (setDarkTheme: (name: THEME) => void) => {
  const currentTheme = localStorage.getItem(VOTING_APP_THEME) as THEME;
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(VOTING_APP_THEME, newTheme);
  console.log("Theme toggled to:", newTheme);

  setDarkTheme(newTheme);
};

export const getTheme = (): THEME => {
  const stored = localStorage.getItem(VOTING_APP_THEME);
  return stored === "dark" ? "dark" : "light";
};
