import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";
import { setOverflowY } from "../body/bodySlice";

export interface PopupCarouselState {
	items?: ReactNode[];
	thumbnails?: ReactNode[];
	activeIndex?: number;
	showThumbnails?: boolean;
	showArrows?: boolean;
	isActive: boolean;
}

const initialState: PopupCarouselState = {
	items: undefined,
	thumbnails: undefined,
	activeIndex: undefined,
	showThumbnails: undefined,
	showArrows: undefined,
	isActive: true,
};

const popupCarouselSlice = createSlice({
  name: "popupCarousel",
  initialState,
  reducers: {
    setPopupCarousel: (state, action: PayloadAction<Omit<PopupCarouselState, "isActive">>) => {
      state.items = action.payload.items;
      state.thumbnails = action.payload.thumbnails;
      state.activeIndex = action.payload.activeIndex;
      state.showThumbnails = action.payload.showThumbnails;
      state.showArrows = action.payload.showArrows;
      state.isActive = true;
    },
    closePopup: (state) => {
      state.isActive = false;
    },
  },
});

export const setPopupCarousel = (payload: Omit<PopupCarouselState, "isActive">) => (dispatch: any) => {
  dispatch(setOverflowY('hidden'));

  // Then dispatch the actual action
  dispatch(popupCarouselSlice.actions.setPopupCarousel(payload));
};

export const closePopup = () => (dispatch: any) => {
  dispatch(setOverflowY('auto'));

  // Then dispatch the actual action
  dispatch(popupCarouselSlice.actions.closePopup());
};

export default popupCarouselSlice.reducer;
