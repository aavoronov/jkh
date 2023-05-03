import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import AdItem from "./AdItem";
import LayoutLoggedIn from "./LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "./personal.module.scss";
import useWindowDimensions from "./useWindowDimensionsSSR";

export default function LayoutPersonal({ children, withProducts }) {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  return (
    <LayoutLoggedIn>
      {width <= 768 && leftMenuIsOpen && (
        <div
          id={styles.overlay}
          onClick={() => {
            setLeftMenuIsOpen(false);
          }}></div>
      )}
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <Link href='/personal'>
          <div className={styles.leftMenuItem}>Мой профиль</div>
        </Link>
        <Link href='/personal/my-services'>
          <div className={styles.leftMenuItem}>Мои услуги</div>
        </Link>
        <Link href='/personal/my-ads'>
          <div className={styles.leftMenuItem}>Мои объявления</div>
        </Link>
        <Link href='/personal/my-favorites'>
          <div className={styles.leftMenuItem}>Избранное</div>
        </Link>
        <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} />
      </aside>
      <div className={withProducts ? styles.container + " " + styles.withProducts : styles.container}>
        {width <= 768 ? (
          <>
            <button
              className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
              onClick={() => {
                setLeftMenuIsOpen(!leftMenuIsOpen);
              }}>
              <Image src={arrowLeft} alt='' width={14} height={31} />
            </button>
          </>
        ) : null}
        {children}
      </div>
    </LayoutLoggedIn>
  );
}
