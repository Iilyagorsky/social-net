import React, {useContext, useEffect, useRef, useState} from 'react';
import Card from "../Card/Card";
import Avatar from "../Avatar/Avatar";
import style from "./PostCard.module.scss"
import Image from "next/image";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import HideImageSharpIcon from '@mui/icons-material/HideImageSharp';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import useOnClickOutside from "../../src/hooks/ClickOutside"
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import {UserContext} from "@/context/UserContext";
import { useSupabaseClient} from "@supabase/auth-helpers-react";

const PostCard = ({id, content, created_at, photos, profiles:profileAuthor}) => {
  const ref = useRef();
  const profile = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [open, setOpen] = useState(false);
  const [isSaved,setIsSaved] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userComments, setUserComments] = useState('');

  const getLikedByMe = !!likes.find(like => like.user_id === profile?.id);

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    getLikes();
    getComments();
    if (profile?.id) {
      fetchIsSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  function fetchIsSaved() {
    supabase
      .from('saved_posts')
      .select()
      .eq('post_id', id)
      .eq('user_id', profile?.id)
      .then(result => {
        if (result.data?.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      })
  }

  function toggleSave() {
    if (isSaved) {
      supabase.from('saved_posts')
        .delete()
        .eq('post_id', id)
        .eq('user_id', profile?.id)
        .then(() => {
          setIsSaved(false);
          setOpen(false);
        });
    }
    if (!isSaved) {
      supabase.from('saved_posts').insert({
        user_id:profile.id,
        post_id:id,
      }).then(() => {
        setIsSaved(true);
        setOpen(false);
      });
    }
  }

  const toggleLike = () => {
    if (getLikedByMe) {
      supabase.from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', profile.id)
        .then(() => {
          getLikes();
        })
      return;
    }
    supabase
      .from('likes')
      .insert({
        post_id:id,
        user_id: profile.id,
      })
      .then( () => {
        getLikes();
      })
  }

  const getLikes = () => {
    supabase
      .from('likes')
      .select()
      .eq('post_id', id)
      .then(result => setLikes(result.data))
  }

  const getComments = () => {
    supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('parent', id)
      .then(result => setComments(result.data))
  }

  const postComment = (ev) => {
    ev.preventDefault();
    supabase
      .from('posts')
      .insert({
        content: userComments,
        author: profile.id,
        parent: id,
      })
      .then(() => {
        getComments();
        setUserComments('')
      })
  }

  return (
    <Card>
      <div className={style.titleContainer}>
        <div className={style.userAvatar}>
          <Link href={"/profile"}>
            <Avatar url={profileAuthor?.avatar} name={profileAuthor?.name}/>
          </Link>
        </div>
        <div className={style.userAction}>
          <p>
            <Link className={style.userName} href={"/profile/" + profileAuthor?.id}>
              {profileAuthor?.name}
            </Link> shared a post
          </p>
          <p>
            <ReactTimeAgo date={(new Date(created_at)).getTime()} />
          </p>
        </div>
        <div className={style.moreActions}>
          <div className={style.actions} ref={ref}>
            <button onClick={() => {setOpen(current => !current)}}>
              <MoreHorizSharpIcon />
            </button>
            {open && (
              <div className={style.dropdown}>
                <div className={style.dropdownItems}>
                  <button onClick={toggleSave} className={style.linkActive}>
                    {isSaved && (
                      <BookmarkRemoveOutlinedIcon />
                    )}
                    {!isSaved && (
                      <BookmarkAddOutlinedIcon />
                    )}
                    {isSaved ? 'Remove from saved' : 'Add to saved'}
                  </button>
                  <a className={style.linkActive}>
                    <NotificationsNoneSharpIcon />
                    Turn notifications
                  </a>
                  <a className={style.linkActive}>
                    <HideImageSharpIcon />
                    Hide post
                  </a>
                  <a className={style.linkActive}>
                    <DeleteOutlineSharpIcon />
                    Delete
                  </a>
                  <a className={style.linkActive}>
                    <ReportGmailerrorredSharpIcon />
                    Report
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.postContainer}>
        <p className={style.postText}>{content}</p>
        <div className={style.imageContainer}>
          {photos?.length > 0 && photos.map(photo => (
            <Image key={photo}
                   className={style.image}
                   width={300}
                   height={400}
                   src={photo}
                   alt="image"
            />
          ))}
        </div>
      </div>
      <div className={style.buttonContainer}>
        <button className={ style.buttonArea} onClick={toggleLike}>
          <FavoriteBorderOutlinedIcon
            color="red"
            className={getLikedByMe ? [style.buttonIcon, style.likeButton].join(' ') : style.buttonIcon}/>
          {likes?.length}
        </button>
        <button className={style.buttonArea}>
          <AddCommentOutlinedIcon className={style.buttonIcon}/>
          {comments?.length}
        </button>
        <button className={style.buttonArea}>
          <ShareOutlinedIcon className={style.buttonIcon}/>
          0
        </button>
      </div>
      <div className={style.commentContainer}>
        <Avatar url={profile?.profile?.avatar}/>
        <div className={style.commentForm}>
          <form onSubmit={postComment} >
            <input
              value={userComments}
              onChange={ev => setUserComments(ev.target.value)}
              className={style.commentArea}
              placeholder="Leave a comment"
            />
          </form>
        </div>
        <button className={style.commentSendButton}>
          <SendOutlinedIcon />
        </button>
      </div>
      <div className={style.userComments}>
        {comments.length > 0 && comments.map(comment => (
          <div key={comment.id} className={style.commentsContainer}>
            <Avatar url={comment?.profiles?.avatar}/>
            <div className={style.userCommentsForm}>
              <Link
                href={profile?.profile?.id === comment?.profiles?.id ? "/" : "/profile/" + comment?.profiles?.id}
                className={style.userCommentsLink}>
                {comment.profiles?.name}
              </Link>
              <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.created_at)).getTime()} />
              <p className={style.commentText}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PostCard;
