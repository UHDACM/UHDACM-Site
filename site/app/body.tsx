"use client";

import { useSelector } from "react-redux";
import { RootState } from "./_features/store";
import PopupCarousel from "./_features/popupCarousel/components/popupCarousel";
import ScrollToSectionListener from "./_features/scrollToSectionListener/ScrollToSectionListener";
import Chatbot from "./_features/chatbot/chatbot";
import BG from "./_components/BG/BG";
import PostHogPageView from "./_components/PostHogPageView/PostHogPageView";

export default function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { overflowY, chatbotDisableScrollOnMobile } = useSelector((store: RootState) => store.body);

  return (
    <body
      className={`${className} ${chatbotDisableScrollOnMobile && 'chatbotDisableScrollOnMobile'}`}
      style={{ ...(overflowY != 'auto' ?{overflowY: overflowY}:undefined), overflowX: "hidden" }}
    >
      <BG />
      <ScrollToSectionListener>
        {/* <button style={{position: 'fixed', zIndex: 1000, bottom: 10, left: 10}} onClick={handlePurchase}>Complete purchase</button> */}
        <Chatbot />
        <PopupCarousel />
        {/* BETA: consent banner disabled, analytics defaults to on.
            Re-mount <AnalyticsConsentBanner /> here to restore the consent flow. */}
        <PostHogPageView />
        {children}
      </ScrollToSectionListener>
    </body>
  );
}
