import React, {useEffect, useState} from 'react';
import PostCard from "../PostCard/PostCard";
import Card from "../Card/Card";
import style from "@/styles/Profile.module.scss";
import Friends from "../Friends/Friends";
import Image from "next/image";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

const ProfileContent = ({activeTab, userId}) => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState (null);
  const supabate = useSupabaseClient();

  const userPosts = async (userId) => {
    const {data} = await supabate
      .from('posts')
      .select('id, content, created_at, author')
      .eq('author', userId);
    return data;
  }

  const userProfile = async (userId) => {
    const {data} = await supabate
      .from('profiles')
      .select()
      .eq('id', userId);
    console.log(data, 'data')
    return data?.[0];
  }

  const loadPosts = async () => {
    const posts = await userPosts(userId);
    const profileUser = await userProfile(userId);
    setPosts(posts);
    setProfile(profileUser)
  }

  useEffect( () => {
    if (!userId)
      return;
    if (activeTab === 'posts') {
      loadPosts().then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div>
      {activeTab === 'posts' && (
        <div>
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.created_at} {...post} profiles={profile}/>
          ))}
        </div>
      )}
      {activeTab === 'about' && (
        <Card>
          <h2 className={style.linksTitle}>
            About me
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto corporis delectus dignissimos ea enim illum iusto laborum, necessitatibus nisi, obcaecati omnis placeat porro praesentium quasi quis, quos rem reprehenderit sequi.</p>
        </Card>
      )}
      {activeTab === 'friends' && (
        <Card>
          <h2 className={style.linksTitle}>
            Friends
          </h2>
          <div className={style.friendsContainer}>
            <Friends />
            <Friends />
          </div>
        </Card>
      )}
      {activeTab === 'photos' && (
        <Card>
          <div className={style.photoContainer}>
            <div className={style.photoItem}>
              <Image className={style.photo} fill quality={100} src={"https://images.unsplash.com/photo-1647118762210-393b52e96fbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1467&q=80"} alt={"image"} />
            </div>
            <div className={style.photoItem}>
              <Image className={style.photo} fill quality={100} src={"https://images.unsplash.com/photo-1629898144911-d3bd4b265cc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80"} alt={"image"} />
            </div>
            <div className={style.photoItem}>
              <Image className={style.photo} fill quality={100} src={"https://images.unsplash.com/photo-1589967753951-bedee3727d93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"} alt={"image"} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileContent;
