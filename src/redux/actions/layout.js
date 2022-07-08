import { SHOW_FOOTER, FOOTER_STYLE_GRAY, FOOTER_STYLE_WHITE } from "../constants";
import { BG_GRAY_2, BG_WHITE } from "../../utils";
export function showFooter(show = true) {
  return async (dispatch) => {
    dispatch({ type: SHOW_FOOTER, payload: show });
  };
}
export function addFooterGray(color = BG_GRAY_2) {
  return async (dispatch) => {
    dispatch({ type: FOOTER_STYLE_GRAY, payload: color });
  };
}
export function addFooterWhite(color = BG_WHITE) {
  return async (dispatch) => {
    dispatch({ type: FOOTER_STYLE_WHITE, payload: color });
  };
}
