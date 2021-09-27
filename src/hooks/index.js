import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { POSTS } from "../reducers/AppReducer";
import { hasLength } from "../transformations/utils";

export const useCachedData = (getData = () => new Promise(), type = "") => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const cachedData = useSelector(({ posts, users }) => {
    const isPosts = type === POSTS;
    if (isPosts) {
      return posts;
    }
    return users;
  });
  const dispatch = useDispatch();
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const payload = await getData();
        dispatch({ type, payload });
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    const hasCachedData = hasLength(cachedData);
    if (!hasCachedData) {
      fetchData();
    }
  }, []);
  return { data: cachedData, isLoading, error };
};
