import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CustomSession } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Loader from "@/components/ui/loader";
type Props = {
  closeModal?: () => void;
};

function Verify({ closeModal = () => {} }: Props) {
  const { data: session, update } = useSession();
  const [passcode, setPasscode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  async function handleVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if ((session as CustomSession)?.user?.isVerified) {
        toast({
          title: "Blocked Action",
          description: "You are already verified!",
          variant: "destructive",
        });
        return;
      }
      const response = await axios.put(
        `/api/users/${(session as CustomSession)?.user?.id}/verify`,
        { secretKey: passcode }
      );
      console.log(response.data);
      if (response.data?.status === "success") {
        update({
          isVerified: true,
        });
        toast({
          description: "You have unlocked twitter blue!",
        });
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        throw new Error("invalid passcode.");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast({
          description: err.message,
          variant:'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleVerification}
      className={`min-w-[150px] mt-[0.15rem]`}
    >
      <div className="mb-5">
        <input
          id="passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter Passcode"
          className="account-form_input w-full"
          aria-label="passcode"
        />
      </div>
      <Button disabled={loading} type="submit" variant={"default"}>
        {loading ? <Loader size="sm" /> : 'Save'}
      </Button>
    </form>
  );
}

export default Verify;
