import React, { useEffect, useState } from "react";
import bell from "/public/img/bell.svg";
import logo from "/public/img/logo.svg";
import personal from "/public/img/personal.svg";
// import { Link } from "react-router-dom";
import Image from "next/image";
import Link from "next/link";
import AdItem from "../components/AdItem";
import Layout from "../components/Layout";
import styles from "./about.module.scss";

import { useDispatch } from "react-redux";
import ModalsLayer from "../components/Modals";

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
      setMenuIsOpen(false);
    }
  }, []);

  return (
    <Layout title='ЖКХ Консьерж - о компании' description='description' keywords='keywords'>
      <style jsx global>{`
        body {
          background-color: #f5f5f5;
        }
      `}</style>
      {modalToDisplay ? <ModalsLayer modalToDisplay={modalToDisplay} setModalToDisplay={setModalToDisplay} /> : null}
      <main className={styles.mainContainer}>
        <div className={styles.App}>
          <div className={menuIsOpen ? [styles["no-interaction"] + " " + styles.container] : styles.container}>
            <Overlay />
            <aside className={menuIsOpen ? [styles["menu-mobile"] + " " + styles["menu-active"]] : styles["menu-mobile"]}>
              <a href='#'>
                <div className={[styles.header__button + " " + styles.gradient]} onClick={() => setModalToDisplay("authByPhone")}>
                  <Image src={personal} className={styles.button__icon} alt='' width={65} />
                  <span className={styles.button__text}>Войти</span>
                </div>
              </a>
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
                <AdItem appButtons={true} image={"/img/appAd.png"} width={180} height={180} />
              </div>
            </aside>
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
            <section className={styles["banner-section"]}>
              <div style={{ marginRight: 30, padding: 10 }}>
                <div className={styles.aboutContainer}>
                  <h1 className={styles.pageHeader}>Заголовок</h1>
                  <h2 className={styles.h2}>Заголовок второго уровня</h2>
                  <h3 className={styles.h3}>Заголовок третьего уровня</h3>
                  <p className={styles.paragraph}>
                    Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности требуют от нас анализа
                    дальнейших направлений развития. Задача организации, в особенности же реализация намеченных плановых заданий
                    представляет собой интересный эксперимент проверки систем массового участия. Товарищи! начало повседневной работы по
                    формированию позиции способствует подготовки и реализации существенных финансовых и административных условий.
                  </p>
                  <p className={styles.paragraph}>
                    Товарищи! постоянный количественный рост и сфера нашей активности играет важную роль в формировании систем массового
                    участия. Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий влечет за собой процесс
                    внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика
                    показывает, что постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации
                    модели развития.
                  </p>
                  <h2 className={styles.h2}>Заголовок второго уровня</h2>
                  <p className={styles.paragraph}>
                    Равным образом начало повседневной работы по формированию позиции в значительной степени обуславливает создание системы
                    обучения кадров, соответствует насущным потребностям. Таким образом укрепление и развитие структуры представляет собой
                    интересный эксперимент проверки существенных финансовых и административных условий. Таким образом реализация намеченных
                    плановых заданий требуют от нас анализа направлений прогрессивного развития. Не следует, однако забывать, что дальнейшее
                    развитие различных форм деятельности требуют от нас анализа модели развития. Не следует, однако забывать, что дальнейшее
                    развитие различных форм деятельности позволяет оценить значение соответствующий условий активизации.
                  </p>
                  <a href='/#' className={styles.link}>
                    Ссылка, например, на политику
                  </a>
                </div>
              </div>

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
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;

{
  /* <h1 className={styles.pageHeader}>Заголовок</h1>
      <h2 className={styles.h2}>Заголовок второго уровня</h2>
      <h3 className={styles.h3}>Заголовок третьего уровня</h3>
      <p className={styles.paragraph}>
        Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности требуют от нас анализа дальнейших
        направлений развития. Задача организации, в особенности же реализация намеченных плановых заданий представляет собой интересный
        эксперимент проверки систем массового участия. Товарищи! начало повседневной работы по формированию позиции способствует подготовки
        и реализации существенных финансовых и административных условий.
      </p>
      <p className={styles.paragraph}>
        Товарищи! постоянный количественный рост и сфера нашей активности играет важную роль в формировании систем массового участия.
        Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий влечет за собой процесс внедрения и
        модернизации позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что постоянный
        количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации модели развития.
      </p>
      <h2 className={styles.h2}>Заголовок второго уровня</h2>
      <p className={styles.paragraph}>
        Равным образом начало повседневной работы по формированию позиции в значительной степени обуславливает создание системы обучения
        кадров, соответствует насущным потребностям. Таким образом укрепление и развитие структуры представляет собой интересный эксперимент
        проверки существенных финансовых и административных условий. Таким образом реализация намеченных плановых заданий требуют от нас
        анализа направлений прогрессивного развития. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности
        требуют от нас анализа модели развития. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности позволяет
        оценить значение соответствующий условий активизации.
      </p>
      <a href='/#' className={styles.link}>
        Ссылка, например, на политику
      </a>  */
}
