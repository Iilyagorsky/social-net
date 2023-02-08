import React, {useState} from 'react';
import style from "./Avatar.module.scss"
import Image from "next/image";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import uploadUserAvatar from "../../helpers/user";
import Spinner from "../Spinner/Spinner";

const Avatar = ({size, url, name, editable, onChange}) => {
  const [avatar, setAvatar] = useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();

  const handleAvatar = async (ev) => {
    const file = ev.target.files?.[0];
    if (file) {
      setAvatar(true);
      await uploadUserAvatar(supabase, session.user.id, file, "avatars", "avatar");
      setAvatar(false);
      if(onChange) onChange();
    }
  }

  return (
    <div className={style.cont}>
      <div className={!size ? style.imageContainer : style.imageContainerResized}>
        <Image className={style.image} fill quality={100} src={url} alt={name || "avatar"}></Image>
      </div>
      {avatar && (
        <div className={style.loader}>
          <Spinner />
        </div>
      )}
      {editable && (
        <label className={style.editAvatar}>
          <div className={style.editAvatarButton}>
            <svg className={style.editAvatarIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            <input hidden={true} type="file" onChange={handleAvatar}/>
          </div>
        </label>
      )}
    </div>
  );
};

export default Avatar;
