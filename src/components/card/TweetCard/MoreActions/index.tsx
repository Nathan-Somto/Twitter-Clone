import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
type status = "Everyone" | "Followers";
type Props = {
  isUserTweet: boolean;
  handleDelete: () => Promise<void>;
  handleStatusUpdate: (str: status) => Promise<void>;
  isPublic: boolean;
  author: {
    displayName: string;
  };
};

export default function MoreActions({
  isUserTweet,
  handleDelete,
  handleStatusUpdate,
  author,
  isPublic,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<status | null>(null);
  function handleDisable(str: status) {
    return (
      (currentStatus !== null
        ? currentStatus === str
        : str === "Everyone"
        ? isPublic
        : !isPublic) || disableBtn
    );
  }
  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={() => setOpen((prevState) => !prevState)}
      >
        <DropdownMenuTrigger
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {/* More Horizontal */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#8899A6"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
          >
            <g data-name="Layer 2">
              <g data-name="more-horizotnal">
                <rect width="24" height="24" opacity="0" />

                <circle cx="12" cy="12" r="2" />

                <circle cx="19" cy="12" r="2" />

                <circle cx="5" cy="12" r="2" />
              </g>
            </g>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isUserTweet ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={disableBtn}
                onClick={async (e) => {
                  e.stopPropagation();
                  setDisableBtn(true);
                  try {
                    await handleDelete();
                    setOpen(false);
                  } catch (err) {
                  } finally {
                    setDisableBtn(false);
                  }
                }}
              >
                <span>
                  {/* Trash */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                      stroke="#E53935"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-[#e53935] ml-2">Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub
                open={openSub}
                onOpenChange={() => setOpenSub((prevState) => !prevState)}
              >
                <DropdownMenuSubTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSub(true);
                  }}
                >
                  <span className="text-[#8899A6]">Change Visibility</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="dark:!bg-dark2  !bg-primaryWhite">
                    <DropdownMenuItem
                      disabled={handleDisable("Everyone")}
                      className="data-[disabled]:cursor-not-allowed"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setDisableBtn(true);
                        try {
                          await handleStatusUpdate("Everyone");
                          setCurrentStatus("Everyone");
                          setOpen(false);
                        } catch (err) {
                        } finally {
                          setDisableBtn(false);
                        }
                      }}
                    >
                      <span>
                        {/* Earth */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          viewBox="0 0 25 25"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.9 19.4303V16.7515L11.5203 15.1312L8.60296 13.4642L7.6 12.2105V13L6.4382 13.2107L5.3943 10.4269C5.20272 11.0847 5.1 11.7804 5.1 12.5C5.1 15.672 7.09572 18.3778 9.9 19.4303ZM15.6 5.77866V11.4485L13.7515 9.6H11.3L10.2922 10.9437L10.7485 11.4H12.6V12.8183L13.3211 13.9H15.7172L18.7651 16.4399C19.484 15.2991 19.9 13.9481 19.9 12.5C19.9 9.52001 18.1385 6.95143 15.6 5.77866ZM15.6 4.47567C18.8178 5.71962 21.1 8.84329 21.1 12.5C21.1 17.2497 17.2496 21.1 12.5 21.1C7.75035 21.1 3.9 17.2497 3.9 12.5C3.9 7.75035 7.75035 3.9 12.5 3.9C13.5164 3.9 14.4915 4.07631 15.3966 4.4H15.6V4.47567Z"
                            fill="#8899A6"
                          />
                        </svg>
                      </span>
                      <span className="text-[#8899A6] ml-2">Everyone</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={handleDisable("Followers")}
                      className="data-[disabled]:cursor-not-allowed"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setDisableBtn(true);
                        try {
                          await handleStatusUpdate("Followers");
                          setCurrentStatus("Followers");
                          setOpen(false);
                        } catch (err) {
                        } finally {
                          setDisableBtn(false);
                        }
                      }}
                    >
                      {/* User followers */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#8899A6"
                        width="20px"
                        height="20px"
                        viewBox="0 0 1024 1024"
                      >
                        <path d="M63.504 959.76l.002-64.942c0-25.44 19.103-33.424 26.72-36.944l281.04-132.624c20.143-9.248 34.047-28.32 36.752-50.32 2.72-22-6.16-43.84-23.457-57.712-66.48-53.376-97.456-170.704-97.456-233.185v-159.92c0-66.864 116.4-159.856 224.128-159.856 108.672 0 223.936 91.536 223.936 159.856v159.92c0 61.552-25.6 179.312-94.256 233.376a63.99 63.99 0 0 0-23.967 57.808c2.624 22.16 16.591 41.313 36.847 50.624l162.24 77.248 38.144-54.064-173.664-81.344c88.656-69.776 118.656-206.849 118.656-283.665v-159.92C799.169 118.176 652.545.241 511.233.241S223.105 118.177 223.105 224.096v159.92c0 69.872 31.888 211.248 121.392 283.088L63.457 799.76S-.495 828.256-.495 863.728v96.032c0 35.344 28.64 63.968 63.951 63.968h639.712l-52-63.984zm948.706-236.253c-13.904-10.912-34.032-8.432-44.912 5.473L830.45 937.684l-85.056-85.073c-12.496-12.496-32.768-12.496-45.264 0s-12.496 32.752 0 45.248l113.136 113.136c12.496 12.496 32.752 12.496 45.248 0 3.04-3.024 5.312-6.544 6.88-10.288l152.304-232.304c10.88-13.904 8.432-34.016-5.488-44.896z" />
                      </svg>
                      <span className="text-[#8899A6] ml-2">Followers</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toast({
                    description: `successfully reported ${author.displayName}`,
                  });
                  setOpen(false);
                }}
              >
                <span>
                  {/* Report */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 -0.5 21 21"
                    version="1.1"
                  >
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="Dribbble-Light-Preview"
                        transform="translate(-99.000000, -640.000000)"
                        fill="#8899A6"
                      >
                        <g
                          id="icons"
                          transform="translate(56.000000, 160.000000)"
                        >
                          <path
                            d="M61.9,483 C61.9,482.448 61.4296,482 60.85,482 L49.3,482 L49.3,490 L60.85,490 C61.4296,490 61.9,489.552 61.9,489 L61.9,483 Z M64,482 L64,490 C64,491.105 63.06025,492 61.9,492 L47.2,492 L47.2,480 L61.9,480 C63.06025,480 64,480.895 64,482 L64,482 Z M44.05,480 L45.1,480 L45.1,499 C45.1,499.552 44.6296,500 44.05,500 C43.4704,500 43,499.552 43,499 L43,481 C43,480.448 43.4704,480 44.05,480 L44.05,480 Z"
                            id="report_flag-[#1419]"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="text-[#8899A6] ml-2">Report</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toast({
                    description: `successfully blocked ${author.displayName}`,
                  });
                  setOpen(false);
                }}
              >
                <span>
                  {/* Not Allowed */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 12C4 7.58172 7.58172 4 12 4C13.6284 4 15.1432 4.48652 16.4068 5.32214L6.07523 17.3757C4.78577 15.9554 4 14.0694 4 12ZM7.59321 18.6779C8.85689 19.5135 10.3716 20 12 20C16.4183 20 20 16.4183 20 12C20 9.93057 19.2142 8.04467 17.9248 6.62436L7.59321 18.6779ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                      fill="#e35935"
                    />
                  </svg>
                </span>
                <span className="text-[#e35935] ml-2">Block</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
