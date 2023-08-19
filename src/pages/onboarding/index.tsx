import AccountProfile from "@/components/form/AccountProfile";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Loader from '@/components/ui/loader';
import { CustomSession } from "@/types";

export default function OnBoardingPage() {
  const {data: session, status} = useSession()
  const router = useRouter()
  if (status === 'loading') {
    return <div className="dark:bg-primaryBlack h-screen grid place-items-center">
      <Loader size="lg"/>    
      </div>
  }
 // if user is not logged in go to sign in page
 if(!session){
  router.push('/sign-in');
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
      <nav className="w-full py-4 px-8 mx-auto dark:bg-primaryBlack bg-light3 dark:text-light2 text-dark3">
        <figure className="h-[30px] w-[30px] hidden md:block relative">
          <Image src={"/Logo.png"} alt="twitter logo" fill className="object-contain" />
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
