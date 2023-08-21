import { initializeTheme } from "@/features/theme/themeSlice";
import React, { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

type Props = { children: ReactNode };

function ThemeLayout({ children }: Props) {
  // initailize theme on first load
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);
  return <>{children}</>;
}

export default ThemeLayout;
