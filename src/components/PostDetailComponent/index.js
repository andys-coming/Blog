import {
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  Comment,
  Layout,
  PageHeader,
  List
} from "antd";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import { Link } from "react-router-dom";
import { CommentOutlined } from "@ant-design/icons";

import { stringsToInitials } from "../../transformations/utils";

import "./index.css";

export const PostDetailComponent = ({
  history,
  post: {
    comments = [],
    body: postBody = "",
    userId: authorId = "",
    title: postTitle,
    name: author = ""
  } = {}
}) => {
  const [isDrawerVisible, setDrawerVisibility] = React.useState(false);
  const minutes = Math.ceil(postBody.length / 100);
  const description = `${minutes} min read`;
  const [firstName, lastName] = author.split(" ");
  const initials = stringsToInitials(firstName)(lastName);
  const commentCount = comments.length ?? 0;
  const commentsHeader = `${commentCount} replies`;
  return (
    <Layout>
      <PageHeader
        title="Posts"
        subTitle="/Post Details"
        onBack={history.goBack}
      />
      <Content className="container">
        <Card
          className="post-detail-container"
          headStyle={{ fontSize: "33px" }}
          title={postTitle}
          extra={
            <Button
              type="text"
              shape="circle"
              icon={
                <Badge count={commentCount}>
                  <Avatar shape="circle" icon={<CommentOutlined />} />
                </Badge>
              }
              onClick={() => setDrawerVisibility(true)}
            ></Button>
          }
        >
          <Link to={`/authors/${authorId}`}>
            <Meta
              title={author}
              description={description}
              avatar={<Avatar>{initials}</Avatar>}
            />
          </Link>
          <div className="post-body">{postBody}</div>
        </Card>
      </Content>
      <Drawer
        visible={isDrawerVisible}
        onClose={() => setDrawerVisibility(false)}
        width="414px"
      >
        <List
          className="comment-list"
          header={commentsHeader}
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={({ actions, author, avatar, content, datetime } = {}) => (
            <li>
              <Comment
                actions={actions}
                author={author}
                avatar={avatar}
                content={content}
                datetime={datetime}
              />
            </li>
          )}
        />
      </Drawer>
    </Layout>
  );
};

export default PostDetailComponent;
