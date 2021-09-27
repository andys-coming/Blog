import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Card, Layout, PageHeader, Pagination } from "antd";
import Meta from "antd/lib/card/Meta";

import "./index.css";
import KeyedComponent from "../KeyedComponent";
import { stringsToInitials } from "../../transformations/utils";

const PAGE_SIZE = 5;

const PostComponent = ({ title = "", body = "", fullName = "", id = "" }) => {
  const minutes = Math.ceil(body.length / 100);
  const description = `${minutes} min read`;
  const [firstName, lastName] = fullName.split(" ");
  const initials = stringsToInitials(firstName)(lastName);
  const redirect = `/posts/${id}`;
  return (
    <Link className="unstyled-link" to={redirect}>
      <Card title={title} className="post" style={{ marginBotton: "40px" }}>
        <Meta
          avatar={<Avatar>{initials}</Avatar>}
          title={fullName}
          description={description}
        />
        <p className="post-body">{body}</p>
      </Card>
    </Link>
  );
};

const PostListComponent = ({ posts = [] }) => {
  const postComponents = posts.map(KeyedComponent(PostComponent));
  return <div className="post-list">{postComponents}</div>;
};

export const PostsComponent = ({ allPosts = [] } = {}) => {
  const [paginatedPosts, setPaginatedPosts] = React.useState([]);
  const [currentPageNumber, setCurrentPage] = React.useState(1);
  React.useEffect(() => {
    const partialPosts = allPosts.slice(0, PAGE_SIZE);
    setPaginatedPosts(partialPosts);
  }, [allPosts]);
  const total = allPosts.length;
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    const firstPostIndex = page * PAGE_SIZE;
    const lastPostIndex = firstPostIndex + PAGE_SIZE;
    const nextPaginatedPosts = allPosts.slice(firstPostIndex, lastPostIndex);
    setPaginatedPosts(nextPaginatedPosts);
  };
  return (
    <Layout className="posts">
      <PageHeader title="Posts" />
      <PostListComponent posts={paginatedPosts} />
      <Pagination
        showSizeChanger={false}
        current={currentPageNumber}
        total={total}
        pageSize={PAGE_SIZE}
        onChange={handlePaginationChange}
      />
    </Layout>
  );
};

export default PostsComponent;
