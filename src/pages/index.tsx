import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function IndexPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <main className="h-screen dark:bg-primaryBlack bg-primaryWhite grid place-items-center relative">
        <figure>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="sm:h-[100px] h-[80px] w-[80px] animate-pulsing sm:w-[100px]  dark:fill-primaryWhite fill-primaryBlack "
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </figure>
        <div className="h3-semibold dark:text-light3 !text-[20px] absolute bottom-5 text-center">
          <p>
            created by <span className="opacity-80">@Nathan-Somto</span> &copy;
            {new Date().getFullYear()}
          </p>
        </div>
      </main>
    );
  }
  if (!session) {
    router.push("/sign-in");
  }
  if (session) {
    router.push("/home");
  }
}
