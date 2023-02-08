import Post from "../../components/Post/Post";
import PostCard from "../../components/PostCard/PostCard";
import Layout from "../../components/Layout/Layout";
import React, {useEffect, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Login from "@/pages/login";
import {UserContext} from "@/context/UserContext";

export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
      .select()
      .eq('id', session.user.id)
      .then(result => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const fetchPosts = () => {
    supabase.from('posts')
      .select('id, content, created_at, photos, profiles(id, avatar, name)')
      .is('parent', null)
      .order('created_at', {ascending: false})
      .then(result => {
        setPosts(result.data);
      })
  }

  if (!session) {
    return <Login />
  }

  return (
      <Layout>
        <UserContext.Provider value={{profile}}>
          <Post onPost={fetchPosts} />
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.id} {...post}/>
          ))}
        </UserContext.Provider>
      </Layout>
  )
}
