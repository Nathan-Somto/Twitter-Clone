import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Theme, setTheme, theme } from "@/features/theme/themeSlice";
type Props = {};
function Svg({ size, type }: { size: number; type: "moon" | "sun" }) {
  return (
    <>
      {type === "sun" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 12H5M5.00006 19L7.00006 17M12 19V21M17 17L19 19M5 5L7 7M19 12H21M16.9999 7L18.9999 5M12 3V5M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-primaryWhite stroke-primaryBlack"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={size}
          width={size}
          version="1.1"
          id="Capa_1"
          viewBox="0 0 47.539 47.539"
        >
          <g>
            <g>
              <path
                className="dark:fill-primaryWhite fill-primaryBlack"
                d="M24.997,47.511C11.214,47.511,0,36.298,0,22.515C0,12.969,5.314,4.392,13.869,0.132    c0.385-0.191,0.848-0.117,1.151,0.186s0.381,0.766,0.192,1.15C13.651,4.64,12.86,8.05,12.86,11.601    c0,12.681,10.316,22.997,22.997,22.997c3.59,0,7.033-0.809,10.236-2.403c0.386-0.191,0.848-0.117,1.151,0.186    c0.304,0.303,0.381,0.766,0.192,1.15C43.196,42.153,34.597,47.511,24.997,47.511z M12.248,3.372C5.862,7.608,2,14.709,2,22.515    c0,12.68,10.316,22.996,22.997,22.996c7.854,0,14.981-3.898,19.207-10.343c-2.668,0.95-5.464,1.43-8.346,1.43    c-13.783,0-24.997-11.214-24.997-24.997C10.861,8.761,11.327,6.005,12.248,3.372z"
              />
            </g>
          </g>
        </svg>
      )}
    </>
  );
}
function ThemeChanger({}: Props) {
  const dispatch = useDispatch();
  //@ts-ignore
  const {theme: currentTheme} = useSelector(theme);
  function themeChange(themeValue: Theme) {
    if (currentTheme !== themeValue) {
      dispatch(setTheme(themeValue));
    }
  }
  return (
    <div className="flex justify-between">
      <div>
        <h4 className="h4-medium font-semibold mb-2">Application Theme</h4>
        <p className="subtle-normal dark:text-light2 opacity-80">
          Set the theme of the application to your likening
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="dark:!bg-dark2 bg-light3 !outline-none"
          >
            {currentTheme === "dark" ? (
              <Svg size={25} type={`moon`} />
            ) : (
              <Svg size={25} type={`sun`} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => themeChange("dark")}>
            <>
              <Svg size={18} type="moon" /> <span className="ml-2">Dark</span>
            </>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => themeChange("light")}>
            <>
              <Svg size={18} type="sun" /> <span className="ml-2">Light</span>
            </>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ThemeChanger;
