import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {};

function Logout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleLogout() {
    setLoading(true);
    try {
      const data = await signOut({ redirect: false, callbackUrl: "/sign-in" });
      router.push(data.url);
    } catch (err) {
      toast({
        description:"Failed to Logout please try again!",
        variant:'destructive'
      })
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-between">
      <div>
        <h4 className="h4-medium font-semibold mb-2">
          Logout from Application
        </h4>
        <p className="subtle-normal dark:text-light2 opacity-80">
          By pressing the button you can logout of the application
        </p>
      </div>
      <Button
        size="icon"
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-700 flex-shrink-0 disabled:opacity-50 dsiabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          height="25px"
          width="25px"
          version="1.1"
          id="Capa_1"
          viewBox="0 0 384.971 384.971"
        >
          <g>
            <g id="Sign_Out">
              <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03    C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03    C192.485,366.299,187.095,360.91,180.455,360.91z" />
              <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279    c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179    c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z" />
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </g>
        </svg>
      </Button>
    </div>
  );
}

export default Logout;
