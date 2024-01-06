import React, { Component } from "react";
import { SecondaryLayout } from "../layout";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};
/**
 * wraps the application globally and listens for any errors
 * caused under the component tree and shows a fallback ui.
 * 
 * [Documentation](https://react.dev/error-boundary)
 */

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("the error that caused the crash", error.message, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
       <SecondaryLayout>
          <article>
            <figure>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="sm:h-[100px] h-[80px] w-[80px]  sm:w-[100px]  dark:fill-primaryWhite fill-primaryBlack "
              >
                <g>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </g>
              </svg>
            </figure>
            <div className="mt-4">
              <h2 className="text-3xl text-primaryWhite">
                Something went Wrong!
              </h2>
              <p className="text-xl opacity-80 w-[80%]">
                Please contact this email concerning the error
                <span className="text-primaryBlue"> nturner560@gmail.com </span>
              </p>
            </div>
          </article>
       </SecondaryLayout>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
