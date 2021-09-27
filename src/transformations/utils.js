export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const stringsToInitials =
  (firstName = "") =>
  (lastName = "") =>
    `${firstName?.[0]}${lastName?.[0]}`;

export const hasLength = (array = []) => array.length > 0;

export const stateToPosts = ({ posts = [] } = {}) => posts;
