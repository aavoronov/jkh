import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "./Layout";
import styles from "./layout.module.scss";
import Image from "next/image";

import logo from "/public/img/logo-not-main-page.svg";
import bell from "/public/img/bell-outlined.svg";
import user from "/public/img/user-grey.svg";
import arrow from "/public/img/arrow.png";
import gear from "/public/img/icon-gear.png";
import list from "/public/img/icon-list.png";
import chat from "/public/img/icon-chat.png";
import worker from "/public/img/icon-worker.png";
import location from "/public/img/icon-location.png";
import stats from "/public/img/icon-stats.png";
import cart from "/public/img/icon-cart.png";
import arrowRight from "/public/img/arrow-right.png";
import person from "/public/img/person.png";
import logout from "/public/img/logout.png";
import personGrey from "/public/img/personGrey.png";
import logoutGrey from "/public/img/logoutGrey.png";

import useWindowDimensions from "./useWindowDimensionsSSR";

export default function LayoutLoggedIn({ children, menuIsCollapsible = false }) {
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { height, width } = useWindowDimensions();

  const setMenuState = (value) => {
    setMenuIsOpen(value);
  };

  useEffect(() => {
    if (width > 768) {
      setMenuIsOpen(true);
    } else {
      setMenuIsOpen(false);
    }
  }, [width]);

  const hasWindow = typeof window !== "undefined";
  useEffect(() => {
    if (hasWindow) {
      document.body.style.overflowX = "hidden";
    }
  }, [hasWindow]);

  useEffect(() => {
    window.addEventListener("orientationchange", doOnOrientationChange);

    function doOnOrientationChange() {
      console.log("changed");
      setMenuIsOpen(false);
    }
  }, []);

  const onClickHandler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const dropdownClickHandler = () => {
    if (width < 768) setMenuIsOpen(!menuIsOpen);
    else return;
  };

  return (
    <div className={styles.pageWrap}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <script
          src='https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=2a5c7497-20d8-493c-87a4-21c88a87d455'
          type='text/javascript'></script>
      </Head>
      <div id={styles.overlay} className={menuIsOpen ? "" : styles.hidden} onClick={onClickHandler}></div>

      <div className={styles.header + " " + styles.gradient}>
        <div className={styles.headerLogoWrap}>
          <Link href='/'>
            {/* <> */}
            <Image src={logo} alt='' />
            {/* </> */}
          </Link>
        </div>
        <div className={styles.headerButtonsWrap}>
          <div
            className={styles.bellWrap}
            onClick={() => {
              console.log(height, width);
              console.log(width < 768);
            }}>
            <Image src={bell} alt='' />
            <span className={styles.notificationsNumber}>15</span>
          </div>
          <div className={styles.userWrap}>
            <div className={styles.userNameWrap}>
              <Image src={user} alt='' />
            </div>
            <span className={styles.name}>Анна-Мария-Генриетта К.</span>
          </div>
          <div
            className={styles.dropdownBtn}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
            onClick={dropdownClickHandler}>
            <Image src={arrow} alt='' />
            {dropdownVisible && width > 768 ? (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li>
                    <Link href='/personal'>
                      <div className={styles.dropdownMenuItem}>
                        <Image src={person} alt='' />
                        <span>Личный кабинет</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div className={styles.dropdownMenuItem}>
                      <Image src={logout} alt='' />
                      <span>Выйти</span>
                    </div>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={menuIsOpen ? styles.container : styles.container + " " + styles.expanded}>{children}</div>

      <aside className={menuIsOpen ? styles.rightMenu : styles.rightMenu + " " + styles.collapsed}>
        {menuIsCollapsible || width <= 768 ? (
          <button
            className={menuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
            onClick={() => {
              setMenuIsOpen(!menuIsOpen);
            }}>
            <Image src={arrowRight} alt='' />
          </button>
        ) : null}
        <ul className={styles.asideMenu}>
          <li>
            {/* <div className={styles.menuItem + " " + styles.active}> */}
            <div className={styles.menuItem}>
              <Image src={gear} alt='' />
              <span className={styles.menuItemText}>О проекте</span>
            </div>
          </li>
          <li>
            <Link href='/utilities'>
              <div className={styles.menuItem}>
                <Image src={list} alt='' /> <span className={styles.menuItemText}>Платежи ЖКХ</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/chat'>
              <div className={styles.menuItem}>
                <Image src={chat} alt='' />

                <span className={styles.menuItemText}>Домовые чаты</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/services'>
              <div className={styles.menuItem}>
                <Image src={worker} alt='' />
                <span className={styles.menuItemText}>Услуги мастеров</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/interactive-map'>
              <div className={styles.menuItem}>
                <Image src={location} alt='' />

                <span className={styles.menuItemText}>Интерактивная карта</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/polls'>
              <div className={styles.menuItem}>
                <Image src={stats} alt='' />
                <span className={styles.menuItemText}>Голосования, опросы</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/trading-platform'>
              <div className={styles.menuItem}>
                <Image src={cart} alt='' />

                <span className={styles.menuItemText}>Торговая площадка</span>
              </div>
            </Link>
          </li>
          {width < 768 ? (
            <>
              <li>
                <Link href='/personal'>
                  <div className={styles.menuItem}>
                    <Image src={personGrey} alt='' />
                    <span className={styles.menuItemText}>Личный кабинет</span>
                  </div>
                </Link>
              </li>
              <li>
                <div className={styles.menuItem}>
                  <Image src={logoutGrey} alt='' />
                  <span className={styles.menuItemText}>Выйти</span>
                </div>
              </li>
            </>
          ) : null}
        </ul>
        <div className={styles.menuAd}>
          <a href='#' className={styles.menuAdBtn}>
            подключить сервис
          </a>
        </div>
      </aside>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }
        .hidden {
          display: none;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
          font-family: "Roboto";
          font-style: normal;
          font-size: 16px;
        }
        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
