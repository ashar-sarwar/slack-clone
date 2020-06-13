import { SET_USER, CLEAR_USER } from "../actions/types";

const initialState = {
  current_user: null,
  isLoading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        current_user: action.payload,
        isLoading: false
      };

    case CLEAR_USER:
      return {
        current_user: null,
        isLoading: false
      };

    default:
      return state;
  }
}
