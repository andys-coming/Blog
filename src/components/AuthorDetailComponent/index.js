import { Avatar, Card, Layout, message, PageHeader } from "antd";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from "@ant-design/icons";
import React from "react";

import { hasLength, stringsToInitials } from "../../transformations/utils";
import { useDispatch, useSelector } from "react-redux";
import { USERS } from "../../reducers/AppReducer";

const AuthorDetailsComponent = ({
  googleMapsLink = "",
  phone = "",
  email = "",
  companyName = "",
  city = "",
  name = "",
  username = ""
}) => {
  const [firstName, lastName] = name?.split(/[ -]+/);
  const initials = stringsToInitials(firstName)(lastName);
  const [phoneNumberWithSpecialCharacters = "", extensionWithLetters = ""] =
    phone?.split(" ");
  const phoneNumberWithoutSpecialCharacters =
    phoneNumberWithSpecialCharacters?.replace(/\D/g, "");
  const extensionWithoutLetters = extensionWithLetters?.replace(/\D/g, "");
  const telephoneNumberAndExtension = `tel:${phoneNumberWithoutSpecialCharacters},${extensionWithoutLetters}`;
  return (
    <Content>
      <Card
        title={`About ${firstName}`}
        actions={[
          <a
            target="_blank"
            rel="noreferrer"
            href={`mailto:${email.toLowerCase()}`}
          >
            <MailOutlined />
          </a>,
          <a target="_blank" rel="noreferrer" href={googleMapsLink}>
            <EnvironmentOutlined />
          </a>,
          <a href={telephoneNumberAndExtension}>
            <PhoneOutlined />
            {phone}
          </a>
        ]}
      >
        <Meta
          title=""
          avatar={<Avatar>{initials}</Avatar>}
          description={`@${username}`}
        ></Meta>
        <p>{`${firstName} is from ${city} and an employee at ${companyName}. They enjoys writing blogs during their free time.`}</p>
      </Card>
    </Content>
  );
};

const userResponseToUser = ({
  address: { geo: { lat = "", lng = "" } = {} } = {},
  phone = "",
  name = "",
  username = "",
  company: { name: companyName = "" } = {},
  email = "",
  address: { city = "" } = {},
  id = ""
}) => {
  const googleMapsLink = `https://www.google.com/maps/@${lat},${lng},15z`;
  return {
    googleMapsLink,
    phone,
    email,
    companyName,
    city,
    name,
    username,
    id
  };
};

const isMatchingUserId =
  (userId = "") =>
  ({ id = "" }) =>
    id === userId;

const stateToUsers = ({ users }) => users;

export const AuthorPageComponent = ({
  history,
  match: { params: { id: userId } = {} }
} = {}) => {
  const dispatch = useDispatch();
  const users = useSelector(stateToUsers);
  const userIdNumber = +userId;
  const authorDetails = users.find(isMatchingUserId(userIdNumber)) ?? [];
  React.useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data = {} } = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${userId}`
        );
        dispatch({
          type: USERS,
          payload: users.concat(userResponseToUser(data))
        });
      } catch (e) {
        console.log(e);
        message?.error(e?.message);
      }
    };
    const hasUser = hasLength(authorDetails?.name);
    if (!hasUser) {
      fetchAuthor();
    }
  }, []);
  return (
    <Layout>
      <PageHeader
        title="Post"
        subTitle="/About the author"
        onBack={history.goBack}
      />
      <AuthorDetailsComponent {...authorDetails} />
    </Layout>
  );
};

export default AuthorPageComponent;
