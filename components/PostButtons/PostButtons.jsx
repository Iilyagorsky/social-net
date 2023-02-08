import React from 'react';
import style from "./PostButtons.module.scss"
import Link from "next/link";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const PostButtons = ({active, userId}) => {
  return (
    <div className={style.userAdditions}>
      <Link href={`/profile/${userId}/posts`} className={active === 'posts' ? style.linksActive : style.links}>
        <ArticleOutlinedIcon />
        Posts
      </Link>
      <Link href={`/profile/${userId}/about`} className={active === 'about' ? style.linksActive : style.links}>
        <InfoOutlinedIcon />
        About
      </Link>
      <Link href={`/profile/${userId}/friends`} className={active === 'friends' ? style.linksActive : style.links}>
        <PeopleAltOutlinedIcon />
        Friends
      </Link>
      <Link href={`/profile/${userId}/photos`} className={active === 'photos' ? style.linksActive : style.links}>
        <ImageOutlinedIcon />
        Photos
      </Link>
    </div>
  );
};

export default PostButtons;
