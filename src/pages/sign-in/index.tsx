import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";
import Seo from "@/components/seo";
import { CustomSession } from "@/types";
import { useRouter } from "next/router";
import { SecondaryLayout } from "@/components/layout";
import Attribution from "@/components/common/Attribution";


function SigninPage() {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [isLoading, setIsLoading] = useState(false);
  if (status === "loading") {
    return (
     <SecondaryLayout>
       <Loader size="lg" />
     </SecondaryLayout>
     
    );
  }
 
  // check if the user is already logged in if so push them out.
  if ((session as CustomSession)?.user) {
    router.push("/home");  
  }
  // authenticate with google.
  async function handleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      let message = "Failed to Authenticate.";
      if (err instanceof Error) {
        message = err.message;
      }
      toast({
        title: "Error While Authenticating",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
    <Seo
    title="Find out what's happening on X"
    />
    <main className="dark:bg-primaryBlack relative bg-primaryWhite justify-center lg:justify-around items-center  min-h-screen flex  px-6  dark:text-light3 text-primaryBlack">
      <aside>
        <figure>
          {/* X logo */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="max-h-[400px] max-w-[400px] w-full mx-auto hidden lg:block relative dark:fill-primaryWhite fill-primaryBlack "
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </figure>
      </aside>
      <section className="max-w-[600px] w-full flex-shrink-0">
        <figure className="mb-2">
          {/* X logo */}
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[30px] w-[30px]  relative dark:fill-primaryWhite fill-primaryBlack "
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </figure>
        <h1 className="font-semibold mb-5 text-[48px] md:text-[60px] lg:text-[70px]">
          Happening now
        </h1>
        <p className="font-medium opacity-[0.75] text-[17.5px] sm:text-[25px] lg:text-[35px]">Join today.</p>
        <Button
          disabled={isLoading}
          variant={"secondary"}
          onClick={handleSignIn}
          className="w-full max-w-[300px] mt-5 mb-3  !bg-light3 shadow-xl rounded-full hover:opacity-50 md:!h-12"
        >
          {isLoading ? (
            <Loader size="sm" />
          ) : (
            <>
              <Image
                src={"/google.svg"}
                alt="google logo"
                width={20}
                height={20}
                className="max-h-fit max-w-fit"
              />
              <span className="text-primaryBlack ml-3 base-medium md:!text-[16.5px]">
                Sign up with Google
              </span>
            </>
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger className="opacity-80 small-medium">
            <>
              By sigining up you agree to the{" "}
              <span className="text-primaryBlue underline">
                Terms of Service
              </span>
            </>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>For Educational Purposes</AlertDialogTitle>
              <AlertDialogDescription>
                This Twitter clone was built for educational pursposes i have no
                affliation with twitter, i just wanted to build a full stack app
                to add to my portfolio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
     <Attribution/>
    </main>
    </>
  );
}

export default SigninPage;
