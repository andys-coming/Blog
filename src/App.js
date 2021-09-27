import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { Avatar, Empty, Layout, Spin } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import axios from "axios";

import "./App.css";
import { PostsComponent } from "./components/PostsComponent";
import { PostDetailComponent } from "./components/PostDetailComponent";
import { AuthorPageComponent } from "./components/AuthorDetailComponent";
import { POSTS } from "./reducers/AppReducer";
import { useCachedData } from "./hooks";
import { capitalize } from "./transformations/utils";

const responseToComment = ({ email, body }) => {
  const initials = email?.[0]?.toUpperCase() ?? "";
  return {
    author: capitalize(email),
    avatar: <Avatar>{initials}</Avatar>,
    content: <p>{capitalize(body)}</p>
  };
};

const postToPostWithName = (post = {}) =>
  new Promise(async (resolve, reject2) => {
    try {
      const { data: { name } = {} } = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${post?.userId}`
      );
      const { data: commentsData = [] } = await axios.get(
        `${process.env.REACT_APP_API_URL}/comments?postId=${post?.id}`
      );
      const comments = commentsData?.map(responseToComment);
      resolve({ ...post, fullName: name, comments });
    } catch (e) {
      reject2(e);
    }
  });

const responseToPost = ({
  name = "",
  id = "",
  title = "",
  body = "",
  userId = ""
}) => ({
  title: capitalize(title),
  body: capitalize(body),
  fullName: name,
  userId,
  id
});

const getPosts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data = [] } = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts`
      );
      const posts = data.map(responseToPost);
      //TODO(Joseph Anderson)Fetch and cache only the paginated posts, not ALL of the posts.
      const postsWithNamesPromise = posts.map(postToPostWithName);
      try {
        const postsWithNames = await Promise.all(postsWithNamesPromise);
        resolve(postsWithNames);
      } catch (e) {
        reject(e);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const isMatchingPostId =
  (postId = 0) =>
  ({ id = 0 }) =>
    postId === id;

const PostsSection = () => {
  const { data: cachedPosts, isLoading } = useCachedData(getPosts, POSTS);
  return (
    <Layout>
      <Switch>
        <Route
          exact
          path="/posts/:id"
          render={(routeProps = {}) => {
            const { match: { params: { id = "" } = {} } = {} } = routeProps;
            const idNumber = +id;
            const post = cachedPosts.find(isMatchingPostId(idNumber)) ?? {};
            return <PostDetailComponent {...routeProps} post={post} />;
          }}
        />
        <Route
          render={(routeProps = {}) => (
            <PostsComponent {...routeProps} allPosts={cachedPosts} />
          )}
        />
      </Switch>
      <Spin size="large" className="custom-spinner" spinning={isLoading}></Spin>
    </Layout>
  );
};
export const App = () => (
  <Layout>
    <Header>
      <Link to="/posts">
        <h1 className="app-title">Blogger</h1>
      </Link>
    </Header>
    <Content>
      <Switch>
        <Route path="/posts/:id?" component={PostsSection} />
        <Route exact path="/post-not-found" component={Empty} />
        <Route exact path="/authors/:id" component={AuthorPageComponent} />
        <Redirect to="/posts" />
      </Switch>
    </Content>
  </Layout>
);

export default App;
