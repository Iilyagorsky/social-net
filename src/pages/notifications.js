import React from 'react';
import Layout from "../../components/Layout/Layout";
import style from "../styles/Notifications.module.scss"
import Card from "../../components/Card/Card";
import Avatar from "../../components/Avatar/Avatar";
import Link from "next/link";

const Notifications = () => {
  return (
    <Layout>
      <h1 className={style.title}>
        Notifications
      </h1>
      <Card>
        <div className={style.notificationContainer}>
          <div className={style.notification}>
            <Link href={"/profile"}>
              <Avatar />
            </Link>
            <div>
              <Link href={"/profile"} className={style.nickLink}>
                Nick
              </Link>
                like
              <Link href={""} className={style.postLink}>
                your photo
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </Layout>

  );
};

export default Notifications;
