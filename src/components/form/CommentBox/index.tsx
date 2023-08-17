import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import CommentValidation from '@/lib/validations/comments';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Props = {
    forComment?:boolean;
    forReply?:boolean;
    tweetId?:string;
    commentId?:string;
    authorId: string;
    authorImage:string;
}

function CommentBox({tweetId,commentId, authorId,forReply, forComment, authorImage}: Props) {
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // if for comment call the ednpoint for adding comment to tweet.
    console.log(values)
  };
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      text: "",
      author: authorId,
      tweetId: tweetId ?? "",
      parentComment:commentId ?? ""
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}className="border-b dark:border-b-dark4 px-5 py-3">   
      <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex w-full  gap-3">
                <FormControl>
                  <>
                  <figure className={`relative ${forComment ? 'h-12 w-12':"h-9 w-9"} rounded-full border-2 flex-shrink-0 border-primaryBlue border-solid overflow-hidden`}>
                    <Image
                    src={authorImage}
                    alt="profile image"
                    fill
                    className="object-cover"
                    />
                  </figure>
                  <Textarea
                    rows={10}
                    className={`no-focus !border-none ${forComment ?'h4-medium placholder:h4-medium h-[100px]':'h-[60px] !min-h-[60px] base-medium'} !bg-transparent resize-none`}
                    placeholder="Add your reply..."
                    {...field}
                  />
                  <Button type="submit" className="w-[77px] flex-shrink-0 self-end h-[39px]">
                  Reply
                </Button>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
           
        </form>
    </Form>
  )
}

export default CommentBox