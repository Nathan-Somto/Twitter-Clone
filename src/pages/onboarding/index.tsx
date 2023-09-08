import AccountProfile from "@/components/form/AccountProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from '@/components/ui/loader';
import { CustomSession } from "@/types";
import Seo from "@/components/seo";

export default function OnBoardingPage() {
  const {data: session, status} = useSession()
  const router = useRouter()
  if (status === 'loading') {
    return <div className="dark:bg-primaryBlack h-screen grid place-items-center">
      <Loader size="lg"/>    
      </div>
  }
 // if user is not logged in go to sign in page
 if(status === 'unauthenticated'){
  return <div className="dark:bg-primaryBlack h-screen grid place-items-center">
    <h1 className="text-red-700 dark:text-red-400 font-semibold text-2xl">Not Authorized</h1>  
  </div>;
 }
  
  // if user has onboarded go to home page
  if((session  as CustomSession)?.user?.onBoarded){
    router.push('/home');
  }
  // the bio and profileCover should always be empty because it is assumed when you haven't onBoarded you dont have the data.
  // for edit profile it will be prefilled because we fetch data Server Side
  const user = {
    id: (session  as CustomSession)?.user?.id ?? '',
    bio: '',
    image:  (session  as CustomSession)?.user?.image ?? '/profile.svg',
    username:  (session  as CustomSession)?.user?.username ?? '',
    profileCover: '',
    name: (session  as CustomSession)?.user?.name ?? '',
  }
  return (
    <>
      <Seo
        title ={`Setup your profile for X @${(session as CustomSession)?.user?.name}`}
      />
      <nav className="w-full py-4 px-8 mx-auto dark:bg-primaryBlack bg-light3 dark:text-light2 text-dark3">
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
      </nav>
      <AccountProfile
        headingText="Setup Profile"
        user={user}
        btnTitle="Save"
        forOnboarding
      />
    </>
  );
}
