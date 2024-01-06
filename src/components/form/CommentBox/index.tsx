import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import CommentValidation from "@/lib/validations/comments";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Replies,
  addCommentToTweet,
  addReplyToComment,
  Comment,
} from "@/features/tweets/tweetsSlice";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";

type Props =
  | {
      forComment: true;
      forReply?: never;
      tweetId: string;
      commentId?: never;
    }
  | {
      forReply: true;
      forComment?: never;
      tweetId: string;
      commentId: string;
    };

function CommentBox({ tweetId, commentId, forReply, forComment }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/comment`, values);
      console.log(response.data);
      if (response.data?.status !== "success") {
        throw new Error(response.data);
      }
      if (forReply) {
        dispatch(
          addReplyToComment({
            comment_id: commentId,
            reply: response.data.reply as Replies,
          })
        );
      } else {
        dispatch(addCommentToTweet(response.data.comment as Comment));
      }
      toast({
        description: `successfully added ${forReply ? "reply" : "comment"} to ${
          forReply ? "comment" : "tweet"
        }.`,
      });
      form.reset();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast({
        description: `failed to add ${forReply ? "reply" : "comment"} to ${
          forReply ? "comment" : "tweet"
        }.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      text: "",
      author: (session as CustomSession)?.user?.id ?? "",
      tweetId: tweetId ?? "",
      parentComment: commentId ?? void 0,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-b dark:border-b-dark4 px-5 py-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex w-full  gap-3">
              <FormControl>
                <>
                  <figure
                    className={`relative ${
                      forComment ? "h-12 w-12" : "h-9 w-9"
                    } rounded-full border-2 flex-shrink-0 border-primaryBlue border-solid overflow-hidden`}
                  >
                    {(session as CustomSession)?.user?.image ? (
                      <Image
                        src={(session as CustomSession)?.user?.image as string}
                        alt="profile image"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src={"/profile.svg"}
                        alt="profile image"
                        fill
                        className="object-cover"
                      />
                    )}
                  </figure>
                  <Textarea
                    rows={10}
                    className={`no-focus !border-none ${
                      forComment
                        ? "md:h4-medium base-medium md:placeholder-base-medium md:placholder:h4-medium h-[100px]"
                        : "h-[60px] !min-h-[60px] base-medium"
                    } !bg-transparent resize-none`}
                    placeholder="Add your reply..."
                    {...field}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-[77px] flex-shrink-0 self-end h-[39px]"
                  >
                    {loading ? <Loader size="sm" /> : "Reply"}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default CommentBox;
