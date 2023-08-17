import AccountProfile from "@/components/form/AccountProfile";
import Image from "next/image";
export default function onBoardingPage() {
  return (
    <>
      <nav className="w-full py-4 px-8 mx-auto dark:bg-primaryBlack bg-light3 dark:text-light2 text-dark3">
        <figure className="h-[30px] w-[30px] hidden md:block relative">
          <Image src={"/Logo.png"} alt="twitter logo" fill />
        </figure>
      </nav>
      <AccountProfile
        headingText="Setup Profile"
        user={{
          id: "123456",
          bio: "i love coding",
          image: "/dummy/avatar-1.jpg",
          name: "nathan somto",
          username: "nathan-somto",
          profileCover: "",
        }}
        btnTitle="Save"
        forOnboarding
      />
    </>
  );
}
