import React, {useContext, useEffect, useState} from 'react';
import Card from "../Card/Card";
import style from "./Post.module.scss"
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Avatar from "../Avatar/Avatar";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {UserContext} from "@/context/UserContext";
import Preloader from "../Spinner/Spinner";
import Image from "next/image";

const Post = ({onPost}) => {
  const [content, setContent] = useState('');
  const [upload, setUpload] = useState([]);
  const [uploading, setUploading] = useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();
  const profile = useContext(UserContext);

  const createPost = async () => {
    await supabase.from('posts')
      .insert({
        author: session.user.id,
        content,
        photos: upload
      }).then(response => {
        if (!response.error) {
          setContent('');
          setUpload([])
          if (onPost) {
            onPost();
          }
        }
      });
  }

  const addPhoto = async (ev) => {
    const files = ev.target.files;
    if (files.length > 0) {
      setUploading(true)
      for (const file of files) {
        const newName = Date.now() + file.name;
        const result = await supabase
          .storage
          .from('photos')
          .upload(newName, file)
        if (result.data) {
          const imgUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path
          setUpload(previousUploads => [...previousUploads, imgUrl])
        }
      }
      setUploading(false)
    }
  }

  return (
    <Card>
      <div className={style.container}>
        <div>
          <Avatar
            url={profile?.profile?.avatar} name={profile?.profile?.name}
          />
        </div>
        <div className={style.form}>
          {profile && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={style.textArea}
              placeholder={`Whats new, ${profile?.profile?.name}?`}
            />
          )}
        </div>
      </div>
      {uploading && (
        <div>
          <Preloader />
        </div>
      )}
      {upload.length > 0 && (
        <div className={style.uploadContainer}>
          {upload.map(image => (
            <div key={image} style={{height: 120}}>
              <Image src={image} width={150} height={150} quality={100} alt="image" className={style.uploadImage}/>
            </div>
          ))}
        </div>
      )}
      <div className={style.buttonsContainer}>
        <label className={style.buttonArea}>
          <input type="file" multiple hidden onChange={addPhoto}/>
          <AddPhotoAlternateOutlinedIcon />
          <p className={style.buttonName}>Photos</p>
        </label>
        <div className={style.buttonArea}>
          <PermIdentityOutlinedIcon />
            <button>
              <p className={style.buttonName}>People</p>
            </button>
        </div>
        <div className={style.buttonArea}>
          <LocationOnOutlinedIcon />
          <button>
            <p className={style.buttonName}>Check in</p>
          </button>
        </div>
        <div className={style.buttonArea}>
          <AddReactionOutlinedIcon />
          <button>
            <p className={style.buttonName}>Reaction</p>
          </button>
        </div>
        <div className={style.shareButton}>
          <button onClick={createPost}>Share</button>
        </div>
      </div>
    </Card>
  );
};

export default Post;
