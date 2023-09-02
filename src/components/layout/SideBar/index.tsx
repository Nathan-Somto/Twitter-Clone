import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProfileBox from "../ProfileBox";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
import Tooltip from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { theme } from "@/features/theme/themeSlice";
function SideBar() {
  const { data: session } = useSession();
  const currentTheme = useSelector(theme);
  return (
    <nav className="sidebar md:max-w-[275px]">
      <ul className=" flex items-center xl:items-start relative gap-[4px] md:flex-col justify-between md:px-[8px] md:justify-center md:gap-[24px] xl:px-[24px] ">
        <figure className="md:h-[30px] md:w-[30px] h-[50px] w-[50px] hidden md:block relative">
          {currentTheme === "dark" ? (
            <Image
              src={"/X-dark-logo.png"}
              alt="twitter logo for dark mode"
              fill
              className="object-contain"
            />
          ) : (
            <Image
              src={"/X-light-logo.png"}
              alt="twitter logo for light mode"
              fill
              className="object-contain"
            />
          )}
        </figure>
        <li>
          <Link
            href={"/home"}
            className="flex flex-col xl:flex-row  relative gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="25"
                width="25"
                className="dark:fill-primaryWhite w-[28px] md:w-[25px] md:h-[25px] h-[28px] group-hover:fill-primaryBlue fill-primaryBlack"
              >
                <g>
                  <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
                </g>
              </svg>
            </span>
            <span className="group-hover:text-primaryBlue max-md:tiny-medium md:hidden xl:inline">
              Home{" "}
            </span>
            <Tooltip className="md:block hidden xl:hidden">Home</Tooltip>
          </Link>
        </li>
        <li>
          <Link
            href={"/search?searchTerm=%20"}
            className="flex flex-col xl:flex-row relative gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              width="25"
              className="dark:fill-primaryWhite w-[28px] md:w-[25px] md:h-[25px] h-[28px] group-hover:fill-primaryBlue fill-primaryBlack"
            >
              <g>
                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
              </g>
            </svg>
            <span className="group-hover:text-primaryBlue max-md:tiny-medium md:hidden xl:inline">
              Explore
            </span>
            <Tooltip className="md:block hidden xl:hidden">Explore</Tooltip>
          </Link>
        </li>
        <li>
          <Link
            href={`/bookmark/${(session as CustomSession)?.user?.id}`}
            className="flex flex-col xl:flex-row relative  gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 18 21"
              fill="none"
            >
              <path
                d="M16.9 20.5C16.743 20.5 16.588 20.45 16.458 20.356L8.99998 14.928L1.54198 20.358C1.31398 20.522 1.01198 20.548 0.759976 20.418C0.509976 20.291 0.349976 20.033 0.349976 19.751V2.60001C0.349976 1.36001 1.35998 0.350006 2.59998 0.350006H15.398C16.638 0.350006 17.648 1.36001 17.648 2.60001V19.75C17.648 20.032 17.49 20.29 17.238 20.418C17.132 20.473 17.015 20.5 16.898 20.5H16.9ZM8.99998 13.25C9.15497 13.25 9.30998 13.298 9.43998 13.394L16.15 18.277V2.60001C16.15 2.18801 15.813 1.85001 15.4 1.85001H2.59998C2.18698 1.85001 1.84998 2.18801 1.84998 2.60001V18.277L8.55998 13.394C8.68998 13.298 8.84498 13.25 8.99998 13.25Z"
                className="dark:fill-primaryWhite w-[28px] md:w-[25px] md:h-[25px] h-[28px] group-hover:fill-primaryBlue fill-primaryBlack"
              />
            </svg>
            <span className="group-hover:text-primaryBlue max-md:tiny-medium md:hidden xl:inline">
              Bookmarks
            </span>
            <Tooltip className="md:block hidden xl:hidden">Bookmarks</Tooltip>
          </Link>
        </li>
        <li>
          <Link
            href={`/profile/${(session as CustomSession)?.user?.id}`}
            className="flex flex-col xl:flex-row relative gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              width="25"
              className="dark:fill-primaryWhite w-[28px] md:w-[25px] md:h-[25px] h-[28px] group-hover:fill-primaryBlue fill-primaryBlack"
            >
              <g>
                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
              </g>
            </svg>
            <span className="group-hover:text-primaryBlue max-md:tiny-medium md:hidden xl:inline">
              Profile
            </span>{" "}
            <Tooltip className="md:block hidden xl:hidden">Profile</Tooltip>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/notifications/${(session as CustomSession)?.user?.id}`}
            className="flex flex-col xl:flex-row relative gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <span className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 26 26"
                className="w-[28px] md:w-[25px] md:h-[25px] h-[28px]"
              >
                <path
                  d="M25.1213 18.585C25.0963 18.565 22.4462 16.535 22.4925 11.0475C22.5175 7.88251 21.4775 5.07001 19.5588 3.12876C17.84 1.38751 15.5125 0.425006 13.0062 0.412506H12.99C10.485 0.425006 8.1575 1.38751 6.4375 3.13001C4.52 5.07126 3.4775 7.88251 3.505 11.0475C3.55125 16.46 0.979999 18.5063 0.877499 18.585C0.552499 18.8263 0.419999 19.2475 0.546249 19.6325C0.673749 20.0175 1.03375 20.2763 1.43625 20.2763H7.58625C7.71375 23.1638 10.0825 25.4763 12.9987 25.4763C15.915 25.4763 18.2812 23.1638 18.4075 20.2763H24.56C24.9625 20.2763 25.3225 20.0188 25.4475 19.6338C25.5763 19.25 25.4437 18.8275 25.1187 18.5863L25.1213 18.585ZM13 23.5975C11.1187 23.5975 9.5875 22.1263 9.465 20.275H16.535C16.41 22.125 14.8812 23.6 13 23.6V23.5975ZM3.475 18.4C4.4 16.985 5.41 14.615 5.38 11.03C5.3575 8.33001 6.185 6.05251 7.77125 4.44626C9.1375 3.06251 10.9962 2.29626 13 2.28751C15.0037 2.29751 16.8587 3.06251 18.225 4.44751C19.8125 6.05376 20.6412 8.33001 20.6187 11.0313C20.5887 14.6163 21.6 16.9875 22.525 18.4013H3.475V18.4Z"
                  className="dark:fill-primaryWhite  group-hover:fill-primaryBlue fill-primaryBlack"
                />
              </svg>
              {/* Notification Bubble */}
              <div className="absolute -top-4 rounded-full h-fit w-fit p-[0.15rem] bg-primaryBlue -right-2 flex items-center text-center">
                <p className="small-medium">100</p>
              </div>
            </span>
            <span className="group-hover:text-primaryBlue max-md:tiny-medium md:hidden xl:inline">
              Notifications
            </span>
            <Tooltip className="md:block hidden xl:hidden">
              Notifications
            </Tooltip>
          </Link>
        </li>
        <li className="hidden md:block">
          <Link
            href={"/wip"}
            className="md:flex gap-[8px] group relative items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 26 24"
                fill="none"
              >
                <path
                  d="M22.0625 0.772491H3.9375C2.04125 0.772491 0.5 2.31499 0.5 4.21249V19.8312C0.5 21.7287 2.04125 23.2725 3.9375 23.2725H22.0625C23.9587 23.2725 25.5 21.7287 25.5 19.8312V4.21249C25.5 2.31499 23.9587 0.772491 22.0625 0.772491ZM3.9375 2.64749H22.0625C22.925 2.64749 23.625 3.34749 23.625 4.20999V5.10249L13.5625 11.8112C13.2212 12.0362 12.78 12.0387 12.4375 11.8087L2.375 5.10249V4.20999C2.375 3.34749 3.075 2.64749 3.9375 2.64749ZM22.0625 21.395H3.9375C3.075 21.395 2.375 20.695 2.375 19.8325V7.29999L11.425 13.3375C11.9037 13.6575 12.4525 13.8175 13 13.8175C13.55 13.8175 14.0963 13.6575 14.575 13.3387L23.625 7.30124V19.8287C23.625 20.6912 22.925 21.3912 22.0625 21.3912V21.395Z"
                  /*                   fill="white" */
                  className="dark:fill-primaryWhite  group-hover:fill-primaryBlue fill-primaryBlack"
                />
              </svg>
            </span>
            <span className="group-hover:text-primaryBlue xl:inline hidden">
              Messages
            </span>
            <Tooltip className="md:block hidden xl:hidden">Messages</Tooltip>
          </Link>
        </li>
        <li className="hidden md:block">
          <Link
            href={"/wip"}
            className="md:flex gap-[8px] group relative items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="25"
                width="25"
                className="dark:fill-primaryWhite  group-hover:fill-primaryBlue fill-primaryBlack"
              >
                <g>
                  <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                </g>
              </svg>
            </span>
            <span className="group-hover:text-primaryBlue xl:inline hidden">
              List
            </span>
            <Tooltip className="md:block hidden xl:hidden">List</Tooltip>
          </Link>
        </li>
        <li className="hidden md:block">
          <Link
            href={"/wip"}
            className="md:flex gap-[8px] group relative items-center dark:text-primaryWhite text-primaryBlack body-bold"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M19.625 11.8125C18.4187 11.8125 17.4375 12.7962 17.4375 14C17.4375 15.2037 18.4175 16.1875 19.625 16.1875C20.83 16.1875 21.8125 15.205 21.8125 14C21.8125 12.795 20.83 11.8125 19.625 11.8125ZM19.625 14.9375C19.1075 14.9375 18.6875 14.5175 18.6875 14C18.6875 13.4837 19.1088 13.0625 19.625 13.0625C20.1412 13.0625 20.5625 13.4825 20.5625 14C20.5625 14.5162 20.1425 14.9375 19.625 14.9375ZM14 11.8125C12.7925 11.8125 11.8125 12.7962 11.8125 14C11.8125 15.2037 12.7937 16.1875 14 16.1875C15.2063 16.1875 16.1875 15.205 16.1875 14C16.1875 12.795 15.2075 11.8125 14 11.8125ZM14 14.9375C13.4825 14.9375 13.0625 14.5175 13.0625 14C13.0625 13.4837 13.4837 13.0625 14 13.0625C14.5162 13.0625 14.9375 13.4825 14.9375 14C14.9375 14.5162 14.5175 14.9375 14 14.9375ZM8.375 11.8125C7.16875 11.8125 6.1875 12.7962 6.1875 14C6.1875 15.2037 7.16875 16.1875 8.375 16.1875C9.58 16.1875 10.5625 15.205 10.5625 14C10.5625 12.795 9.57875 11.8125 8.375 11.8125ZM8.375 14.9375C7.8575 14.9375 7.4375 14.5175 7.4375 14C7.4375 13.4837 7.85875 13.0625 8.375 13.0625C8.89125 13.0625 9.3125 13.4825 9.3125 14C9.3125 14.5162 8.8925 14.9375 8.375 14.9375Z"
                  className="dark:fill-primaryWhite  group-hover:fill-primaryBlue fill-primaryBlack"
                />
                <path
                  d="M14 27.4375C6.59 27.4375 0.5625 21.41 0.5625 14C0.5625 6.59 6.59 0.5625 14 0.5625C21.41 0.5625 27.4375 6.59 27.4375 14C27.4375 21.41 21.41 27.4375 14 27.4375ZM14 2.4375C7.625 2.4375 2.4375 7.625 2.4375 14C2.4375 20.375 7.625 25.5625 14 25.5625C20.375 25.5625 25.5625 20.375 25.5625 14C25.5625 7.625 20.375 2.4375 14 2.4375Z"
                  className="dark:fill-primaryWhite  group-hover:fill-primaryBlue fill-primaryBlack"
                />
              </svg>
            </span>
            <span className="group-hover:text-primaryBlue xl:inline hidden">
              More
            </span>
            <Tooltip className="md:block hidden xl:hidden">More</Tooltip>
          </Link>
        </li>
        <Button className="xl:block hidden w-[180px] h-[50px] "> Tweet </Button>
        <Button
          size="icon"
          style={{
            boxShadow:
              "rgba(217, 217, 217, 0.2) 0px 0px 5px, rgba(217, 217, 217, 0.25) 0px 1px 4px 1px",
          }}
          className="xl:hidden md:shadow-none w-[45px] h-[45px] rounded-[50%] fixed md:relative md:right-0 md:bottom-0 z-[400] right-[30px] bottom-[100px]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="white"
            height="20"
            width="20"
          >
            <g>
              <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
            </g>
          </svg>
        </Button>
      </ul>
      <ProfileBox
        user={{
          displayName: (session as CustomSession)?.user?.name ?? "no name",
          username: (session as CustomSession)?.user?.username ?? "no username",
          profileImgUrl: (session as CustomSession)?.user?.image ?? void 0,
        }}
      />
    </nav>
  );
}

export default SideBar;
