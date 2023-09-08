import Settings from "@/components/settings";
import React from "react";
import Header from "@/components/common/Header";
import Layout from "@/components/layout";

function SettingsPage() {
  return (
    <Layout>
      <Header titleText="Settings" />
      <Settings />
    </Layout>
  );
}

export default SettingsPage;
