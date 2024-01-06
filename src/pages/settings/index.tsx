import Settings from "@/components/settings";
import React from "react";
import Header from "@/components/common/Header";
import { RootLayout } from "@/components/layout";

function SettingsPage() {
  return (
    <RootLayout>
      <Header titleText="Settings" />
      <Settings />
    </RootLayout>
  );
}

export default SettingsPage;
