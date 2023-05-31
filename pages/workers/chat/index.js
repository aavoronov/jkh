import ru from "date-fns/locale/ru";
import Image from "next/image";
import Link from "next/link";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "./chat.module.scss";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../../components/useWindowDimensionsSSR";

import { getCookie } from "cookies-next";
import { useDropzone } from "react-dropzone";
import { Manager } from "socket.io-client";
import { toggle } from "../../../store/notificationSlice";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import LayoutWorker from "../../../components/LayoutWorker";
import { banRoots, banWords } from "../../../service/ban-words";

const manager = new Manager(`https://api.1203521-cu41329.tw1.ru/pizda/`, {
  autoConnect: false,
});

const socket = manager.socket("/chat"); // main namespace

socket.connect();

const Dropzone = ({ files, filename, setFilename, setFiles, chatTextValue, setChatTextValue, handleKeyPress }) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const hiddenFileInput = useRef(null);

  const pseudonym = useSelector((state) => state.user.pseudonym);

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
          {!files.length && <button className={styles.paperclipBtn} onClick={() => hiddenFileInput.current.click()}></button>}

          <div style={{ display: "flex", flexDirection: "row" }}>
            {" "}
            <textarea
              className={
                isDraggedOver
                  ? styles.chatField + " " + styles.dragndropField + " " + styles.hoveredOver
                  : styles.chatField + " " + styles.dragndropField
              }
              placeholder={!pseudonym ? "Введите свой псевдоним в личном кабинете, чтобы отправлять сообщения" : ""}
              readOnly={!pseudonym}
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
  const [messages, setMessages] = useState([]);
  const [calendarMessages, setCalendarMessages] = useState([]);
  const [chatTextValue, setChatTextValue] = useState("");
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [myChats, setMyChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [chatUsersSearchField, setChatUsersSearchField] = useState("");
  const [query, setQuery] = useState("");
  const [searchMessages, setSearchMessages] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [scrollPage, setScrollPage] = useState(0);
  const [startReached, setStartReached] = useState(false);

  const pseudonym = useSelector((state) => state.user.pseudonym);
  const email = useSelector((state) => state.user.email);
  const profilePic = useSelector((state) => state.user.profilePic);

  const dispatch = useDispatch();

  async function getMessages() {
    if (!!email && !startReached) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });

        const fetchedMessages = res.data.data.map((item) => {
          const serverDate = item.createdAt;
          const localDate = new Date(serverDate);
          const name = item.user.profile ? item.user.profile.pseudonym : item.user.workerProfile.name;
          const color = item.user.profile ? item.user.profile.color : item.user.workerProfile.color;
          const profilePic = item.user.profile ? item.user.profile.profilePic : item.user.workerProfile.profilePic;
          const link = item.chatAd?.link ?? item.link;
          return {
            message: item.message,
            date: localDate,
            time: localDate.getHours().toString().padStart(2, "0") + ":" + localDate.getMinutes().toString().padStart(2, "0"),
            link: link,
            name: name,
            color: color,
            profilePic: profilePic,
            file: item.file,
            isPaid: (item.user.role === "stores") | (item.user.role === "business"),
            roomId: item.roomId,
          };
        });
        // console.log(initialMessages);
        if (!fetchedMessages.length) setStartReached((prev) => !prev);
        setMessages([...fetchedMessages]);
        // console.log(messages);
        setScrollPage((prev) => prev + 1);
        // setScrollToBottom((prev) => prev + 1);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function getMoreMessages() {
    if (!!email && !startReached) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/more?page=${scrollPage}&chat=${currentChatId}`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });

        const fetchedMessages = res.data.data.map((item) => {
          const serverDate = item.createdAt;
          const localDate = new Date(serverDate);
          const name = item.user.profile ? item.user.profile.pseudonym : item.user.workerProfile.name;
          const color = item.user.profile ? item.user.profile.color : item.user.workerProfile.color;
          const profilePic = item.user.profile ? item.user.profile.profilePic : item.user.workerProfile.profilePic;
          return {
            message: item.message,
            date: localDate,
            time: localDate.getHours().toString().padStart(2, "0") + ":" + localDate.getMinutes().toString().padStart(2, "0"),
            name: name,
            color: color,
            profilePic: profilePic,
            file: item.file,
            isPaid: (item.user.role === "stores") | (item.user.role === "business"),
            roomId: item.roomId,
          };
        });
        if (!fetchedMessages.length) setStartReached((prev) => !prev);
        setMessages([...fetchedMessages, ...messages]);
        setScrollPage((prev) => prev + 1);
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    getMessages();
    sendPing();
  }, [email, currentChatId]);

  const handleNewMessage = (data) => {
    if (Array.isArray(data.roomId)) {
      const filteredArray = data.roomId.filter((value) => myChats.map((item) => item.id).includes(value));
      if (!filteredArray.length) return;
      // if (data.roomId.includes())
    }

    setMessages((prev) => [...prev, data]);
    setScrollToBottom((prev) => prev + 1);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // setChatTextValue(chatTextValue + "\n");
      } else {
        event.preventDefault();
        !!chatTextValue.length &&
          sendMessage({
            email: email,
            pseudonym: pseudonym,
            text: chatTextValue,
            color: personalColor,
            profilePic: profilePic,
            filename,
            roomId: currentChatId,
          });
      }
    }
  };

  async function leaveChat() {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/sign-up?email=${email}&chat=${currentChatId}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      dispatch(toggle({ text: "Чат успешно удален", type: "success" }));
      const newChats = myChats.filter((item) => item.id !== currentChatId);
      setMyChats(newChats);
      if (!!myChats.length) {
        setCurrentChat(myChats[0].chat);
        setCurrentChatId(myChats[0].id);
      } else {
        // setMessages([]);
        // setChatUsers([]);
        // setCurrentChat("");
        // setCurrentChatId("");
      }
    } catch (e) {
      console.log(e);
      // dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  }

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
        // console.log("pong!");
      });

      // socket.on(
      //   "newConnection",
      //   (payload) => {
      //     console.log(payload);
      //   },
      //   { room: currentChatId }
      // );

      socket.on("message", (data) => {
        handleNewMessage(data);
        // console.log("new msg");
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
    if (!!email && !!currentChatId) {
      socket.emit("ping", [email, currentChatId]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      //
      sendPing();
      // console.log("This will run every 10 seconds!");
    }, 1000 * 300);
    return () => clearInterval(interval);
    // setTimeout(sendPing, 10000);
  }, [email, currentChatId]);

  const sendMessage = async (payload) => {
    try {
      const message = payload.text.toLowerCase();

      banRoots.forEach((item) => {
        if (message.includes(item)) {
          throw new Error("Ваше сообщение содержит неприемлемое слово");
        }
      });

      banWords.forEach((item) => {
        if (message.includes(item)) {
          throw new Error("Ваше сообщение содержит неприемлемое слово");
        }
      });

      if (!!files.length) payload = { ...payload, file: files[0] };
      socket.emit("message", payload);

      setChatTextValue("");
      setFiles([]);
      setFilename("");
    } catch (e) {
      // console.log("e", e);
      dispatch(toggle({ text: e.message, type: "error" }));
    }
  };

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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/search?query=${query}&chat=${currentChatId}`, {
      headers: { Authorization: getCookie("jkh-token") },
    });
    setSearchMessages(res.data.data);
  }

  async function getCalendarMessages(date) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/calendar?date=${date}&chat=${currentChatId}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      const fetchedMessages = res.data.data.map((item) => {
        const serverDate = item.createdAt;
        const localDate = new Date(serverDate);
        const name = item.user.profile ? item.user.profile.pseudonym : item.user.workerProfile.name;
        const color = item.user.profile ? item.user.profile.color : item.user.workerProfile.color;
        const profilePic = item.user.profile ? item.user.profile.profilePic : item.user.workerProfile.profilePic;
        const link = item.chatAd?.link ?? item.link;
        return {
          message: item.message,
          date: localDate,
          time: localDate.getHours().toString().padStart(2, "0") + ":" + localDate.getMinutes().toString().padStart(2, "0"),
          link: link,
          name: name,
          color: color,
          profilePic: profilePic,
          file: item.file,
          isPaid: (item.user.role === "stores") | (item.user.role === "business"),
          roomId: item.roomId,
        };
      });
      // console.log(initialMessages);
      setCalendarMessages(fetchedMessages);
      // setMessages(res.data.data);}
    } catch (e) {
      console.log(e);
    }
  }

  const handleScrollUp = (e) => {
    let element = e.target;
    if (element.scrollTop === 0) {
      getMoreMessages();
    }
  };

  const ChatMessage = ({ isMine = false, isPaid = false, name, text, link, profilePic, time, file, color }) => {
    if (!!file && !file.includes("blob")) {
      file = file.slice(0, 4) === "data" ? file : `${process.env.NEXT_PUBLIC_API_URL}/uploads/chat/${file}`;
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
    const dateObj = new Date(time);
    const actualTime =
      time.length > 5 ? dateObj.getHours().toString().padStart(2, "0") + ":" + dateObj.getMinutes().toString().padStart(2, "0") : time;
    return (
      <div className={isMine ? styles.chatMessageMine : styles.chatMessage}>
        {!isMine ? (
          !profilePic ? (
            <span className={styles.objectLetters} style={{ backgroundColor: color }}>
              {name.split(" ").length > 1 ? name.split(" ")[0][0] + name.split(" ")[1][0] : name.slice(0, 2)}
            </span>
          ) : (
            <div className={styles.participantPic}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
                style={{ width: 35, height: 35, borderRadius: 35, objectFit: "cover" }}
              />
            </div>
          )
        ) : null}
        <div className={styles.messageBubble}>
          {!isMine && !!name && (
            <span className={styles.messagePersonName} style={{ color: color }}>
              {name}
            </span>
          )}
          {!!file && (
            <div className={styles.chatPicWrap}>
              <img src={file} layout='responsive' style={{ maxWidth: "100%", maxHeight: 500 }} />

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
              {actualTime}
            </span>
          ) : (
            <div className={styles.partnerTimeWrap}>
              <span className={styles.partnerInfo}>
                {/* Это <span className={styles.hashtag}>#партнерский</span> пост.{" "} */}
                Это партнерский пост.{" "}
                {!!link && (
                  <a href={link.includes("http") ? link : `https://${link}`} className={styles.hashtag} target='_blank'>
                    Перейдите по ссылке, чтобы узнать подробности.
                  </a>
                )}
              </span>
              <span className={styles.messageTime}>{actualTime}</span>
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
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/my`, {
            headers: {
              Authorization: getCookie("jkh-token"),
            },
          });

          const chats = res.data.map((item) => item.chat);
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
    } else {
      setCurrentChat("");
      setCurrentChatId("");
      setMessages([]);
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
      setChatUsers(users);
    } else {
      setChatUsers([]);
    }
  }, [myChats]);

  return (
    <LayoutWorker title='ЖКХ Консьерж - домовые чаты' description='description' keywords='keywords'>
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
            <Link href='/workers/chat/add-chat'>
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
                  .filter((item) => parseInt(item.roomId) === currentChatId || item.roomId.includes(currentChatId.toString()))[0]
                  .users.map((item) => {
                    const name = item.user.profile?.pseudonym ?? item.user.workerProfile?.name;
                    const profilePic = item.user.profile?.profilePic ?? item.user.workerProfile?.profilePic;
                    const color = item.user.profile?.color ?? item.user.workerProfile?.color;
                    return (
                      name.toLowerCase().includes(chatUsersSearchField.toLowerCase()) && (
                        <div className={styles.participant}>
                          {/* const profilePic = useSelector((state) => state.user.profilePic); */}
                          {profilePic ? (
                            // <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.user.profile.profilePic}`} />
                            <div className={styles.participantPic}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
                                style={{ width: 35, height: 35, borderRadius: 35, objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <span className={styles.objectLetters} style={{ backgroundColor: color }}>
                              {name.split(" ").length > 1 ? name.split(" ")[0][0] + name.split(" ")[1][0] : name.slice(0, 2)}
                            </span>
                          )}
                          <span className={styles.participantName}>{name}</span>
                        </div>
                      )
                    );
                  })}
            </div>
          </aside>
          <div className={styles.chatControls}>
            {!!currentChat?.length && (
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
                  {/* <div className={styles.chatBtn + " " + styles.chatThreeDots}>
                    <div className={styles.threeDotsBtnMenu}>
                      <span className={styles.chatOptionsItem} onClick={() => leaveChat()}>
                        Покинуть чат
                      </span>
                      <span className={styles.chatOptionsItem} onClick={() => console.log(messages)}>
                        Отключить уведомления
                      </span>
                    </div>
                  </div> */}
                </div>
              </>
            )}
          </div>
          <div className={styles.chat} onScroll={handleScrollUp}>
            {!currentChat?.length && (
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
                  <div className={styles.fieldWithBtn} style={{ display: "flex", flexDirection: "row" }}>
                    <input
                      name='name'
                      type='text'
                      placeholder='Поиск по сообщениям'
                      className={styles.field}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <span className={styles.searchFieldBtn} onClick={() => query && getSearchMessages()}></span>
                  </div>

                  <DatePicker
                    maxDate={Date.now()}
                    selected={startDate}
                    withPortal
                    locale={ru}
                    shouldCloseOnSelect={false}
                    disabledKeyboardNavigation
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                    ref={datepickerRef}
                    customInput={<CalendarBtnInput />}>
                    <div
                      className={styles.confirmDate}
                      onClick={() => {
                        // setChatDate(startDate);
                        // console.log(chatDate);
                        datepickerRef.current.setOpen(false);
                        getCalendarMessages(startDate);
                      }}>
                      Перейти к дате
                    </div>
                  </DatePicker>
                </div>
                <div className={styles.searchResults}>
                  {!!searchMessages.length && <span className={styles.resultsHeader}>{searchMessages.length} сообщений найдено</span>}
                  {searchMessages.map((item, index) => {
                    const color = item.user.profile?.color ?? item.user.workerProfile?.color;
                    const name = item.user.profile ? item.user.profile.pseudonym : item.user.workerProfile.name;
                    const profilePic = item.user.profile ? item.user.profile.profilePic : item.user.workerProfile.profilePic;

                    return (
                      <div className={styles.searchResultsItem} key={index}>
                        {profilePic ? (
                          // <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.user.profile.profilePic}`} />
                          <div className={styles.participantPic}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
                              style={{ width: 35, height: 35, borderRadius: 35, objectFit: "cover" }}
                            />
                          </div>
                        ) : (
                          <span className={styles.objectLetters} style={{ backgroundColor: color }}>
                            {name.split(" ").length > 1 ? name.split(" ")[0][0] + name.split(" ")[1][0] : name.slice(0, 2)}
                          </span>
                        )}

                        <div className={styles.searchMsgWrap}>
                          <span className={styles.SearchMsgName}>{name.length > 15 ? name.substring(0, 15) + "..." : name}</span>
                          <span className={styles.SearchMsgText}>
                            {item.message.length > 15 ? item.message.substring(0, 25) + "..." : item.message}
                          </span>
                        </div>
                        <span className={styles.SearchMsgTime}>{currentDatetime(item.createdAt)}</span>

                        {/* date.getDate() + " " + monthNames[date.getMonth()]; */}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {!calendarMessages.length && startReached && !!myChats.length && <div className={styles.chatDate}>{"Начало истории чата"}</div>}
            {/* {messages.map((item, index) => { */}
            {(() => {
              const msgs = !!calendarMessages.length ? calendarMessages : messages;
              return msgs
                .filter((item) => (Array.isArray(item.roomId) ? item.roomId.includes(currentChatId) : item.roomId === currentChatId))
                .map((item, index) => {
                  let date = "";

                  // const chatsIds = myChats.map((item) => item.id);
                  // console.log(chatsIds);

                  if (!!item.date) {
                    if (index === 0) {
                      date = getHumanReadableDate(item.date);
                    } else {
                      date = getHumanReadableDateCompare(msgs.filter((item) => item.roomId === currentChatId)[index - 1].date, item.date);
                    }
                  }
                  // console.log(messages.filter((item) => item.roomId === currentChatId));
                  return (
                    <>
                      {date && <div className={styles.chatDate}>{date}</div>}

                      <ChatMessage
                        key={index}
                        name={item.name}
                        text={item.message.replace(/\n/g, "<br/>")}
                        link={item.link}
                        isMine={item.name === pseudonym}
                        isPaid={item.isPaid}
                        time={item.time}
                        color={item.color}
                        profilePic={item.profilePic}
                        file={item.file}
                      />
                    </>
                  );
                  // isMine = false, isPaid = false, name, text, profilePic, time, pic = false
                });
            })()}

            <div className={styles.scrollDummy} ref={chatRef}></div>
          </div>
          {!!currentChat && (
            <div className={styles.chatFieldWrap}>
              {emojiPickerVisible && (
                <div style={{ position: "absolute", bottom: 70 }}>
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => setChatTextValue((prev) => prev + emoji.native)}
                    locale='ru'
                    onClickOutside={() => setEmojiPickerVisible(false)}
                    navPosition='bottom'
                    previewPosition='none'
                    searchPosition='none'
                    skinTonePosition='none'
                    theme='light'
                  />
                </div>
              )}
              <div className={styles.fieldTopBtns}>
                {/* <button className={styles.chatPlusBtn}>+</button> */}
                <span></span>
                <button
                  className={styles.chatScrollToBottomBtn}
                  onClick={() => {
                    setScrollToBottom((prev) => prev + 1);
                    setCalendarMessages([]);
                  }}></button>
              </div>
              <div style={{ width: "100%", backgroundColor: "#d7d8de", height: "100%", paddingTop: "5px" }}>
                <div className={styles.fieldBottomBtns}>
                  <button className={styles.emojiBtn} onClick={() => setEmojiPickerVisible(true)}></button>

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
                        sendMessage({
                          email: email,
                          pseudonym: pseudonym,
                          text: chatTextValue,
                          color: personalColor,
                          profilePic: profilePic,
                          filename,
                          roomId: currentChatId,
                        });
                    }}></button>
                </div>
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
    </LayoutWorker>
  );
}
