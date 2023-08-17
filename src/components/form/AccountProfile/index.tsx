import { AccountProfile } from "./AccountProfile";

export interface Props {
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    profileCover: string;
  };
  btnTitle: string;
  headingText: string;
  forOnboarding: boolean;
}

export default AccountProfile;
