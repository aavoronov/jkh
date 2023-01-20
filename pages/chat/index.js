import ru from "date-fns/locale/ru";
import Image from "next/image";
import Link from "next/link";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./chat.module.scss";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import axios from "axios";
import { useSelector } from "react-redux";

import io, { Manager } from "socket.io-client";
import { getCookie } from "cookies-next";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";
import { current } from "@reduxjs/toolkit";
// import { socket } from "../../service/socket";

// const socket = io("http://localhost:5000/", {
//   autoConnect: false,
//   query: `pseudonym=${pseudonym}`,
// });

const Dropzone = ({ files, filename, setFilename, setFiles, chatTextValue, setChatTextValue, handleKeyPress }) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const hiddenFileInput = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      // !files.length &&
      setFiles(
        files
          .concat(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          )
          .slice(0, 1)
      );
      setFilename(acceptedFiles[0].name);

      setIsDraggedOver(false);
    },
    onDragOver: () => {
      setIsDraggedOver(true);
    },
    onDragLeave: () => {
      setIsDraggedOver(false);
    },
    maxFiles: 1,
    maxSize: 1000000,
    multiple: false,
  });
  // const { getRootProps, getInputProps } = useDropzone({ maxFiles: 10, maxSize: 3000000, multiple: true, onDrop });

  const removeFile = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    console.log(files);
  };

  const removeAll = () => {
    setFiles([]);
    setFilename("");
  };
  const thumbs = files.map((i) => (
    <div
      className={styles.thumb}
      // key={i.name}
      key={Math.random().toString()}>
      <div className={styles.thumbInner}>
        <img
          src={i.preview}
          className={styles.img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(i.preview);
          }}
        />
        <button className={styles.imageRemove} onClick={() => removeAll()}></button>
        {/* <span className={styles.fileName}>{filename}</span> */}
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((i) => URL.revokeObjectURL(i.preview));
  }, []);

  return (
    <>
      <div className={styles.dragndropWrap}>
        {/* <div {...getRootProps({ className: isDraggedOver ? styles.hoveredOver : "" })}> */}
        <div className={isDraggedOver ? styles.hoveredOver : ""}>
          {!files.length && <input {...getInputProps()} className={styles.paperclipBtn} ref={hiddenFileInput} />}
          <button className={styles.paperclipBtn} onClick={() => hiddenFileInput.current.click()}></button>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {" "}
            <textarea
              className={
                isDraggedOver
                  ? styles.chatField + " " + styles.dragndropField + " " + styles.hoveredOver
                  : styles.chatField + " " + styles.dragndropField
              }
              style={{ boxShadow: "none" }}
              value={chatTextValue}
              onChange={(event) => setChatTextValue(event.target.value)}
              onKeyPress={handleKeyPress}
            />{" "}
            <aside className={styles.thumbsContainer}>{thumbs}</aside>
          </div>
          {/* <button
            className={styles.paperclipBtn}
            // {...getInputProps()}
            style={{ display: "block" }}
            onClick={() => console.log(files)}></button> */}
          {/* {files.length ? (
            <span className={styles.dragndropFieldBtn + " " + styles.filled} onClick={removeAll}></span>
          ) : (
            <span className={styles.dragndropFieldBtn}></span>
          )} */}
        </div>
      </div>
    </>
  );
};

const getHumanReadableDate = (date) => {
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return date.getDate() + " " + monthNames[date.getMonth()];
};

const getHumanReadableDateCompare = (datePrev, date) => {
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  return datePrev.getDate() === date.getDate() && datePrev.getMonth() === date.getMonth()
    ? ""
    : date.getDate() + " " + monthNames[date.getMonth()];
};

