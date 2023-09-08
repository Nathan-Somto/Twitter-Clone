import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import VerifyForm from "@/components/form/Verify";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types";
function TwitterBlue() {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  function closeModal() {
    setOpen(false);
  }
  return (
    <div className="flex justify-between">
      <div>
        <h4 className="h4-medium font-semibold mb-2">Twitter Blue</h4>
        <p className="subtle-normal dark:text-light2 opacity-80">
          Gain access to twitter blue and stand out from the rest!
        </p>
      </div>
      <Dialog
        open={open}
        onOpenChange={() => setOpen((prevState) => !prevState)}
      >
        <DialogTrigger asChild>
          <Button
            size="icon"
            disabled={(session as CustomSession)?.user?.isVerified}
            className="bg-primaryBlue flex-shrink-0 !dsiabled:opacity-50 disabled:cursor-not-allowed"
          >
            Blue
          </Button>
        </DialogTrigger>
        <DialogContent className="dark:text-primaryWhite text-dark2 !max-w-[400px]">
          <>
            <DialogHeader>
              <DialogTitle className="!text-[25px] !font-semibold !mb-2">
                <>
                  Twitter <span className="text-primaryBlue"> Blue </span>{" "}
                  Verification
                </>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="!text-[14px] !opacity-80">
              Type in the passcode and gain access to twitter, today!
            </DialogDescription>
            <VerifyForm closeModal={closeModal} />
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TwitterBlue;
