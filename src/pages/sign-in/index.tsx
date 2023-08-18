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
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";

function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  // authenticate with google.
  async function handleSignIn() {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (err) {
      let message = "Failed to Authenticate."
      if(err instanceof Error){
        message = err.message
      }
      toast({
        title: "Error While Authenticating",
        description: message,
        
      })
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="dark:bg-primaryBlack relative items-center justify-center min-h-screen flex flex-col px-[5%]  dark:text-light3 text-primaryBlack">
      <section className="max-w-[600px]">
        <figure className="h-[55px] w-[55px] mb-7 relative ">
          <Image
            src={"/Logo.png"}
            alt="twitter logo"
            fill
            priority
            className="object-cover"
          />
        </figure>
        <h1 className="font-semibold mb-9 text-[35px] md:text-[40px] lg:text-[50px]">
          Happening now
        </h1>
        <p className="h4-medium">Join today.</p>
        <Button
          disabled={isLoading}
          variant={"secondary"}
          onClick={handleSignIn}
          className="w-3/4 mt-5 mb-3  !bg-light3 shadow-xl rounded-full hover:opacity-50"
        >
          {isLoading ?(
            <Loader size="sm"/>
          ):(
          <>
            <Image
              src={"/google.svg"}
              alt="google logo"
              width={20}
              height={20}
              className="max-h-fit max-w-fit"
            />
            <span className="text-primaryBlack ml-3 base-medium">
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
      <div className="absolute bottom-2 max-w-[600px] left-0 right-0 mx-auto base-medium opacity-80 text-center">
        <p>
          Created by{" "}
          <span className="text-primaryBlue underline">Nathan Somto</span>{" "}
          &copy;{new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}

export default SigninPage;
