import React from 'react';
import style from "./Friends.module.scss"
import Avatar from "../Avatar/Avatar";

const Friends = () => {
  return (
    <div>
      <div className={style.friendsInfo}>
        <Avatar />
        <div>
          <h3 className={style.friendsName}>One Punch Mad</h3>
          <div>5 mutual friends</div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
