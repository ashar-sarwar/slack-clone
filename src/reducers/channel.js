import {
  SET_CHANNEL,
  SET_PRIVATE_CHANNEL,
  SET_USER_POSTS
} from "../actions/types";

const initialState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
};

export default function(state = initialState, action) {
  console.log("hello", state.currentChannel);

  switch (action.type) {
    case SET_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload
      };

    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload
      };

    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload
      };

    default:
      return state;
  }
}
