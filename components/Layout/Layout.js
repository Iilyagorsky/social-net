import React from 'react';
import style from "./Layout.module.scss";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({children, hideNavigation}) => {
  return (
    <div className={style.content}>
      {!hideNavigation && (
        <div className={style.sideBar}>
          <Sidebar />
        </div>
      )}
      <div className={hideNavigation ? style.mainContentFull : style.mainContent}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
