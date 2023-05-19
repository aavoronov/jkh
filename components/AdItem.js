import Image from "next/image";
import React from "react";
import styles from "./adItem.module.scss";

import appgalleryBtn from "/public/img/appgalleryBtn.png";
import appstoreBtn from "/public/img/appstoreBtn.png";
import googleBtn from "/public/img/googleBtn.png";

export default function AdItem({ appButtons = false, buttonText = "", bannerLink = "", buttonLink = "", image, width, height }) {
  const WithLink = ({ link, className = "", children }) =>
    link ? (
      <a href={link} className={className}>
        {children}
      </a>
    ) : (
      children
    );

  return (
    <WithLink link={bannerLink}>
      <div
        className={styles.menu__ad}
        style={{
          backgroundImage: `url(${image})`,
          height: `${height}px`,
          width: `${width}px`,
          backgroundSize: `${width}px ${height}px`,
        }}>
        {/* <div className={styles.adImageWrap}>
            <Image src={image} width={width} height={height} className={styles.adImage} />
          </div> */}
        {appButtons ? (
          <div className={styles["menu-ad-item__btn-block"]}>
            <a href='#'>
              <Image src={appstoreBtn} className={styles["app-btn"]} alt='' />
            </a>
            <a href='#'>
              <Image src={googleBtn} className={styles["app-btn"]} alt='' />
            </a>
            <a href='#'>
              <Image src={appgalleryBtn} className={styles["app-btn"]} alt='' />
            </a>
          </div>
        ) : null}
        {buttonText ? (
          <a href={buttonLink} className={styles["item__btn-block-one-btn"]}>
            {buttonText}
          </a>
        ) : null}
      </div>
    </WithLink>
  );
}
