import { cn } from "@/utils";
import React from "react";
type Props = {
  containerStyles?: string;
};
export default function Attribution({ containerStyles }: Props) {
  return (
    <footer
      className={cn(
        "h3-semibold dark:text-light3 !text-[20px] absolute bottom-5 text-center max-w-[600px] inset-x-0 w-full mx-auto",
        containerStyles
      )}
    >
      <p>
        created by <span className="opacity-80">@Nathan-Somto</span> &copy;
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
