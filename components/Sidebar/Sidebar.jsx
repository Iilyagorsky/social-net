import React, {useRef, useState} from 'react';
import Card from "../Card/Card";
import Link from "next/link";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import style from "./Sidebar.module.scss"
import {useRouter} from "next/router";
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import {useSupabaseClient} from "@supabase/auth-helpers-react";

const Sidebar = () => {
  const [hidden, setHidden] = useState(true);

  const router = useRouter();
  const {asPath:pathname} = router;

  const supabase = useSupabaseClient();
  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <Card noPadding={true} >
      <div className={style.sidebarContainer}>
        <ViewSidebarOutlinedIcon className={!hidden ? style.iconClose : style.iconOpen} onClick={() => {setHidden(!hidden)}}/>
        <CancelPresentationOutlinedIcon className={hidden ? style.iconClose : style.iconOpen} onClick={() => {setHidden(!hidden)}}/>
        <div className={hidden ? style.linkContainer : style.linkContainerHidden}>
          <h1 className={style.navTitle}>Navigation</h1>
          <Link href="/" className={pathname === "/" ? style.linkActive : style.link}>
            <HomeOutlinedIcon />
            Home
          </Link>
          <Link href="/profile/friends" className={pathname === "/profile/friends" ? style.linkActive : style.link}>
            <Diversity3OutlinedIcon />
            Friends
          </Link>
          <Link href="/saved" className={pathname === "/saved" ? style.linkActive : style.link}>
            <BookmarkAddedOutlinedIcon />
            Saved posts
          </Link>
          <Link href="/notifications" className={pathname === "/notifications" ? style.linkActive : style.link}>
            <NotificationsActiveOutlinedIcon />
            Notifications
          </Link>
          <button onClick={logout} className={pathname === "/logout" ? style.linkActive : style.link}>
            <LogoutOutlinedIcon />
            Logout
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
