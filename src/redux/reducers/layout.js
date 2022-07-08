import { SHOW_FOOTER, FOOTER_STYLE_GRAY, FOOTER_STYLE_WHITE } from "../constants";
import { BG_GRAY_2 } from "../../utils";
const initialState = {
  showFooter: true,
  footer: {
    bgClass: BG_GRAY_2,
  },
  loading: true,
};

const layout = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case SHOW_FOOTER:
      return {
        ...state,
        showFooter: payload,
      };
    case FOOTER_STYLE_GRAY:
      return {
        ...state,
        footer: { bgClass: payload },
        loading: false,
      };
    case FOOTER_STYLE_WHITE:
      return {
        ...state,
        loading: false,
        footer: { bgClass: payload },
      };
    default:
      return state;
  }
};

export default layout;
