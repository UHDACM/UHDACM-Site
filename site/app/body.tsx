'use client'

import { useSelector } from "react-redux";
import Navbar from "./_components/Navbar/Navbar";
import { RootState } from "./_features/store";
import PopupCarousel from "./_features/popupCarousel/components/popupCarousel";
import Footer from "./_components/Footer/Footer";
import ScrollToSectionListener from "./_features/scrollToSectionListener/ScrollToSectionListener";

export default function Body({ children, className }: { children: React.ReactNode, className?: string }) {
  const { overflowY } = useSelector((store: RootState) => store.body);
  return (
      <body className={`${className}`} style={{ overflowY: overflowY, overflowX: 'hidden' }}>
        <ScrollToSectionListener>
          <Navbar />
          <PopupCarousel />
          {children}
          <Footer />
        </ScrollToSectionListener>
      </body>
  );
}
