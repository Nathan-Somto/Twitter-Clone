import React, { useRef, useLayoutEffect } from "react";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  distanceFromItem?: number; // Distance in pixels
};

function Tooltip({ children, distanceFromItem = 10, ...props }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      // Calculate the right spacing based on distance and tooltip size
      const tooltipWidth = tooltipRef.current.offsetWidth;
      tooltipRef.current.style.right = `calc(- ${distanceFromItem}px - ${tooltipWidth}px)`;
    }
  }, [distanceFromItem]);

  return (
    <div
      {...props}
      ref={tooltipRef}
      className=" 
    absolute 
    z-[10] 
    -top-1 
    group-hover:opacity-100 
    opacity-0 
    after:absolute 
    after:top-2/4 
    after:right-full 
    after:-mt-[8px] 
    after:border-[8px] 
    after:border-solid 
    after:border-r-black
    after:border-t-transparent
    after:border-b-transparent
    after:border-l-transparent 
    rounded-[6px] transition-opacity  bg-[rgba(0,0,0,0.75)] px-3 py-2  duration-500"
    >
      <span className="text-primaryWhite subtle-semibold">{children}</span>
    </div>
  );
}

export default Tooltip;
