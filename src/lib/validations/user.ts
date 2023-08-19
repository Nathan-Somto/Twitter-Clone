import * as z from 'zod'
const UserValidation = z.object({
    username: z.string().min(3).max(256).nonempty(),
    bio: z.string().optional(),
    profileImgUrl: z.string().optional(),
    profileCoverUrl: z.string().optional(),
    displayName: z.string().optional(),
    onBoarded: z.boolean().optional(),
    email: z.string().email().optional()
  });
  export default  UserValidation