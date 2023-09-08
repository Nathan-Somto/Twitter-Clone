import Seo from "@/components/seo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import React from "react";
export default function ErrorPage() {
  const router = useRouter();
  return (
    <>
      <Seo title="Error / X" />
      <main className="h-screen dark:bg-primaryBlack bg-primaryWhite grid place-items-center relative">
        <nav className="fixed inset-0 w-full h-16 px-6 flex">
          <figure role="navigation" onClick={() => router.push("/home")}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className=" h-8 w-8  dark:fill-primaryWhite fill-primaryBlack "
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </figure>
        </nav>
        <section className="px-6 mt-4">
          <h1 className="text-[28px] md:text-[32px] font-semibold mb-1">
            Oops, Something horrible just happened!
          </h1>
          <p className="!base-medium opacity-70">
            It&rsquo;s not your fault, please press the retry button.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-lg mt-2"
          >
            Retry
          </Button>
        </section>
      </main>
    </>
  );
}
