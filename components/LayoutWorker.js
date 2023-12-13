import { Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
// import LayoutLoggedIn from "./LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toggle } from "../store/notificationSlice";
import { updateAddress, updateProfile } from "../store/userSlice";
import layoutStyles from "./layout.module.scss";
import styles from "./personal.module.scss";
import useWindowDimensions from "./useWindowDimensionsSSR";

import Head from "next/head";

import arrow from "/public/img/arrow.png";
import bell from "/public/img/bell-outlined.svg";
import logo from "/public/img/logo-not-main-page.svg";
import logout from "/public/img/logout.png";
import person from "/public/img/person.png";
import user from "/public/img/user-grey.svg";

import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

import { updateBalance, updateEmail, updateNotifications, updatePhone, updateRole } from "../store/userSlice";
import dynamic from "next/dynamic";

function LayoutLoggedIn({
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
    //   // console.log(getCookie("jkh-token"));
    // console.log(role);
    if (role === "user") {
      router.replace("/trading-platform");
      // setCookie("jkh-token", "");
      // router.push("/");
    }
    if (role === "") {
      // router.replace("/");
    }
  }, [role]);

  // useEffect(() => {
  //   console.log("addTwoNumbers(1,10)", addTwoNumbers(1, 10));
  // });

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
          updateProfile({ pseudonym: updatePseudonym, color: res.data.color ?? res.data.workerProfile.color, profilePic: updateProfilePic })
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
    <div className={layoutStyles.pageWrap}>
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
        <div id={layoutStyles.overlay} className={layoutStyles.loader}>
          <div className={layoutStyles.loaderWrap}>
            <RotatingLines
              strokeColor='#FF8C00'
              strokeWidth='5'
              animationDuration='0.75'
              width='40'
              visible={true}
              className={layoutStyles.loader}
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
      <div id={layoutStyles.overlay} className={menuIsOpen ? "" : layoutStyles.hidden} onClick={onClickHandler}></div>

      <header className={layoutStyles.header + " " + layoutStyles.gradient}>
        <div className={layoutStyles.headerLogoWrap}>
          <Link href='/'>
            <Image src={logo} alt='' />
          </Link>
        </div>
        <div className={layoutStyles.headerButtonsWrap}>
          {!noRightMenu && (
            <div className={layoutStyles.bellWrap}>
              <Image src={bell} alt='' />
              {!!notifications && <span className={layoutStyles.notificationsNumber}>{notifications}</span>}
            </div>
          )}
          <Link href='/workers'>
            <div className={layoutStyles.userWrap}>
              <div className={layoutStyles.userNameWrap}>
                <Image src={user} alt='' />
              </div>
              <span className={layoutStyles.name}>{pseudonym}</span>
            </div>
          </Link>
          <div
            className={layoutStyles.dropdownBtn}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
            onClick={dropdownClickHandler}>
            <Image src={arrow} alt='' />
            {dropdownVisible && (width > 768 || noRightMenu) ? (
              <div className={layoutStyles.dropdownMenu}>
                <ul>
                  {!noRightMenu && (
                    <li>
                      <Link href='/personal'>
                        <div className={layoutStyles.dropdownMenuItem}>
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
                      <div className={layoutStyles.dropdownMenuItem}>
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
        <div className={layoutStyles.container + " " + layoutStyles.full}>{children}</div>
      ) : (
        <div className={menuIsOpen ? layoutStyles.container : layoutStyles.container + " " + layoutStyles.expanded}>{children}</div>
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

const LeftMenu = ({ role }) => {
  return (
    <>
      <Link href='/workers'>
        <div className={styles.leftMenuItem}>Рабочий кабинет</div>
      </Link>

      {role === "business" && (
        <>
          <Link href='/workers/company-services'>
            <div className={styles.leftMenuItem}>Услуги компании</div>
          </Link>
          <Link href='/workers/ads'>
            <div className={styles.leftMenuItem}>Рекламные объявления чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Рекламные объявления сайты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Тендеры</div>
          </Link>
        </>
      )}

      {role === "admakers" && (
        <>
          <Link href='/workers/ads'>
            <div className={styles.leftMenuItem}>Рекламные объявления чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Рекламные объявления сайты</div>
          </Link>
        </>
      )}

      {role === "upravdom" && (
        <>
          <Link href='/workers/polls'>
            <div className={styles.leftMenuItem}>Голосования, опросы</div>
          </Link>
          <Link href='/workers/ads'>
            <div className={styles.leftMenuItem}>Рекламные объявления чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Рекламные объявления сайты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Тендеры</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Заявки</div>
          </Link>
          <Link href='/workers/chat'>
            <div className={styles.leftMenuItem}>Домовой чат</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Модерация чата</div>
          </Link>
        </>
      )}

      {role === "uk" && (
        <>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Оплата ЖКХ по дому</div>
          </Link>
          <Link href='/workers/polls'>
            <div className={styles.leftMenuItem}>Голосования, опросы</div>
          </Link>
          <Link href='/workers/ads'>
            <div className={styles.leftMenuItem}>Рекламные объявления чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Рекламные объявления сайты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Тендеры</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Задачи</div>
          </Link>
          <Link href='/workers/chat'>
            <div className={styles.leftMenuItem}>Домовые чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Модерация чатов</div>
          </Link>
        </>
      )}

      {role === "stores" && (
        <div>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Витрина</div>
          </Link>
          <Link href='/workers/ads'>
            <div className={styles.leftMenuItem}>Рекламные объявления чаты</div>
          </Link>
          <Link href='/workers'>
            <div className={styles.leftMenuItem}>Рекламные объявления сайты</div>
          </Link>
        </div>
      )}
    </>
  );
};

export default function LayoutWorker({ children, title, description, keywords }) {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [adRequest, setAdRequest] = useState(false);

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  return (
    <LayoutLoggedIn noRightMenu title={title} description={description} keywords={keywords}>
      {width <= 768 && leftMenuIsOpen && (
        <div
          id={styles.overlay}
          onClick={() => {
            setLeftMenuIsOpen(false);
          }}></div>
      )}
      {adRequest && (
        <>
          <div
            id={styles.overlay}
            className={styles.adRequest}
            onClick={() => {
              setAdRequest(false);
            }}></div>
          <div className={styles.adPopup}>
            <div
              className={styles.closeBtn}
              onClick={() => {
                setAdRequest(false);
                // setComplaintError(false);
              }}></div>
            <span className={styles.adHeading}>Заявка на рекламу</span>

            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
              }}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
                // setComplaintError(false);
                setAdRequest(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='name' className={styles.fieldName}>
                      Ваше имя
                    </label>
                    <Field name='name' type='text' placeholder='Укажите ваше имя' className={styles.field} />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='phone' className={styles.fieldName}>
                      Ваш телефон
                    </label>
                    <Field name='phone' type='text' placeholder='Укажите ваш телефон' className={styles.field} />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='email' className={styles.fieldName}>
                      Ваш email
                    </label>
                    <Field name='email' type='text' placeholder='Укажите ваш email' className={styles.field} />
                  </div>
                  <div className={styles.modalBtnsWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        // setComplaintError(false);
                        setAdRequest(false);
                      }}>
                      Отменить
                    </span>
                  </div>
                  <div className={styles.fieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}

      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <LeftMenu role={role} />
        <>
          <span className={styles.orderAdText}>
            Вы можете разместить рекламу на площадке нашего приложения, для этого нужно оставить заявку
          </span>
          <button
            className={styles.orderAdBtn}
            onClick={() => {
              setAdRequest(true);
            }}>
            Заказать рекламу
          </button>
          <button
            className={styles.orderAdBtn}
            style={{ paddingRight: 0, paddingLeft: 0 }}
            onClick={() => {
              setAdRequest(true);
            }}>
            Предложения по развитию сайта
          </button>
        </>
      </aside>
      <div className={styles.containerWorker}>
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
