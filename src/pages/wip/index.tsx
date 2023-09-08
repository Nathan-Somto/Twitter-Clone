import Seo from "@/components/seo";
import Image from "next/image";
import React from "react";
import Link from 'next/link';
type Props = {};

function WipPage({}: Props) {
  return (
    <>
      <Seo
        title="Work in Progress / X"
        description="Please bear with the team as this page is under construction"
      />
      <main className="dark:bg-primaryBlack dark:text-primaryWhite bg-light3 text-primaryBlack  h-screen grid place-items-center">
      <nav className="w-full fixed inset-0 h-20 py-4 px-8 mx-auto flex items-center dark:bg-primaryBlack bg-light3 dark:text-light2 text-dark3">
        <Link href="/home">
        <figure>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:h-[30px] md:w-[30px] h-[50px] w-[50px]  dark:fill-primaryWhite fill-primaryBlack "
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </figure>
        </Link>
      </nav>
        <section className="space-y-4 text-center">
          <figure className="h-[250px] mx-auto w-[250px] relative">
            <Image
              src={"/work-in-progress.png"}
              fill
              alt="consruction poster"
              priority
              className="object-contain"
            />
          </figure>
          <div>
            <h2 className="text-4xl font-semibold mb-3">
             Work in Progress
            </h2>
            <p className="opacity-80 w-[80%] mx-auto">
              If you would like for this page to be implemented consider opening
              an issue and contributing to the repo!
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default WipPage;
