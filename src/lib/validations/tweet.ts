import * as z from 'zod'
const TweetValidation = z.object({
    text: z.string().min(3,{message: 'min number of chars is 3'}).max(280, {message: 'the max number of chars is 280'}).nonempty(),
    author: z.string().nonempty({message: 'author cannot be empty'}),
    isRetweet: z.boolean(),
    isPublic: z.boolean().default(true),
    imgUrls: z.array(z.string().url()).default([]),
    originalTweetId: z.string().optional()
})/* .refine((data) => data.isRetweet && data.originalTweetId === undefined,{
    message: 'when isRetweet is true originalTweetId is required.'
}) */
export default  TweetValidation