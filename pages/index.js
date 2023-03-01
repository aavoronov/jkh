import aboutIcon from "/public/img/about.png";
import logo from "/public/img/logo.svg";
import bell from "/public/img/bell.svg";
import personal from "/public/img/personal.svg";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import AdItem from "../components/AdItem";

import ModalsLayer from "../components/Modals";
import { useDispatch } from "react-redux";
import { updateToken } from "../store/userSlice";
import { getCookie } from "cookies-next";

function Home() {
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

  const dispatch = useDispatch();

  const [modalToDisplay, setModalToDisplay] = useState(null);
  // const [popupError, setPopupError] = useState(false);

  useEffect(() => {
    window.addEventListener("orientationchange", doOnOrientationChange);

    function doOnOrientationChange() {
      console.log("changed");
      setMenuIsOpen(false);
    }
  }, []);

  return (
    <Layout>
      {modalToDisplay ? <ModalsLayer modalToDisplay={modalToDisplay} setModalToDisplay={setModalToDisplay} /> : null}
      <main className={styles.mainContainer}>
        <div className={styles.App}>
          <div className={menuIsOpen ? [styles["no-interaction"] + " " + styles.container] : styles.container}>
            <Overlay />
            <aside className={menuIsOpen ? [styles["menu-mobile"] + " " + styles["menu-active"]] : styles["menu-mobile"]}>
              <a href='#'>
                <div className={[styles.header__button + " " + styles.gradient]} onClick={() => setModalToDisplay("authByLogin")}>
                  <Image src={personal} className={styles.button__icon} alt='' width={65} />
                  <span className={styles.button__text}>Войти</span>
                </div>
              </a>
              <a href='/about'>
                <Link href='/about'>
                  <div className={[styles.header__button + " " + styles.gradient + " " + styles["header__button-small-res"]]}>
                    <div className={styles.imgWrap}>
                      <Image src={aboutIcon} className={styles.button__icon + " " + styles.about} alt='' width={35} height={33} />
                    </div>

                    <span className={styles.button__text}>О проекте</span>
                  </div>
                </Link>
              </a>
              <div className={[styles["banner-section__column"] + " " + styles["banner-section__menu"] + " " + styles.gradient]}>
                <ul className={styles.banner__menu}>
                  <span onClick={() => setModalToDisplay("authByLogin")}>
                    <li className={styles.menu__item}>Личный кабинет</li>
                  </span>

                  <span onClick={() => setModalToDisplay("authByLogin")}>
                    <li className={styles.menu__item}>Кабинет мастеров </li>
                  </span>

                  <span onClick={() => setModalToDisplay("authByLogin")}>
                    <li className={styles.menu__item}>Интерактивная карта</li>
                  </span>

                  <span onClick={() => setModalToDisplay("authByLogin")}>
                    <li className={styles.menu__item}>Торговая площадка </li>
                  </span>
                </ul>
                <AdItem appButtons={true} image={"/img/appAd.png"} width={180} height={180} />
              </div>
            </aside>
            <header className={styles.header}>
              <a href='/about'>
                <Link href='/about'>
                  <div className={[styles.header__button + " " + styles.gradient]}>
                    <div className={styles.imgWrap}>
                      <Image src={aboutIcon} className={styles.button__icon + " " + styles.about} alt='' width={35} height={33} />
                    </div>

                    <span className={styles.button__text}>О проекте</span>
                  </div>
                </Link>
              </a>
              <div className={[styles.header__button + " " + styles.header__center + " " + styles.gradient]}>
                <Image src={logo} className={styles.header__logo} alt='' />
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
                <div className={[styles.header__button + " " + styles.gradient]} onClick={() => setModalToDisplay("authByLogin")}>
                  <Image src={personal} className={styles.button__icon} alt='' width={65} />
                  <span className={styles.button__text}>Войти</span>
                </div>
              </a>
            </header>
            <section className={styles["banner-section"]}>
              <div className={[styles["banner-section__column"] + " " + styles["banner-section__ads"]]}>
                <AdItem appButtons={true} image={"/img/appAd.png"} width={285} height={342} />
                <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={285} height={342} />
              </div>
              <div className={[styles["banner-section__column"] + " " + styles["banner-section__banner"]]}>
                <div className={styles.banner}>
                  <h1 className={styles["banner__intro-span"]}>интерактивная платформа</h1>
                  <Image src={logo} className={styles.banner__logo} alt='' width={394} height={77} />
                  <span className={styles.banner__text}>
                    Жилищные услуги включают в себя содержание и ремонт жилых помещений и общего имущества многоквартирного дома,
                    капитальный ремонт общего имущества многоквартирного дома и вывоз бытовых отходов. Правила предоставления коммунальных
                    услуг.
                  </span>
                  <span className={styles.banner__btn} onClick={() => setModalToDisplay("authByLogin")}>
                    Хочу пользоваться платформой
                  </span>
                  <span className={styles.banner__link} onClick={() => setModalToDisplay("partnership")}>
                    <span className={styles.banner__text}>Сотрудничество</span>
                  </span>
                </div>
              </div>

              <aside>
                <a href='/about'>
                  <Link href='/about'>
                    <div className={[styles.header__button + " " + styles.gradient + " " + styles["header__button-small-res"]]}>
                      <div className={styles.imgWrap}>
                        <Image src={aboutIcon} className={styles.button__icon + " " + styles.about} alt='' width={35} height={33} />
                      </div>

                      <span className={styles.button__text}>О проекте</span>
                    </div>
                  </Link>
                </a>
                <div className={[styles["banner-section__column"] + " " + styles["banner-section__menu"] + " " + styles.gradient]}>
                  <ul className={styles.banner__menu}>
                    <span onClick={() => setModalToDisplay("authByLogin")}>
                      <li className={styles.menu__item}>Личный кабинет</li>
                    </span>

                    <span onClick={() => setModalToDisplay("authByLogin")}>
                      <li className={styles.menu__item}>Кабинет мастеров </li>
                    </span>

                    <span onClick={() => setModalToDisplay("authByLogin")}>
                      <li className={styles.menu__item}>Интерактивная карта</li>
                    </span>

                    <span onClick={() => setModalToDisplay("authByLogin")}>
                      <li className={styles.menu__item}>Торговая площадка </li>
                    </span>
                  </ul>
                  <AdItem appButtons={true} image={"/img/menuAppAd.png"} width={240} height={204} />
                </div>
              </aside>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
