export const POSTS = "POSTS";
export const USERS = "USERS";

const INITIAL_STATE = {
  posts: [],
  users: []
};

export const AppReducer = (
  state = INITIAL_STATE,
  { type = "", payload } = {}
) => {
  switch (type) {
    case POSTS:
      return { ...state, posts: payload };
    case USERS:
      return { ...state, users: payload };
    default:
      return state;
  }
};

export default AppReducer;
