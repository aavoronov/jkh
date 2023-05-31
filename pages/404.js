import Head from "next/head";
import LayoutLoggedIn from "../components/LayoutLoggedIn";
import React, { useEffect, useState } from "react";
import bell from "/public/img/bell.svg";
import logo from "/public/img/logo.svg";
import personal from "/public/img/personal.svg";
import Image from "next/image";
import Link from "next/link";
import AdItem from "../components/AdItem";
import styles from "./about.module.scss";

import { useDispatch } from "react-redux";
import ModalsLayer from "../components/Modals";
import bucket from "/public/img/bucket.png";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const E404 = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }} className={styles.e404wrap}>
        <span style={{ fontSize: 128, color: "#FF8C00" }}>404</span>
        <span style={{ color: "#07244E", fontSize: 40, marginBottom: 20 }}>Ошибка!</span>
        <span style={{ textAlign: "center", color: "#07244E" }}>
          К сожалению, запрашиваемая Вами страница не найдена. Вы можете перейти{" "}
          <a onClick={() => router.back()} style={{ cursor: "pointer" }}>
            назад
          </a>{" "}
          или на <Link href='/'>главную</Link>.
        </span>
      </div>
      <div className={styles.bucket}>
        <Image src={bucket} width={400} height={400} />
      </div>
    </div>
  );
};

function Layout({ children, title = "ЖКХ Консьерж", description = "description", keywords = "keywords" }) {
  return (
    <div className='container'>
      <Head>
        <title>{title}</title>
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preload' as='font'></link>
        <meta charSet='utf-8' />
      </Head>

      {children}
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
        html {
          overflow-x: hidden;
        }
        html,
        body {
          overflow-x: hidden;
          padding: 0;
          margin: 0;
          // background-color: red;
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

export default function Home() {
  const BurgerMenuBtn = () => {
    return (
      <div
        id={styles.navIcon}
        className={menuIsOpen ? styles.open : ""}
        onClick={() => {
          setMenuIsOpen(!menuIsOpen);
        }}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  };

  const Overlay = () => {
    return (
      <div
        id={styles.overlay}
        className={menuIsOpen ? "" : styles.hidden}
        onClick={() => {
          setMenuIsOpen(!menuIsOpen);
        }}></div>
    );
  };

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const [modalToDisplay, setModalToDisplay] = useState(null);
  // const [popupError, setPopupError] = useState(false);

  useEffect(() => {
    window.addEventListener("orientationchange", doOnOrientationChange);

    function doOnOrientationChange() {
      setMenuIsOpen(false);
    }
  }, []);

  const token = !!getCookie("jkh-token");
  const Container = token ? LayoutLoggedIn : Layout;

  return (
    <Container title='ЖКХ Консьерж - страница не найдена' description='description' keywords='keywords'>
      <style jsx global>{`
        body {
          background-color: #f5f5f5;
        }
      `}</style>
      {modalToDisplay ? <ModalsLayer modalToDisplay={modalToDisplay} setModalToDisplay={setModalToDisplay} /> : null}
      <main className={styles.mainContainer}>
        <div className={styles.App}>
          <div className={menuIsOpen ? [styles["no-interaction"] + " " + styles.container] : styles.container}>
            <aside className={menuIsOpen ? [styles["menu-mobile"] + " " + styles["menu-active"]] : styles["menu-mobile"]}>
              <a href='#'>
                <div className={[styles.header__button + " " + styles.gradient]} onClick={() => setModalToDisplay("authByPhone")}>
                  <Image src={personal} className={styles.button__icon} alt='' width={65} />
                  <span className={styles.button__text}>Войти</span>
                </div>
              </a>
              <div className={[styles["banner-section__column"] + " " + styles["banner-section__menu"] + " " + styles.gradient]}>
                <ul className={styles.banner__menu}>
                  <Link href='/personal'>
                    <li className={styles.menu__item}>Личный кабинет</li>
                  </Link>

                  <Link href='/workers'>
                    <li className={styles.menu__item}>Кабинет мастеров </li>
                  </Link>

                  <Link href='/interactive-map'>
                    <li className={styles.menu__item}>Интерактивная карта</li>
                  </Link>

                  <Link href='/trading-platform'>
                    <li className={styles.menu__item}>Торговая площадка </li>
                  </Link>
                </ul>
                <AdItem appButtons={true} image={"/img/appAd.png"} width={180} height={180} />
              </div>
            </aside>
            {!token && (
              <header className={styles.header}>
                <div className={[styles.header__button + " " + styles.header__center + " " + styles.gradient]}>
                  <Link href='/'>
                    <Image src={logo} className={styles.header__logo} alt='' style={{ cursor: "pointer" }} />
                  </Link>
                  <div className={styles["header__btn-block"]}>
                    <a href='#' className={!isLoggedIn ? styles.hidden : ""}>
                      <Image src={bell} className={styles.header__bell} alt='' width={72} />
                    </a>
                    <a href='#'>
                      <BurgerMenuBtn />
                    </a>
                  </div>
                </div>
                <a href='#'>
                  <div className={[styles.header__button + " " + styles.gradient]} onClick={() => setModalToDisplay("authByPhone")}>
                    <Image src={personal} className={styles.button__icon} alt='' width={65} />
                    <span className={styles.button__text}>Войти</span>
                  </div>
                </a>
              </header>
            )}
            <section className={styles["banner-section"]}>
              <div
                style={{
                  marginRight: 30,
                  padding: 10,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                }}>
                {/* <div className={styles.aboutContainer} style={{ width: "100%", height: "100%" }}>
                  <div style={{ width: "100%", height: "100%" }}>test</div>
                </div> */}
                {/* <span>test</span> */}
                <E404 />
              </div>

              {!token && (
                <aside>
                  {/* <a href='/about'>
                    <Link href='/about'>
                      <div className={[styles.header__button + " " + styles.gradient + " " + styles["header__button-small-res"]]}>
                        <div className={styles.imgWrap}>
                          <Image src={aboutIcon} className={styles.button__icon + " " + styles.about} alt='' width={35} height={33} />
                        </div>
  
                        <span className={styles.button__text}>О проекте</span>
                      </div>
                    </Link>
                  </a> */}

                  <div className={[styles["banner-section__column"] + " " + styles["banner-section__menu"] + " " + styles.gradient]}>
                    <ul className={styles.banner__menu}>
                      <Link href='/personal'>
                        <li className={styles.menu__item}>Личный кабинет</li>
                      </Link>

                      <Link href='/workers'>
                        <li className={styles.menu__item}>Кабинет мастеров </li>
                      </Link>

                      <Link href='/interactive-map'>
                        <li className={styles.menu__item}>Интерактивная карта</li>
                      </Link>

                      <Link href='/trading-platform'>
                        <li className={styles.menu__item}>Торговая площадка </li>
                      </Link>
                    </ul>
                    <AdItem appButtons={true} image={"/img/menuAppAd.png"} width={240} height={204} />
                  </div>
                </aside>
              )}
            </section>
          </div>
        </div>
      </main>
    </Container>
  );
}

// export default function Custom404() {
//   return (
//     <Layout>
//       <h1>404 - Page Not Found</h1>
//     </Layout>
//   );
// }