export default function Chat() {
  const datepickerRef = useRef(null);

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [chatDate, setChatDate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatTextValue, setChatTextValue] = useState("");
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [myChats, setMyChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [chatUsersSearchField, setChatUsersSearchField] = useState("");
  const [query, setQuery] = useState("");
  const [searchMessages, setSeatchMessages] = useState([]);

  const pseudonym = useSelector((state) => state.user.pseudonym);
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    async function getMessages() {
      if (!!email) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${email}`, {
            headers: {
              Authorization: getCookie("jkh-token"),
            },
          });

          const initialMessages = res.data.data.map((item) => {
            const serverDate = item.createdAt;
            const localDate = new Date(serverDate);
            return {
              message: item.message,
              date: localDate,
              time: localDate.getHours().toString().padStart(2, "0") + ":" + localDate.getMinutes().toString().padStart(2, "0"),
              name: item.user.profile.pseudonym,
              color: item.user.profile.color,
              file: item.file,
              roomId: item.roomId,
            };
          });
          // console.log(initialMessages);
          setMessages(initialMessages);
          // console.log(messages);
          setScrollToBottom((prev) => prev + 1);
        } catch (e) {
          console.log(e);
        }
      }
    }
    getMessages();
  }, [email]);

  const handleNewMessage = (data) => {
    // setMessages([...messages, data]);
    console.log("newmsg");
    if (!!data.file) {
      const blob = new Blob([data.file]);
      const url = URL.createObjectURL(blob);
      console.log(url);
      data = { ...data, file: url };
    }
    console.log(data);
    // messages.push(data);
    // messages = [...messages, data];
    setMessages((prev) => [...prev, data]);
    console.log(messages);
    setScrollToBottom((prev) => prev + 1);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // setChatTextValue(chatTextValue + "\n");
      } else {
        event.preventDefault();
        !!chatTextValue && sendMessage({ email: email, text: chatTextValue, color: personalColor, filename, roomId: currentChatId });
        setChatTextValue("");
        setFiles([]);
        setFilename("");
      }
    }
  };

  const manager = new Manager("http://localhost:5000/", {
    autoConnect: false,
    query: `pseudonym=${pseudonym}`,
  });

  const socket = manager.socket("/chat"); // main namespace

  const [collapseBtnVisible, setCollapseBtnVisible] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    // console.log();
    setScrollPosition(position);
  };

  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const personalColor = useSelector((state) => state.user.color);

  socket.connect();
  console.log("connect");

  useEffect(() => {}, []);

  useEffect(() => {
    if (!!myChats.length) {
      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("pong", () => {
        setLastPong(new Date().toISOString());
        console.log("pong!");
      });

      // socket.on(
      //   "newConnection",
      //   (payload) => {
      //     console.log(payload);
      //   },
      //   { room: currentChatId }
      // );

      socket.on("message", (data) => {
        console.log("msg");
        handleNewMessage(data);

        // console.log(data);
      });

      socket.emit(
        "joinRoom",
        myChats.map((item) => item.id)
      );

      return () => {
        socket.disconnect();
        socket.off("connect");
        socket.off("disconnect");
        socket.off("pong");
        socket.off("newConnection");
        socket.off("message");
      };
    }
  }, [myChats]);

  const sendPing = () => {
    socket.emit("ping");
  };

  const sendMessage = async (payload) => {
    if (!!files.length) payload = { ...payload, file: files[0] };
    socket.emit("message", payload);

    try {
      const msgFormData = new FormData();
      msgFormData.append("sender", payload.email);
      msgFormData.append("message", payload.text);
      msgFormData.append("roomId", payload.roomId);
      !!files.length && msgFormData.append("file", files[0], filename);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, msgFormData, {
        headers: { Authorization: getCookie("jkh-token"), "Content-Type": !files.length ? "application/json" : "multipart/form-data" },
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }

    // email: email, text: chatTextValue, color: personalColor

    // let msg = payload;
  };

  useEffect(() => {
    const regularPing = setInterval(() => sendPing(), 1000);
    return clearInterval(regularPing);
  }, []);

  // useEffect(() => {
  //   async function chatConnect() {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat`);
  //     console.log(res);
  //   }
  //   chatConnect();
  // }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { width } = useWindowDimensions();

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
  }, [scrollToBottom]);

  const CalendarBtnInput = forwardRef(({ onClick }, ref) => <button className={styles.calendarBtn} onClick={onClick} ref={ref}></button>);

  async function getSearchMessages() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat?query=${query}`);
  }

  const ChatMessage = ({ isMine = false, isPaid = false, name, text, profilePic, time, file, color }) => {
    if (!!file && !file.includes("blob")) {
      file = `${process.env.NEXT_PUBLIC_API_URL}/chat/uploads/${file}`;
      // console.log(img);
      // console.log(file.includes("blob"));
    }
    // if (!!file) {
    //   const img = new Image({ src: file, layout: "fill" });
    // img.src = file;
    // img.onload = () => {
    // img.width
    // img.height
    // console.log(img.width);
    // };
    // }
    return (
      <div className={isMine ? styles.chatMessageMine : styles.chatMessage}>
        {!isMine ? (
          !profilePic ? (
            <span className={styles.objectLetters} style={{ backgroundColor: color }}>
              {name.split(" ").length > 1 ? name.split(" ")[0][0] + name.split(" ")[1][0] : name.slice(0, 2)}
            </span>
          ) : (
            <div className={styles.participantPic}>
              <Image src={profilePic} width={35} height={35} />
            </div>
          )
        ) : null}
        <div className={styles.messageBubble}>
          {!isMine && !isPaid && !!name && (
            <span className={styles.messagePersonName} style={{ color: color }}>
              {name}
            </span>
          )}
          {!!file && (
            <div className={styles.chatPicWrap}>
              <img src={file} layout='responsive' style={{ maxWidth: "100%" }} />

              {/* <Image src='/img/temp/chatPic.png' width='100%' height='100%' layout='responsive' className={styles.chatPic} /> */}
            </div>
          )}
          {/* <img
            src='http://localhost:5000/uploads/MC4wMTU4ODcxNTg0Nzc4MDI2NDMxNjczNTIzMzc0ODg4.png'
            layout='responsive'
            width='100%'
            height='100%'
          /> */}
          <span className={styles.messageText}>{text}</span>

          {!isPaid ? (
            <span className={styles.messageTime}>
              {/* <span className={styles.checkSent}></span> */}
              {/* <span className={styles.checkDelivered}></span> */}
              {time}
            </span>
          ) : (
            <div className={styles.partnerTimeWrap}>
              <span className={styles.partnerInfo}>
                Это <span className={styles.hashtag}>#партнерский</span> пост
              </span>
              <span className={styles.messageTime}>{time}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    async function getMyChats() {
      if (!!email) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/my/${email}`, {
            headers: {
              Authorization: getCookie("jkh-token"),
            },
          });

          const chats = res.data.map((item) => item.chat);
          console.log(chats);
          setMyChats(chats);
        } catch (e) {
          console.log(e);
        }
      }
    }
    getMyChats();
  }, [email]);

  useEffect(() => {
    if (!!myChats.length) {
      setCurrentChat(myChats[0].address);
      setCurrentChatId(parseInt(myChats[0].id));
    }
  }, [myChats]);

  useEffect(() => {
    if (!!myChats.length) {
      const users = [];
      myChats.forEach((item) => {
        async function getChatUsers() {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/room/${item.id}/users`, {
              headers: { Authorization: getCookie("jkh-token") },
            });
            // console.log(res.data);
            users.push(res.data);
            // return res.data;
          } catch (e) {
            console.log(e);
          }
        }
        getChatUsers();
      });
      console.log(users);
      setChatUsers(users);
    }
  }, [myChats]);

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
          {myChats.map((item, index) => (
            <div
              className={item.address === currentChat ? styles.chatTab + " " + styles.active : styles.chatTab}
              key={index}
              onClick={() => {
                setCurrentChat(item.address);
                setCurrentChatId(parseInt(item.id));
              }}>
              <span className={styles.objectLetters}>{item.address.split(" ")[0][0] + item.address.split(" ")[1][0]}</span>
              <span className={styles.objectName}>{item.address}</span>
            </div>
          ))}
          <div className={styles.chatTab + " " + styles.active + " " + styles.addChat}>
            <Link href='/chat/add-chat'>
              <span className={styles.objectLetters}>+</span>
            </Link>
          </div>
        </div>

        <div className={styles.chatContainer}>
          {/* <div>
            <p>Connected: {"" + isConnected}</p>
            <p>Last pong: {lastPong || "-"}</p>
            <button onClick={sendPing}>Send ping</button>
          </div> */}
          <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
            <div className={styles.fieldWithBtn + " " + styles.users}>
              <input
                name='name'
                type='text'
                placeholder='Поиск'
                className={styles.field}
                value={chatUsersSearchField}
                onChange={(e) => setChatUsersSearchField(e.target.value)}
              />
            </div>
            <div className={styles.participantsBlock}>
              {!!chatUsers.length &&
                chatUsers
                  .filter((item) => parseInt(item.roomId) === currentChatId)[0]
                  .users.map(
                    (item) =>
                      item.user.profile.pseudonym.toLowerCase().includes(chatUsersSearchField.toLowerCase()) && (
                        <div className={styles.participant}>
                          <span className={styles.objectLetters} style={{ backgroundColor: item.user.profile.color }}>
                            {item.user.profile.pseudonym.split(" ").length > 1
                              ? item.user.profile.pseudonym.split(" ")[0][0] + item.user.profile.pseudonym.split(" ")[1][0]
                              : item.user.profile.pseudonym.slice(0, 2)}
                          </span>
                          <span className={styles.participantName}>{item.user.profile.pseudonym}</span>
                        </div>
                      )
                  )}

              {/* <div className={styles.participant}>
                <span className={styles.objectLetters}>ЛИ</span>
                <span className={styles.participantName}>Лариса Иванова</span>
              </div>
              <div className={styles.participant}>
                <div className={styles.participantPic}>
                  <Image src='/img/temp/fox.png' width={35} height={35} />
                </div>

                <span className={styles.participantName}>Лисенок 45</span>
              </div> */}
            </div>
          </aside>
          <div className={styles.chatControls}>
            {!!currentChat.length && (
              <>
                <div className={styles.chatTab + " " + styles.active}>
                  <span className={styles.objectLetters}>
                    {currentChat ? currentChat.split(" ")[0][0] + currentChat.split(" ")[1][0] : ""}
                  </span>
                  <span className={styles.objectName}>{currentChat}</span>
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
              </>
            )}
          </div>
          <div className={styles.chat}>
            {!currentChat.length && (
              <div style={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ textAlign: "center" }}>
                  Вы не зарегистрированы ни в одном домовом чате. Нажмите на кнопку "+" выше, чтобы посмотреть доступные домовые чаты.
                </span>
              </div>
            )}
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

            {/* <div className={styles.chatDate}>10 мая</div>

            <ChatMessage name='Валентина Петровна 4' text='Что ему сказать? ))' profilePic='/img/temp/fox.png' time='18:20' />
            <ChatMessage
              name='Валентина Петровна 4'
              text='Скажи, что у нас в доме скоро будет производиться ремонт и отключение горячей воды по графику будет перенесено на другую дату'
              profilePic='/img/temp/fox.png'
              time='18:20'
            />
            <ChatMessage
              name='Валентина Петровна 4'
              text='Что ему сказать? )))))))))) 1111 11 11 1'
              profilePic='/img/temp/fox.png'
              time='18:20'
            />
            <ChatMessage isMine name='Валентина Петровна 4' text='Что ему сказать?' profilePic='/img/temp/fox.png' time='18:20' />
            <ChatMessage isMine name='Валентина Петровна 4' text='А?' profilePic='/img/temp/fox.png' time='18:20' />
            <ChatMessage name='Валентина Петровна 4' text='А?' profilePic='/img/temp/fox.png' time='18:20' />
            <ChatMessage
              isMine
              name='Валентина Петровна 4'
              text='Что ему сказать? Я не болтушка, но и не молчунья. Может это не самое подходящее начало для такой заметки, но дело не в этом. Бывает, что ты узнаешь о человеке то, что сам человек еще не смог толком пережить. И это не просто слова. Самое ужасное потерять кого-то. Все так неожиданно. Ты просто просыпаешься утром, а Его рядом нет. Небо такое же синее, солнце такое же яркое и люди все точно такие же вокруг. Но..... Чего то не хватает. И не просто чего-то. Что-то сердцем. Оно пустое и холодное, как снег в вакууме. И кажеться, что чуть-чуть и что-то оборвется и жизнь больше никогда-никогда не будет такой, как сейчас. Ни слезы, ни переживания, не сочувствие не поможет.'
              profilePic='/img/temp/fox.png'
              time='18:20'
            />
            <div className={styles.chatDate}>11 мая</div>
            <ChatMessage
              name='Валентина Петровна 4'
              text='Приятно отдохнуть!'
              profilePic='/img/temp/fox.png'
              time='18:20'
              pic='/img/temp/chatPic.png'
            />
            <ChatMessage
              isPaid
              name='Валентина Петровна 4'
              text=' С 27 мая по 11 июня скидки до 100% на товары помеченные желтым ценником. Приобретая товары в www.magazintut.ru вы можете
                  выиграть главный приз. Спешите делать покупки и не упустить возможность отдохнуть на Гаваях.'
              profilePic='/img/temp/partnerProfilePic.png'
              time='18:20'
              pic='/img/temp/partnerMessagePic.png'
            /> */}

            {/* {messages.map((item, index) => { */}
            {messages
              .filter((item) => item.roomId === currentChatId)
              .map((item, index) => {
                let date = "";

                // const chatsIds = myChats.map((item) => item.id);
                // console.log(chatsIds);

                if (!!item.date) {
                  if (index === 0) {
                    date = getHumanReadableDate(item.date);
                  } else {
                    date = getHumanReadableDateCompare(messages.filter((item) => item.roomId === currentChatId)[index - 1].date, item.date);
                  }
                }
                // console.log(messages.filter((item) => item.roomId === currentChatId));
                return (
                  <>
                    {date && <div className={styles.chatDate}>{date}</div>}
                    {/* <div className={styles.chatDate}>{date}</div> */}
                    <ChatMessage
                      key={index}
                      name={item.name}
                      text={item.message.replace(/\n/g, "<br/>")}
                      isMine={item.name === pseudonym}
                      time={item.time}
                      color={item.color}
                      file={item.file}
                    />
                  </>
                );
                // isMine = false, isPaid = false, name, text, profilePic, time, pic = false
              })}

            <div className={styles.scrollDummy} ref={chatRef}></div>
          </div>
          {!!currentChat && (
            <div className={styles.chatFieldWrap}>
              <div className={styles.fieldTopBtns}>
                {/* <button className={styles.chatPlusBtn}>+</button> */}
                <span></span>
                <button
                  className={styles.chatScrollToBottomBtn}
                  onClick={() => {
                    setScrollToBottom((prev) => prev + 1);
                    console.log(scrollToBottom);
                  }}></button>
              </div>
              <div className={styles.fieldBottomBtns}>
                <button className={styles.emojiBtn} onClick={() => console.log(chatUsers)}></button>
                <Dropzone
                  files={files}
                  filename={filename}
                  setFilename={setFilename}
                  setFiles={setFiles}
                  placeholder='Договор'
                  chatTextValue={chatTextValue}
                  setChatTextValue={setChatTextValue}
                  handleKeyPress={handleKeyPress}
                />
                {/* <textarea
                className={styles.chatField}
                value={chatTextValue}
                onChange={(event) => setChatTextValue(event.target.value)}
                onKeyPress={handleKeyPress}></textarea> */}
                {/* <input type='file' className={styles.paperclipBtn}></input> */}
                {/* <button className={styles.paperclipBtn} onClick={() => console.log("test")}></button> */}
                <button
                  className={styles.sendBtn}
                  onClick={() => {
                    !!chatTextValue &&
                      sendMessage({ email: email, text: chatTextValue, color: personalColor, filename, roomId: currentChatId });
                    setChatTextValue("");
                    setFiles([]);
                    setFilename("");
                  }}></button>
              </div>
            </div>
          )}
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
