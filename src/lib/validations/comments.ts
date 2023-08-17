import * as z from 'zod'
const CommentValidation = z.object({
    author: z.string().nonempty(),
    tweetId: z.string().nonempty(),
    text: z.string().min(3).max(280),
    parentComment: z.string().optional()
  });
  export default  CommentValidation