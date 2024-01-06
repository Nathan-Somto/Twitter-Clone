import React from "react";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  children: React.ReactNode;
};

export default function SecondaryLayout({ children, ...props }: Props) {
  return (
    <main
      {...props}
      className="dark:bg-primaryBlack dark:text-primaryWhite bg-light3 text-primaryBlack  h-screen grid place-items-center"
    >
      {children}
    </main>
  );
}
