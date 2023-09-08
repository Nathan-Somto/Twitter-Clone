import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import React, { useRef } from "react";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  distanceFromItem?: number; // Distance in pixels
};
/**
 * @todo make component reusable for other positions like top, left and bottom.
 * @param param0 
 * @description a component that renders a tooltip containing information.
 * @returns 
 */
function Tooltip({ children, distanceFromItem = 6, ...props }: Props) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // this hook is used instead of useLayout effect due to ssr read issue here
  // https://github.com/facebook/react/issues/14927
  useIsomorphicLayoutEffect(() => {
    if (tooltipRef.current !== null) {
      // Calculate the right spacing based on distance and tooltip size
      const tooltipWidth = tooltipRef.current.offsetWidth;
      tooltipRef.current.style.right = `calc(${-distanceFromItem}px - ${tooltipWidth}px)`;
    }
  }, [distanceFromItem]);

  return (
    <div
      {...props}
      ref={tooltipRef}
      className={` 
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
    after:border-r-dark4
    after:border-t-transparent
    after:border-b-transparent
    after:border-l-transparent 
    rounded-[6px] transition-opacity  bg-dark4 px-3 py-2  duration-500 ${props.className}`}
    >
      <span className="text-primaryWhite subtle-semibold">{children}</span>
    </div>
  );
}

export default Tooltip;
