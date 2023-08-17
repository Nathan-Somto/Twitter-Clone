import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = { children: ReactNode };
type Theme = "light" | "dark";
type ContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>> | (() => void);
};
const ThemeContext = createContext<ContextType>({
  theme: "dark",
  setTheme() {},
});
const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const html = document.querySelector("html");
    if (html && theme) {
      if (theme === "light") {
        html.className = "";
        setTheme("light");
      } else {
        html.className = "dark";
        setTheme("dark");
      }
    }
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export { useTheme };
export default ThemeProvider;
