import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
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
import { getCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { updateEmail, updateNotifications, updateProfile, updateRole, updatePhone, updateBalance, updateAddress } from "../store/userSlice";
import { useRouter } from "next/router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toggle } from "../store/notificationSlice";
import { RotatingLines } from "react-loader-spinner";

export default function LayoutLoggedIn({
  children,
  menuIsCollapsible = false,
  noRightMenu = false,
  title = "ЖКХ Консьерж",
  description = "description",
  keywords = "keywords",
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const router = useRouter();

  const isLoading = useSelector((state) => state.loader.visible);

  const role = useSelector((state) => state.user.role);
  // useEffect(() => {
  //   console.log(getCookie("jkh-token"));
  //   console.log(role);
  //   if (role === "") {
  //     router.replace("/");
  //     setCookie("jkh-token", "");
  //     // router.push("/");
  //   }
  // }, [role]);

  useEffect(() => {
    // console.log(getCookie("jkh-token"));
    // console.log(role);
    if (role !== "" && role !== "user") {
      router.replace("/workers");
      // setCookie("jkh-token", "");
      // router.push("/");
    }
    if (role === "") {
      // router.replace("/");
    }
  }, [role]);

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

  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification.text) {
      switch (notification.type) {
        case "info":
          toast.info(notification.text);
          break;
        case "success":
          toast.success(notification.text);
          break;
        case "warning":
          toast.warning(notification.text);
          break;
        case "error":
          toast.error(notification.text);
          break;
        case "default":
          toast(notification.text);
          break;
        default:
          notification.text && toast(notification.text);
      }
    }
  }, [notification]);

  useEffect(() => {
    if (notification.text !== "") setTimeout(() => dispatch(toggle({ text: "", type: null })), 5000);
  }, [notification]);

  const hasWindow = typeof window !== "undefined";
  useEffect(() => {
    if (hasWindow) {
      document.body.style.overflowX = "hidden";
    }
  }, [hasWindow]);

  useEffect(() => {
    window.addEventListener("orientationchange", doOnOrientationChange);

    function doOnOrientationChange() {
      setMenuIsOpen(false);
    }
  }, []);

  const onClickHandler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const dropdownClickHandler = () => {
    if (width < 768 && !noRightMenu) setMenuIsOpen(!menuIsOpen);
    else return;
  };

  const dispatch = useDispatch();

  const email = useSelector((state) => state.user.email);
  const notifications = useSelector((state) => state.user.notifications);

  useEffect(() => {
    const fetchData = async () => {
      if (!!getCookie("jkh-token")) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/reauth`, {
            headers: {
              Authorization: getCookie("jkh-token"),
              "X-Role": role,
            },
          });
          dispatch(updateRole({ role: res.data.role }));
          dispatch(updateEmail({ email: res.data.email }));
          dispatch(updatePhone({ phone: res.data.phone }));
        } catch (e) {
          console.log(e);
          setCookie("jkh-token", "");
        }
      } else {
        router.push("/");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getNotifications = async () => {
      if (!!email) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/notifications`, {
            headers: {
              Authorization: getCookie("jkh-token"),
            },
          });
          const amount = 0;
          res.data.data.forEach((item) => (amount = amount + item.amount));
          dispatch(updateNotifications({ notifications: amount }));
        } catch (e) {
          console.log(e);
        }
      }
    };
    getNotifications();
  }, [email]);

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          headers: { Authorization: getCookie("jkh-token") },
          "X-Role": role,
        });
        const entityName = res.data.pseudonym ?? res.data.workerProfile?.name;

        const phone = res.data.phone ?? "";
        const updatePseudonym = entityName === null ? "" : entityName;

        const entityPic = res.data.profilePic ?? res.data.workerProfile?.profilePic;
        const updateProfilePic = entityPic === null ? "" : entityPic;
        phone && dispatch(updatePhone({ phone: phone }));
        res.data.workerProfile?.balance && dispatch(updateBalance({ balance: res.data.workerProfile.balance }));
        res.data.workerProfile?.address && dispatch(updateAddress({ address: res.data.workerProfile.address }));
        dispatch(
          updateProfile({
            pseudonym: updatePseudonym,
            color: res.data.color ?? res.data.workerProfile?.color,
            profilePic: updateProfilePic,
          })
        );
        // console.log(nicknameLocal);
      } catch (e) {
        console.log(e);
      }
    }
    getProfile();
  }, []);

  // useEffect(() => {
  //   toast.warning("test");
  // }, []);

  const pseudonym = useSelector((state) => state.user.pseudonym);

  return (
    <div className={styles.pageWrap}>
      <ToastContainer
        position='top-left'
        // autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoading ? (
        <div id={styles.overlay} className={styles.loader}>
          <div className={styles.loaderWrap}>
            <RotatingLines
              strokeColor='#FF8C00'
              strokeWidth='5'
              animationDuration='0.75'
              width='40'
              visible={true}
              className={styles.loader}
            />
          </div>
        </div>
      ) : null}
      {/* {isLoading && <div style={{ width: 1000, height: 1000, backgroundColor: "tomato", position: "absolute" }}>TEST</div>} */}

      <Head>
        <title>{title}</title>
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preload' as='font'></link>
        <meta charSet='utf-8' />
      </Head>
      <div id={styles.overlay} className={menuIsOpen ? "" : styles.hidden} onClick={onClickHandler}></div>

      <header className={styles.header + " " + styles.gradient}>
        <div className={styles.headerLogoWrap}>
          <Link href='/'>
            <Image src={logo} alt='' />
          </Link>
        </div>
        <div className={styles.headerButtonsWrap}>
          {!noRightMenu && (
            <div className={styles.bellWrap}>
              <Image src={bell} alt='' />
              {!!notifications && <span className={styles.notificationsNumber}>{notifications > 99 ? "99+" : notifications}</span>}
            </div>
          )}
          <div className={styles.userWrap}>
            <div className={styles.userNameWrap}>
              <Image src={user} alt='' />
            </div>
            <span className={styles.name}>{pseudonym}</span>
          </div>
          <div
            className={styles.dropdownBtn}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
            onClick={dropdownClickHandler}>
            <Image src={arrow} alt='' />
            {dropdownVisible && (width > 768 || noRightMenu) ? (
              <div className={styles.dropdownMenu}>
                <ul>
                  {!noRightMenu && (
                    <li>
                      <Link href='/personal'>
                        <div className={styles.dropdownMenuItem}>
                          <Image src={person} alt='' />
                          <span>Личный кабинет</span>
                        </div>
                      </Link>
                    </li>
                  )}
                  <li>
                    <span
                      onClick={() => {
                        dispatch(updateRole({ role: "" }));
                        router.replace("/");
                        setCookie("jkh-token", "");
                      }}>
                      <div className={styles.dropdownMenuItem}>
                        <Image src={logout} alt='' />
                        <span>Выйти</span>
                      </div>
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {noRightMenu ? (
        <div className={styles.container + " " + styles.full}>{children}</div>
      ) : (
        <div className={menuIsOpen ? styles.container : styles.container + " " + styles.expanded}>{children}</div>
      )}
      {!noRightMenu && (
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
              <Link href='/about'>
                <div className={styles.menuItem}>
                  <Image src={gear} alt='' />
                  <span className={styles.menuItemText}>О проекте</span>
                </div>
              </Link>
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
                  <span
                    onClick={() => {
                      dispatch(updateRole({ role: "" }));
                      router.replace("/");
                      setCookie("jkh-token", "");
                    }}>
                    <div className={styles.menuItem}>
                      <Image src={logoutGrey} alt='' />
                      <span className={styles.menuItemText}>Выйти</span>
                    </div>
                  </span>
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
      )}
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
