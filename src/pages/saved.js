import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout/Layout";
import PostCard from "../../components/PostCard/PostCard";
import style from "../styles/SavedPosts.module.scss"
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {UserContextProvider} from "@/context/UserContext";

const Saved = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', session.user.id)
      .then(result => {
        const postsIds = result.data.map(item => item.post_id);
        supabase
          .from('posts')
          .select('*, profiles(*)')
          .in('id', postsIds)
          .then(result => setPosts(result.data));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return (
    <Layout>
      <UserContextProvider>
        <h1 className={style.title}>
          Saved posts
        </h1>
        {posts.length > 0 && posts.map(post => (
          <div key={post.id}>
            <PostCard {...post}/>
          </div>
        ))}
      </UserContextProvider>
    </Layout>
  );
};

export default Saved;
