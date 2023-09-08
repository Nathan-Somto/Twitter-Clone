import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";
import SidebarSvg from "../SidebarSvg";
export type Text =
  | "Home"
  | "Explore"
  | "Bookmarks"
  | "Profile"
  | "Notifications"
  | "Messages"
  | "List"
  | "More";
export type SidebarRowProps = {
  text: Text;
  inMobile: boolean;
  hasBubble: boolean;
  bubbleText?: number;
  linkPath: string;
};

export default function SidebarRow({
  linkPath,
  inMobile,
  text,
  hasBubble,
  bubbleText,
}: SidebarRowProps) {
  return (
    <li
      className={` ${
        !inMobile ? "hidden md:block " : ""
      } transition-all ease-in duration-200 delay-75 dark:hover:xl:bg-dark4 hover:xl:bg-light2 hover:xl:rounded-full xl:px-3 xl:py-2`}
    >
      <Link
        href={linkPath}
        className="flex flex-col xl:flex-row  relative gap-1 md:gap-[8px] group items-center dark:text-primaryWhite text-primaryBlack body-bold"
      >
        <span className="relative">
          {<SidebarSvg svg={text} size="25" />}
          {hasBubble && bubbleText !== undefined && bubbleText > 0 && (
            <div className="absolute -top-4 text-primaryWhite rounded-full w-5 h-5 text-xs p-[0.12rem] bg-primaryBlue -right-2 inline-flex items-center justify-center text-center">
              <p className="small-medium">{bubbleText}</p>
            </div>
          )}
        </span>
        <span className="max-md:tiny-medium md:hidden xl:inline">{text}</span>
        <Tooltip className="md:block hidden xl:hidden">{text}</Tooltip>
      </Link>
    </li>
  );
}
