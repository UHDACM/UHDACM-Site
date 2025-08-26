'use client'

import { useSelector } from "react-redux";
import { RootState } from "./_features/store";
import PopupCarousel from "./_features/popupCarousel/components/popupCarousel";
import ScrollToSectionListener from "./_features/scrollToSectionListener/ScrollToSectionListener";

export default function Body({ children, className }: { children: React.ReactNode, className?: string }) {
  const { overflowY } = useSelector((store: RootState) => store.body);
  return (
      <body className={`${className}`} style={{ overflowY: overflowY, overflowX: 'hidden' }}>
        <ScrollToSectionListener>
          <PopupCarousel />
          {children}
        </ScrollToSectionListener>
      </body>
  );
}
