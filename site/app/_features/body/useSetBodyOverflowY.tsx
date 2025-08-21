import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setOverflowY } from "./bodySlice";

/**
 * Returns two functions: one to set body overflowY to 'hidden', and one to set it back to 'auto'.
 */
export function useBodyOverflowY() {
  const dispatch = useDispatch();

  const disableOverflowY = useCallback(() => {
    dispatch(setOverflowY("hidden"));
  }, [dispatch]);

  const enableOverflowY = useCallback(() => {
    dispatch(setOverflowY("auto"));
  }, [dispatch]);

  return { disableOverflowY, enableOverflowY } as const;
}
