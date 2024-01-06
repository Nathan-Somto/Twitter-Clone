import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TweetValidation from "@/lib/validations/tweet";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useTransition,
  memo,
} from "react";
import dynamic from "next/dynamic";
import { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { uploadFiles, cn } from "@/utils";
import axios from "axios";
import Loader from "@/components/ui/loader";
import { useDispatch } from "react-redux";
import { Tweet, addNewTweet } from "@/features/tweets/tweetsSlice";
import { useRouter } from "next/router";
import { type Props as EmojiPickerProps } from "emoji-picker-react";
// to avoid server rendering
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);
// to ensure that only when the  props passed to emoji picker change, a re-render occurs.
const MemoEmojiPicker: React.NamedExoticComponent<EmojiPickerProps> = memo(
  function EmojiPickerComp({ ...Props }: EmojiPickerProps) {
    return <EmojiPicker {...Props} />;
  }
);

type Props = {
  toggleModal?: () => void;
};
function TweetBox({ toggleModal }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [showEmojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Everyone");
  const [emojiPickerObject, setEmojiPickerObject] =
    useState<EmojiClickData | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [imgFile, setImgFile] = useState<File[]>([]);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof TweetValidation>>({
    resolver: zodResolver(TweetValidation),
    defaultValues: {
      text: "",
      author: (session as CustomSession)?.user?.id ?? "1234",
      isPublic: true,
      isRetweet: false,
      imgUrls: [],
    },
  });

  const disableButton = form.getValues("text").length < 3 || isLoading;
  const onSubmit = useCallback(
    async (values: z.infer<typeof TweetValidation>) => {
      setIsLoading(true);
      try {
        // modify isPublic based on user selection.
        values.isPublic = status === "Everyone";
        // check if user is logged in
        if (!(session as CustomSession)?.user?.id || values.author === "1234") {
          throw new Error("The User must be logged in before you can tweet.");
        }
        // upload image to uploadthing if there is.
        let uploadedImgUrl = "";
        if (imgFile.length) {
          const uploadedResponse = await uploadFiles({
            endpoint: "imageUploader",
            files: imgFile,
          });
          uploadedImgUrl = uploadedResponse[0].url;
        }
        // get image url.
        if (uploadedImgUrl) {
          values.imgUrls.push(uploadedImgUrl);
        }
        // update the db.
        const response = await axios.post(
          `/api/users/${(session as CustomSession)?.user?.id}/tweet`,
          values
        );
        // check if successfull
        if (response.data?.status === "failed") {
          throw new Error("Internal Server Error");
        }
        if (response.data?.issues) {
          throw new Error("Your Tweet was not accepted by X");
        }

        // get the newly created tweet add to the tweet state, if it is the home page or the user profile page.
        if (
          router.pathname === "/home" ||
          router.pathname === `/profile/${(session as CustomSession)?.user?.id}`
        ) {
          dispatch(addNewTweet(response.data.tweet as unknown as Tweet));
        }
        toast({
          description: "Successfully Created Tweet.",
        });
        // when we have succeeded with everything reset.
        form.reset();
        if (imgUrl) {
          setImgUrl("");
          setImgFile([]);
        }
        // if it is being displayed on a modal close it.
        if (toggleModal) {
          toggleModal();
        }
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: "Failed to Create Tweet",
            description: err.message,
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dispatch, imgFile, session, status]
  );
  function handleEmojiClick(emojiDataObj: EmojiClickData, _: MouseEvent) {
    // append emoji to text area value.
    const updatedValue = form.getValues("text") + emojiDataObj.emoji;
    setEmojiPickerObject(emojiDataObj);
    form.setValue("text", updatedValue);
  }
  function toggleEmojiPicker() {
    // toggle emoji appearance
    startTransition(() => {
      setEmojiPicker((prevState) => !prevState);
    });
  }
  function handleImageSelect(
    e: ChangeEvent<HTMLInputElement> & { files: FileList }
  ) {
    if (e.target.files && e.target.files.length) {
      const fileReader = new FileReader();
      fileReader.onload = function (fileEvt) {
        setImgUrl(fileEvt.target?.result as string);
      };
      const file = Array.from(e.target.files);
      setImgFile(file);
      fileReader.readAsDataURL(e.target.files[0]);
    }
  }
  function clickFileInput() {
    if (imgRef.current !== null) {
      imgRef.current.click();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col relative gap-3 min-h-[130px] py-[10px] px-[25px]  border-b border-b-light3 dark:border-b-dark3"
      >
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-primaryBlue w-[120px] rounded-full bg-light3 py-[0.15rem] px-[0.165rem] dark:bg-dark3 outline-none "
        >
          <option>Everyone</option>
          <option>Followers</option>
        </select>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl className="no-focus bg-transparent text-light1">
                <div className="flex gap-[4px]">
                  <figure className="relative h-12 w-12 flex-shrink-0 block">
                    {(session as CustomSession)?.user?.image ? (
                      <Image
                        src={(session as CustomSession)?.user?.image as string}
                        alt="profile image"
                        fill
                        className="cursor-pointer rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src={"/profile.svg"}
                        alt="profile image"
                        fill
                        className="cursor-pointer rounded-full object-cover"
                      />
                    )}
                  </figure>
                  <Textarea
                    rows={8}
                    {...field}
                    className="resize-none !min-h-[60px] !text-[20px] !h-[60px] !focus-visible:border-transparent regular-medium !border-none placeholder:regular-medium !rounded-none !bg-transparent outline-none"
                    placeholder="Whats Happening?"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {imgUrl && (
          <figure className="h-[300px] w-[80%] rounded-[10px] relative overflow-hidden mx-auto my-[6px]">
            <button
              type="button"
              onClick={() => setImgUrl("")}
              className="absolute top-[15px] hover:opacity-50 right-[15px] bg-dark2 flex rounded-full items-center justify-center z-[2] h-8 w-8"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="#fff"
                height="24"
                width="24"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </button>
            <Image
              src={imgUrl}
              fill
              alt="preview image"
              className="object-cover"
            />
          </figure>
        )}
        <div className="min-[450px]:items-center gap-[16px] min-[450px]:gap-0 flex-col min-[450px]:flex-row flex justify-between min-[450px]:ml-[64px]">
          <div className="space-x-6">
            {/* Image btn */}
            <button
              onClick={clickFileInput}
              type="button"
              className="hover:scale-125 ease-out transition-all duration-250"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.75 0H2.25C1.01 0 0 1.01 0 2.25V17.75C0 18.99 1.01 20 2.25 20H17.75C18.99 20 20 18.99 20 17.75V2.25C20 1.01 18.99 0 17.75 0ZM2.25 1.5H17.75C18.163 1.5 18.5 1.837 18.5 2.25V11.926L14.642 8.068C14.502 7.928 14.312 7.848 14.112 7.848H14.109C13.909 7.848 13.716 7.928 13.577 8.072L9.26 12.456L7.447 10.65C7.307 10.51 7.117 10.43 6.917 10.43C6.724 10.4 6.522 10.51 6.382 10.657L1.5 15.642V2.25C1.5 1.837 1.837 1.5 2.25 1.5ZM1.506 17.78L6.924 12.246L13.206 18.5H2.25C1.848 18.5 1.523 18.178 1.506 17.78ZM17.75 18.5H15.33L10.323 13.513L14.115 9.663L18.5 14.047V17.75C18.5 18.163 18.163 18.5 17.75 18.5Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M6.86793 7.851C7.71955 7.851 8.40993 7.16062 8.40993 6.309C8.40993 5.45738 7.71955 4.767 6.86793 4.767C6.0163 4.767 5.32593 5.45738 5.32593 6.309C5.32593 7.16062 6.0163 7.851 6.86793 7.851Z"
                  fill="#1DA1F2"
                />
              </svg>
            </button>
            {/* Gif btn */}
            <button
              type="button"
              className="hover:scale-125 ease-out transition-all duration-250"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
              >
                <path
                  d="M17.9999 8.49999V6.79999H13.5999V13.2H15.2999V11.2H17.2999V9.49999H15.2999V8.49999H17.9999ZM10.6999 6.79999H12.3999V13.2H10.6999V6.79999ZM7.0999 8.39999C7.4999 8.39999 7.9999 8.59999 8.2999 8.89999L9.4999 7.89999C8.8999 7.19999 7.9999 6.79999 7.0999 6.79999C5.2999 6.79999 3.8999 8.19999 3.8999 9.99999C3.8999 11.8 5.2999 13.2 7.0999 13.2C8.0999 13.2 8.8999 12.8 9.4999 12.1V9.59999H6.6999V10.8H7.8999V11.4C7.6999 11.5 7.3999 11.6 7.0999 11.6C6.1999 11.6 5.4999 10.9 5.4999 9.99999C5.4999 9.19999 6.1999 8.39999 7.0999 8.39999Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M19.5 0.019989H2.5C1.26 0.019989 0.25 1.02699 0.25 2.26699V17.774C0.25 19.012 1.26 20.02 2.5 20.02H19.5C20.74 20.02 21.75 19.012 21.75 17.774V2.26699C21.75 1.02699 20.74 0.019989 19.5 0.019989ZM20.25 17.774C20.25 18.184 19.914 18.52 19.5 18.52H2.5C2.086 18.52 1.75 18.184 1.75 17.774V2.26699C1.75 1.85499 2.086 1.51999 2.5 1.51999H19.5C19.914 1.51999 20.25 1.85499 20.25 2.26699V17.774Z"
                  fill="#1DA1F2"
                />
              </svg>
            </button>
            {/* Poll Btn */}
            <button
              type="button"
              className="hover:scale-125 ease-out transition-all duration-250"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18.222 7.16H16.888C16.903 7.07 16.916 6.978 16.916 6.883V4.57C16.916 3.59 16.119 2.793 15.138 2.793H1.5V1.358C1.5 0.944002 1.164 0.608002 0.75 0.608002C0.336 0.608002 0 0.944002 0 1.358V18.83C0 19.245 0.336 19.58 0.75 19.58C1.164 19.58 1.5 19.245 1.5 18.83V17.396H12.056C13.036 17.396 13.834 16.599 13.834 15.619V13.306C13.834 13.211 13.82 13.119 13.806 13.028H18.223C19.203 13.028 20.001 12.23 20.001 11.25V8.94C20.001 7.957 19.204 7.16 18.223 7.16H18.222ZM15.14 4.293C15.292 4.293 15.417 4.417 15.417 4.57V6.88C15.417 7.034 15.292 7.16 15.139 7.16H1.5V4.29H15.14V4.293ZM12.333 13.307V15.619C12.333 15.772 12.208 15.896 12.055 15.896H1.5V13.028H12.056C12.209 13.028 12.333 13.154 12.333 13.308V13.307ZM18.5 11.25C18.5 11.403 18.375 11.527 18.222 11.527H1.5V8.66H18.222C18.375 8.66 18.5 8.784 18.5 8.937V11.25Z"
                  fill="#1DA1F2"
                />
              </svg>
            </button>
            {/* Emoji btn */}
            <button
              type="button"
              className="hover:scale-125 ease-out disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-250"
              onClick={toggleEmojiPicker}
              disabled={isPending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M11 21.75C5.072 21.75 0.25 16.928 0.25 11C0.25 5.072 5.072 0.25 11 0.25C16.928 0.25 21.75 5.072 21.75 11C21.75 16.928 16.928 21.75 11 21.75ZM11 1.75C5.9 1.75 1.75 5.9 1.75 11C1.75 16.1 5.9 20.25 11 20.25C16.1 20.25 20.25 16.1 20.25 11C20.25 5.9 16.1 1.75 11 1.75Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M11 16.115C9.10801 16.115 7.36701 15.165 6.34401 13.571C6.12001 13.223 6.22101 12.761 6.57001 12.536C6.91801 12.31 7.38201 12.412 7.60601 12.762C8.35301 13.924 9.62201 14.617 11.001 14.617C12.38 14.617 13.649 13.924 14.397 12.763C14.621 12.413 15.085 12.313 15.433 12.538C15.783 12.762 15.883 13.226 15.659 13.574C14.634 15.168 12.893 16.119 11.001 16.119L11 16.115Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M13.738 9.93601C14.5543 9.93601 15.216 9.27429 15.216 8.45801C15.216 7.64173 14.5543 6.98001 13.738 6.98001C12.9217 6.98001 12.26 7.64173 12.26 8.45801C12.26 9.27429 12.9217 9.93601 13.738 9.93601Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M8.26194 9.93601C9.07821 9.93601 9.73994 9.27429 9.73994 8.45801C9.73994 7.64173 9.07821 6.98001 8.26194 6.98001C7.44566 6.98001 6.78394 7.64173 6.78394 8.45801C6.78394 9.27429 7.44566 9.93601 8.26194 9.93601Z"
                  fill="#1DA1F2"
                />
              </svg>
            </button>
            {/* Schedule btn */}
            <button
              type="button"
              className="hover:scale-125 ease-out transition-all duration-250"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M-37.9 17C-38 16.9 -38 16.9 -38 16.8C-37.9 16.8 -37.9 16.9 -37.9 17ZM18 1.20001H16.7V0.900006C16.7 0.500006 16.4 0.100006 15.9 0.100006C15.5 0.100006 15.1 0.400006 15.1 0.900006V1.20001H7.7V0.900006C7.7 0.500006 7.4 0.100006 6.9 0.100006C6.5 0.100006 6.1 0.400006 6.1 0.900006V1.20001H4.8C3.4 1.20001 2.3 2.30001 2.3 3.70001V16.8C2.3 18.2 3.4 19.3 4.8 19.3H7.7C8.1 19.3 8.5 19 8.5 18.5C8.5 18.1 8.2 17.7 7.7 17.7H4.8C4.2 17.7 3.8 17.2 3.8 16.7V6.90001C3.8 6.60001 4.2 6.20001 4.8 6.20001H18C18.6 6.20001 19 6.60001 19 6.90001V8.70001C19 9.10001 19.3 9.50001 19.8 9.50001C20.2 9.50001 20.6 9.20001 20.6 8.70001V3.70001C20.5 2.30001 19.4 1.20001 18 1.20001ZM19 4.90001C18.7 4.80001 18.3 4.70001 18 4.70001H4.8C4.4 4.70001 4.1 4.80001 3.8 4.90001V3.70001C3.8 3.10001 4.3 2.70001 4.8 2.70001H6.1V3.20001C6.1 3.60001 6.4 4.00001 6.9 4.00001C7.3 4.00001 7.7 3.70001 7.7 3.20001V2.70001H15.2V3.20001C15.2 3.60001 15.5 4.00001 16 4.00001C16.4 4.00001 16.8 3.70001 16.8 3.20001V2.70001H18C18.6 2.70001 19 3.20001 19 3.70001V4.90001Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M15.5 9.39999C12.1 9.39999 9.30005 12.2 9.30005 15.6C9.30005 19 12.1 21.8 15.5 21.8C18.9 21.8 21.7 19 21.7 15.6C21.7 12.2 18.9 9.39999 15.5 9.39999ZM15.5 20.4C12.9 20.4 10.8 18.3 10.8 15.7C10.8 13.1 12.9 11 15.5 11C18.1 11 20.2 13.1 20.2 15.7C20.2 18.2 18.1 20.4 15.5 20.4Z"
                  fill="#1DA1F2"
                />
                <path
                  d="M18.9 17.7C18.8 17.9 18.5 18.1 18.3 18.1C18.2 18.1 18 18.1 17.9 18L14.8 16V13C14.8 12.6 15.1 12.2 15.6 12.2C16 12.2 16.4 12.5 16.4 13V15.2L18.8 16.7C19 16.9 19.1 17.3 18.9 17.7Z"
                  fill="#1DA1F2"
                />
              </svg>
            </button>
          </div>
          <Button
            type="submit"
            disabled={disableButton}
            className="w-[77px] h-[39px]"
          >
            <>{isLoading ? <Loader size="sm" /> : "Tweet"}</>
          </Button>
        </div>
        <div
          className={cn(
            "absolute bottom-[-360px] z-[50]",
            !showEmojiPicker && "hidden"
          )}
        >
          <MemoEmojiPicker
            emojiStyle={EmojiStyle.TWITTER}
            onEmojiClick={handleEmojiClick}
            height={350}
          />
        </div>
        <input
          type="file"
          ref={imgRef}
          onChange={handleImageSelect}
          name="imgUrl"
          accept=".jpg, .png, .jpg, .webp"
          hidden={true}
        />
      </form>
    </Form>
  );
}

export default TweetBox;
