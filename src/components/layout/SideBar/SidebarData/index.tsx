import { SidebarRowProps } from "../SidebarRow";

export default function SidebarData(
  _id: string,
  bubbleTextForNotification: number
): SidebarRowProps[] {
  return [
    {
      text: "Home",
      linkPath: "/home",
      inMobile: true,
      hasBubble: false,
    },
    {
      text: "Explore",
      linkPath: `/search?searchTerm=%20`,
      inMobile: true,
      hasBubble: false,
    },
    {
      text: "Bookmarks",
      linkPath: `/bookmark/${_id}`,
      inMobile: true,
      hasBubble: false,
    },
    {
      text: "Profile",
      linkPath: `/profile/${_id}`,
      inMobile: true,
      hasBubble: false,
    },
    {
      text: "Notifications",
      linkPath: `/notifications/${_id}`,
      inMobile: true,
      hasBubble: true,
      bubbleText: bubbleTextForNotification,
    },
    {
      text: "Messages",
      linkPath: `/wip`,
      inMobile: false,
      hasBubble: false,
    },
    {
      text: "List",
      linkPath: `/wip`,
      inMobile: false,
      hasBubble: false,
    },
    {
      text: "More",
      linkPath: `/wip`,
      inMobile: false,
      hasBubble: false,
    },
  ];
}
