import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ChangeEvent, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UserValidation from "@/lib/validations/user";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Props } from ".";

export const AccountProfile = ({
  user,
  btnTitle,
  headingText,
  forOnboarding,
}: Props) => {
  const router = useRouter();
  const [profileCover, setProfileCover] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileImageRef = useRef<HTMLInputElement | null>(null);
  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profileImgUrl: user?.image ?? "",
      displayName: user?.name ?? "",
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      profileCoverUrl: user.profileCover ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    console.log(values);
    if (forOnboarding) {
      //set the onboarding to true
    }
    // just edit the profile as normal
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
    name: "profileImgUrl" | "profileCoverUrl"
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        if (name === "profileImgUrl") {
          setProfileImage(imageDataUrl);
        } else {
          setProfileCover(imageDataUrl);
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center min-h-screen  dark:bg-primaryBlack bg-light3 dark:text-light2 text-dark3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="max-w-[600px] w-full mx-auto px-8 py-4 space-y-10">
          <header className="text-center ">
            <h1 className="h2-semibold text-dark3 dark:text-light3">
              {headingText}
            </h1>
          </header>
          <FormField
            control={form.control}
            name="profileCoverUrl"
            render={({ field }) => (
              <FormItem className="flex w-full h-[200px] relative justify-center rounded-xl ">
                <FormLabel className="">
                  {field.value || profileCover ? (
                    <Image
                      src={(profileCover ?? field.value) as string}
                      alt="cover_image"
                      fill
                      priority
                      className="rounded-full object-cover"
                    />
                  ) : null}
                </FormLabel>
                <FormControl>
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Add Cover photo"
                      className=""
                      hidden={true}
                      ref={coverImageRef}
                      onChange={(e) =>
                        handleImage(e, field.onChange, "profileCoverUrl")
                      }
                    />
                    <button
                      type="button"
                      className="z-[90] top-0 relative"
                      onClick={() => {
                        if (coverImageRef.current) {
                          coverImageRef.current.click();
                        }
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="32"
                        width="32"
                        fill="#fff"
                      >
                        <g>
                          <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                        </g>
                      </svg>
                    </button>
                  </>
                </FormControl>
                <div className="absolute z-[5] h-full w-full inset-0 bg-[rgba(0,0,0,0.5)] rounded-xl"></div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileImgUrl"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center relative !space-y-0">
                <FormLabel className="relative">
                  <>
                    {field.value || profileImage ? (
                      <Image
                        src={(profileImage ?? field.value) as string}
                        alt="profile_image"
                        width={96}
                        height={96}
                        priority
                        className="rounded-[50%] h-[96px] w-[96px] object-cover"
                      />
                    ) : (
                      <Image
                        src="/profile.svg"
                        alt="profile_icon"
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      className=""
                      hidden={true}
                      ref={profileImageRef}
                      onChange={(e) =>
                        handleImage(e, field.onChange, "profileImgUrl")
                      }
                    />
                    <button
                      type="button"
                      className="rounded-[50%] absolute right-[-8px] bottom-0 bg-[rgba(0,0,0,0.5)] h-[40px] w-[40px] flex items-center justify-center"
                      onClick={() => {
                        if (profileImageRef.current) {
                          profileImageRef.current.click();
                        }
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="24"
                        width="24"
                        fill="#fff"
                        className="dark:fill-primaryWhite fill-primaryBlack"
                      >
                        <g>
                          <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                        </g>
                      </svg>
                    </button>
                  </>
                </FormLabel>
                <FormControl>
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      className=""
                      hidden={true}
                      ref={profileImageRef}
                      onChange={(e) =>
                        handleImage(e, field.onChange, "profileImgUrl")
                      }
                    />
                  </>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-semibold dark:text-light3 !text-[20px]">
                  Name
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="no-focus account-form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="body-semibold dark:text-light3 !text-[20px]">
                  Username
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="body-semibold dark:text-light3 !text-[20px]">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className="no-focus account-form_input resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primaryBlue min-w-[120px] w-full h-12"
          >
            {btnTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};
