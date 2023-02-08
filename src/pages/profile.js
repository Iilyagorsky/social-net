import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Avatar from "../../components/Avatar/Avatar";
import {useRouter} from "next/router";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Cover from "../../components/Cover/Cover";
import PostButtons from "../../components/PostButtons/PostButtons";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import {UserContextProvider} from "@/context/UserContext";
import style from "../styles/Profile.module.scss"

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const router = useRouter();
  const tab = router?.query?.tab?.[0] || 'posts';
  const supabase = useSupabaseClient();
  const session = useSession();
  const userId = router.query.id
  const isMyAccount = userId === session?.user?.id;

  const fetchUser = () => {
    supabase.from('profiles')
      .select()
      .eq('id', userId)
      .then(result => {
        if (result.error) {
          throw result.error
        }
        if (result.data) {
          setProfile(result.data[0])
        }
      })
  }

  useEffect(() => {
    if (!userId) {
      return
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveProfile = () => {
    supabase.from('profiles').update({
      name,
      place,
    }).eq('id', session.user.id)
      .then(result => {
        if (!result.error) {
          setProfile(prev => ({...prev, name, place}))
        }
        setEditMode(false)
      })
  }

  return (
    <Layout>
      <UserContextProvider>
        <Card noPadding={true}>
          <div className={style.container}>
            <Cover url={profile?.cover} editable={isMyAccount} onChange={fetchUser}/>
            <Avatar size={true} url={profile?.avatar} editable={isMyAccount} onChange={fetchUser}/>
            <div className={style.userInfo}>
              <div>
                {editMode && (
                  <div>
                    <input
                      className={style.nameInput}
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={ev => setName(ev.target.value)}
                    />
                  </div>
                )}
                {!editMode && (
                  <h1 className={style.userName}>
                    {profile?.name}
                  </h1>
                )}
                {editMode && (
                  <div>
                    <input
                      className={style.nameInput}
                      type="text"
                      placeholder="Enter your place"
                      value={place}
                      onChange={ev => setPlace(ev.target.value)}
                    />
                  </div>
                )}
                {!editMode && (
                  <div className={style.userLocation}>
                    {profile?.place || 'Earth'}
                  </div>
                )}
              </div>
              <div className={style.editUserProfileButtons}>
                <div>
                  {isMyAccount && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setName(profile.name);
                        setPlace(profile.place)
                      }}
                      className={style.editUserProfile}
                    >
                      Edit profile
                    </button>
                  )}
                  {isMyAccount && editMode && (
                    <button onClick={saveProfile}
                            className={style.editUserProfile}
                    >
                      Save profile
                    </button>
                  )}
                </div>
                <div>
                  {isMyAccount && editMode && (
                    <button onClick={() => setEditMode(false)}
                            className={style.editUserProfile}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            <PostButtons active={tab} userId={profile?.id} />
          </div>
        </Card>
        <ProfileContent activeTab={tab} userId={userId}/>
      </UserContextProvider>
    </Layout>
  );
};

export default Profile;
