import React, { useEffect, useState, useRef, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import LayoutMap from "../../components/LayoutMap";
import AdItem from "../../components/AdItem";
import ServiceAd from "../../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";
import ProductCard from "../../components/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./chat.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

export default function Chat(props) {
  const [category, setCategory] = useState(null);
  const [categoryHorizontal, setCategoryHorizontal] = useState("Любая категория");
  const [location, setLocation] = useState("Москва и Московская область");
  const [withPhotos, setWithPhotos] = useState(false);
  const [buySellMode, setBuySellMode] = useState("Куплю");
  const [productNew, setProductNew] = useState(false);
  const [productUsed, setProductUsed] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [priceSuggestion, setPriceSuggestion] = useState(false);
  const [popupError, setPopupError] = useState(false);

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const datepickerRef = useRef(null);

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [chatDate, setChatDate] = useState(null);

  const [collapseBtnVisible, setCollapseBtnVisible] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    console.log();
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 900) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }

    // chatRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const handleLinksInString = (str) => {
    if (!str.includes("http")) {
      return "no";
    }
    let position = str.search(/http/i);
    return position;
  };

  const CalendarBtnInput = forwardRef(({ value, onClick }, ref) => (
    <button className={styles.calendarBtn} onClick={onClick} ref={ref}></button>
  ));

  return (
    <LayoutLoggedIn>
      <div className={styles.container}>
        {width < 901 ? (
          <button
            className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
            onClick={() => {
              setLeftMenuIsOpen(!leftMenuIsOpen);
            }}>
            <Image src={arrowLeft} alt='' width={14} height={31} />
          </button>
        ) : null}
        <div className={styles.tabWrap}>
          <div className={styles.chatTab + " " + styles.active}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5</span>
          </div>
          <div className={styles.chatTab}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5</span>
          </div>
          <div className={styles.chatTab}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5Маяковского, 5Маяковского, 5</span>
          </div>
          <div className={styles.chatTab}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5</span>
          </div>
          <div className={styles.chatTab}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5</span>
          </div>
          <div className={styles.chatTab}>
            <span className={styles.objectLetters}>ММ</span>
            <span className={styles.objectName}>Маяковского, 5</span>
          </div>
          <div className={styles.chatTab + " " + styles.active + " " + styles.addChat}>
            <Link href='/chat/add-chat'>
              <span className={styles.objectLetters}>+</span>
            </Link>
          </div>
        </div>

        <div className={styles.chatContainer}>
          <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
            <div className={styles.fieldWithBtn}>
              <input name='name' type='text' placeholder='Поиск' className={styles.field} />
            </div>
            <div className={styles.participantsBlock}>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>{" "}
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                {/* <span className={styles.objectLetters}>ЛИ</span>s */}
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div>
            </div>
          </aside>
          <div className={styles.chatControls}>
            <div className={styles.chatTab + " " + styles.active}>
              <span className={styles.objectLetters}>ММ</span>
              <span className={styles.objectName}>Москва, ул. Маяковского, дом 5</span>
            </div>
            <div className={styles.controlBtns}>
              <span
                className={styles.chatBtn + " " + styles.chatSearch}
                onClick={() => {
                  setSearchActive(!searchActive);
                }}></span>
              <div className={styles.chatBtn + " " + styles.chatThreeDots}>
                <div className={styles.threeDotsBtnMenu}>
                  <span className={styles.chatOptionsItem}>Покинуть чат</span>
                  <span className={styles.chatOptionsItem}>Отключить уведомления</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.chat}>
            {searchActive ? (
              <div className={styles.searchPanel}>
                <div className={styles.searchControls}>
                  <button
                    className={styles.backBtn}
                    onClick={() => {
                      setSearchActive(!searchActive);
                    }}></button>
                  <div className={styles.fieldWithBtn}>
                    <input name='name' type='text' placeholder='Поиск по сообщениям' className={styles.field} />
                  </div>

                  <DatePicker
                    selected={startDate}
                    withPortal
                    locale={ru}
                    shouldCloseOnSelect={false}
                    disabledKeyboardNavigation
                    onChange={(date) => {
                      setStartDate(date);
                      console.log(date);
                    }}
                    ref={datepickerRef}
                    customInput={<CalendarBtnInput />}>
                    <div
                      className={styles.confirmDate}
                      onClick={() => {
                        setChatDate(startDate);
                        console.log(chatDate);
                        datepickerRef.current.setOpen(false);
                      }}>
                      Перейти к дате
                    </div>
                  </DatePicker>
                </div>
                <div className={styles.searchResults}>
                  <span className={styles.resultsHeader}>10 сообщений найдено</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => (
                    <div className={styles.searchResultsItem} key={index}>
                      <span className={styles.objectLetters}>ЛИ</span>

                      <div className={styles.searchMsgWrap}>
                        <span className={styles.SearchMsgName}>
                          {"Валентина Петровна 4".length > 15 ? "Валентина Петровна 4".substring(0, 15) + "..." : "Валентина Петровна 4"}
                        </span>
                        <span className={styles.SearchMsgText}>
                          {" Скажи, что у нас в доме скоро".length > 15
                            ? " Скажи, что у нас в доме скоро".substring(0, 25) + "..."
                            : " Скажи, что у нас в доме скоро"}
                        </span>
                      </div>
                      <span className={styles.SearchMsgTime}>18:20</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={styles.chatDate}>10 мая</div>
            <div className={styles.chatMessage}>
              {/* <span className={styles.objectLetters}>ЛИ</span>s */}
              <div className={styles.participantPic}>
                <Image src='/img/temp/fox.png' width={35} height={35} />
              </div>
              <div className={styles.messageBubble}>
                <span className={styles.messagePersonName}>Валентина Петровна 4</span>
                <span className={styles.messageText}>Что ему сказать? ))</span>
                <span className={styles.messageTime}>18:20</span>
              </div>
            </div>
            <div className={styles.chatMessage}>
              <span className={styles.objectLetters}>ЛИ</span>
              {/* <div className={styles.participantPic}>
                <Image src='/img/temp/fox.png' width={35} height={35} />
              </div> */}
              <div className={styles.messageBubble}>
                <span className={styles.messagePersonName}>Валентина Петровна 4</span>
                <span className={styles.messageText}>
                  Скажи, что у нас в доме скоро будет производиться ремонт и отключение горячей воды по графику будет перенесено на другую
                  дату
                </span>
                <span className={styles.messageTime}>18:20</span>
              </div>
            </div>
            <div className={styles.chatMessage}>
              {/* <span className={styles.objectLetters}>ЛИ</span> */}
              <div className={styles.participantPic}>
                <Image src='/img/temp/fox.png' width={35} height={35} />
              </div>
              <div className={styles.messageBubble}>
                <span className={styles.messagePersonName}>Валентина Петровна 4</span>
                <span className={styles.messageText}>Что ему сказать? )))))))))) 1111 11 11 1</span>
                <span className={styles.messageTime}>18:20</span>
              </div>
            </div>
            <div className={styles.chatMessageMine}>
              <div className={styles.messageBubble}>
                <span className={styles.messageText}>Что ему сказать?</span>

                <span className={styles.messageTime}>
                  {/* <span className={styles.checkSent}></span> */}
                  <span className={styles.checkDelivered}></span>
                  18:20
                </span>
              </div>
            </div>
            <div className={styles.chatMessageMine}>
              <div className={styles.messageBubble}>
                <span className={styles.messageText}>А?</span>

                <span className={styles.messageTime}>
                  {/* <span className={styles.checkSent}></span> */}
                  <span className={styles.checkDelivered}></span>
                  18:20
                </span>
              </div>
            </div>
            <div className={styles.chatMessage}>
              {/* <span className={styles.objectLetters}>ЛИ</span>s */}
              <div className={styles.participantPic}>
                <Image src='/img/temp/fox.png' width={35} height={35} />
              </div>
              <div className={styles.messageBubble}>
                <span className={styles.messagePersonName}>Валентина Петровна 4</span>
                <span className={styles.messageText}>А?</span>
                <span className={styles.messageTime}>18:20</span>
              </div>
            </div>
            <div className={styles.chatMessageMine}>
              <div className={styles.messageBubble}>
                <span className={styles.messageText}>
                  {/* {`Что ему сказать? Я не болтушка, но и не молчунья. Может это не самое подходящее начало для такой заметки, но дело не в
                  этом. Бывает, что ты узнаешь о человеке то, что сам человек еще не смог толком пережить. И это не просто слова. Самое
                  ужасное потерять кого-то. Все так неожиданно. Ты просто просыпаешься утром, а Его рядом нет. Небо такое же синее, солнце
                  такое же яркое и люди все точно такие же вокруг. Но..... Чего то не хватает. И не просто чего-то. Что-то сердцем. Оно
                  пустое и холодное, как снег в вакууме. И кажеться, что чуть-чуть и что-то оборвется и жизнь больше никогда-никогда не
                  будет такой, как сейчас. Ни слезы, ни переживания, не сочувствие не поможет.https://dev.to/adrien/creating-a-custom-react-hook-to-get-the-window-s-dimensions-in-next-js-135k`.replace(
                    /(http|https)\:\/\/(\S+)/g,
                    '<a href="$1://$2" target="_blank" rel="nofollow">$1://$2</a>'
                  )} */}
                  Что ему сказать? Я не болтушка, но и не молчунья. Может это не самое подходящее начало для такой заметки, но дело не в
                  этом. Бывает, что ты узнаешь о человеке то, что сам человек еще не смог толком пережить. И это не просто слова. Самое
                  ужасное потерять кого-то. Все так неожиданно. Ты просто просыпаешься утром, а Его рядом нет. Небо такое же синее, солнце
                  такое же яркое и люди все точно такие же вокруг. Но..... Чего то не хватает. И не просто чего-то. Что-то сердцем. Оно
                  пустое и холодное, как снег в вакууме. И кажеться, что чуть-чуть и что-то оборвется и жизнь больше никогда-никогда не
                  будет такой, как сейчас. Ни слезы, ни переживания, не сочувствие не поможет.
                </span>

                <span className={styles.messageTime}>
                  {/* <span className={styles.checkSent}></span> */}
                  <span className={styles.checkDelivered}></span>
                  18:20
                </span>
              </div>
            </div>
            <div className={styles.chatDate}>11 мая</div>
            <div className={styles.chatMessage}>
              {/* <span className={styles.objectLetters}>ЛИ</span> */}
              <div className={styles.participantPic}>
                <Image src='/img/temp/fox.png' width={35} height={35} />
              </div>
              <div className={styles.messageBubble}>
                <span className={styles.messagePersonName}>Валентина Петровна 4</span>
                <div className={styles.chatPicWrap}>
                  <img src='/img/temp/chatPic.png' layout='responsive' width='100%' height='100%' />
                  {/* <Image src='/img/temp/chatPic.png' width='100%' height='100%' layout='responsive' className={styles.chatPic} /> */}
                </div>
                <span className={styles.messageText}>Приятно отдохнуть!</span>
                <span className={styles.messageTime}>18:20</span>
              </div>
            </div>

            <div className={styles.chatMessagePartner}>
              {/* <span className={styles.objectLetters}>ЛИ</span> */}
              <div className={styles.participantPic}>
                <Image src='/img/temp/partnerProfilePic.png' width={35} height={35} />
              </div>
              <div className={styles.messageBubble}>
                <div className={styles.chatPicWrap}>
                  <img src='/img/temp/partnerMessagePic.png' layout='responsive' width='100%' height='100%' />
                  {/* <Image src='/img/temp/chatPic.png' width='100%' height='100%' layout='responsive' className={styles.chatPic} /> */}
                </div>
                <span className={styles.messageText}>
                  С 27 мая по 11 июня скидки до 100% на товары помеченные желтым ценником. Приобретая товары в www.magazintut.ru вы можете
                  выиграть главный приз. Спешите делать покупки и не упустить возможность отдохнуть на Гаваях.
                </span>
                <div className={styles.partnerTimeWrap}>
                  <span className={styles.partnerInfo}>
                    Это <span className={styles.hashtag}>#партнерский</span> пост
                  </span>
                  <span className={styles.messageTime}>18:20</span>
                </div>
              </div>
            </div>

            <div className={styles.scrollDummy} ref={chatRef}></div>
          </div>
          <div className={styles.chatFieldWrap}>
            <div className={styles.fieldTopBtns}>
              {/* <button className={styles.chatPlusBtn}>+</button> */}
              <span></span>
              <button
                className={styles.chatScrollToBottomBtn}
                onClick={() => {
                  setScrollToBottom(!scrollToBottom);
                }}></button>
            </div>
            <div className={styles.fieldBottomBtns}>
              <button className={styles.emojiBtn}></button>
              <textarea className={styles.chatField} />
              {/* <input type='file' className={styles.paperclipBtn}></input> */}
              <button className={styles.paperclipBtn}></button>
              <button className={styles.sendBtn}></button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .react-datepicker {
          // display: none;
          border-radius: 20px;
          overflow: hidden;
          height: 330px;
        }
        .react-datepicker * {
          font-family: "Gilroy";
        }
        .react-datepicker__header {
          background-color: white;
        }

        .react-datepicker__current-month {
          font-weight: 500;
          font-size: 16px;
          line-height: 130%;
          /* identical to box height, or 21px */

          letter-spacing: 0.04em;

          /* 254A63 */

          color: #254a63;
        }
        .react-datepicker__day-name {
          font-weight: 500;
          font-size: 14px;
          line-height: 140%;
          /* identical to box height, or 20px */

          /* Grey colors / C#2 */

          color: #a7aab4;
        }
        .react-datepicker__portal {
          background-color: rgba(0, 0, 0, 0);
        }
        .react-datepicker__day {
          font-weight: 400;
          margin: 0;
          width: 2rem !important;
          line-height: 2rem !important;
          font-size: 14px;
          line-height: 140%;
          /* identical to box height, or 20px */

          /* Accent colors / C#1 */

          color: #393939;
        }
        .react-datepicker__day--today {
          background-color: white !important;
          color: #393939 !important;
        }
        .react-datepicker__day--today.react-datepicker__day--selected {
          background-color: #ff8c00 !important;
          color: white !important;
        }
        .react-datepicker__day-name {
          margin: 0;
          width: 2rem !important;
          line-height: 2rem !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          border-radius: 10px;
          background-color: #ff8c00;
          color: white;
          transition: all 0.1s;
        }
        .react-datepicker__day--selected:hover,
        .react-datepicker__day--keyboard-selected:hover {
          background-color: #ff8c00;
          transition: all 0.1s;
        }
      `}</style>
    </LayoutLoggedIn>
  );
}
