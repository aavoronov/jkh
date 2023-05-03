import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import * as Yup from "yup";

import { useDropzone } from "react-dropzone";
// import DropdownList from "../components/DropdownList";

import styles from "./add-chat.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../../components/useWindowDimensionsSSR";
import { toggle } from "../../../store/notificationSlice";

import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";

import LayoutWorker from "../../../components/LayoutWorker";

export default function AddChat() {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);

  const [activeObject, setActiveObject] = useState("");
  const [activeObjectId, setActiveObjectId] = useState("");
  const [notify, setNotify] = useState(true);
  const [chatList, setChatList] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    async function getChats() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      if (!!res.data.length) {
        setChatList(res.data);
        setActiveObject(res.data[0].address);
        setActiveObjectId(res.data[0].id);
      } else {
        setChatList("empty");
      }
    }
    getChats();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  const DropdownList = ({ objects, value, setValue }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <div className={styles.dropdownWrap}>
        <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className={styles.dropdownField}>{value}</span>
          <span className={styles.dropdownBtn}></span>
        </div>
        {dropdownOpen ? (
          <ul className={styles.dropdownList}>
            {objects.map((item, index) => (
              <li
                key={item.id}
                className={styles.dropdownListItem}
                onClick={() => {
                  setValue(item.address);
                  setActiveObjectId(item.id);
                  setDropdownOpen(false);
                }}>
                {item.address}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  const [files, setFiles] = useState([]);
  const Dropzone = () => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        "image/*": [],
      },
      onDrop: (acceptedFiles) => {
        setFiles(
          files
            .concat(
              acceptedFiles.map((file) =>
                Object.assign(file, {
                  preview: URL.createObjectURL(file),
                })
              )
            )
            .slice(0, 10)
        );
        setIsDraggedOver(false);
      },
      onDragOver: () => {
        setIsDraggedOver(true);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      maxFiles: 1,
      maxSize: 3000000,
      multiple: true,
    });
    // const { getRootProps, getInputProps } = useDropzone({ maxFiles: 10, maxSize: 3000000, multiple: true, onDrop });

    const removeFile = (file) => {
      const newFiles = [...files];
      newFiles.splice(newFiles.indexOf(file), 1);
      setFiles(newFiles);
    };

    const removeAll = () => {
      setFiles([]);
    };

    const thumbs = files.map((file) => (
      <div
        className={styles.thumb}
        // key={file.name}
        key={Math.random().toString()}>
        <div className={styles.thumbInner}>
          <img
            src={file.preview}
            className={styles.img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
          <button
            className={styles.imageRemove}
            onClick={() => {
              removeFile(file);
            }}></button>
          <span className={styles.fileName}>{file.name}</span>
        </div>
      </div>
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    return (
      <section className={styles.dragndropWrap}>
        {!files.length ? (
          <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
            <input {...getInputProps()} />
            {/* <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
          <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p> */}
          </div>
        ) : null}
        {files.length ? <aside className={styles.thumbsContainer}>{thumbs}</aside> : null}
      </section>
    );
  };

  const email = useSelector((state) => state.user.email);

  async function chatRoomSignUp() {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/sign-up`,
        { email: email, chat: activeObjectId },
        { headers: { Authorization: getCookie("jkh-token") } }
      );
      dispatch(toggle({ text: "Регистрация прошла успешно", type: "success" }));
    } catch (e) {
      console.log(e.response.data.message);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  }

  return (
    <LayoutWorker>
      <div className={styles.container}>
        <div className={styles.entireThingWrap}>
          <h1 className={styles.pageHeader}>Регистрация в чате</h1>

          <Formik
            initialValues={{
              nickname: "",
            }}
            validationSchema={Yup.object({
              nickname: Yup.string().min(5, "Не короче пяти символов").required("Обязательное поле"),
            })}
            onSubmit={(values) => {
              values.object = activeObject;
              values.profilePic = files;
              values.notify = notify;
              // values.files = files;
              // values.sendToModerator = sendToModerator;
              // alert(JSON.stringify(values, null, 2));
              router.push("/chat");
            }}>
            <Form className={styles.formWrap}>
              {chatList !== "empty" ? (
                <>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='category' className={styles.fieldName}>
                      Выберите адрес объекта
                    </label>
                    <DropdownList objects={chatList} value={activeObject} setValue={setActiveObject} />
                  </div>

                  <div className={styles.fieldWrap}>
                    {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
                    <label htmlFor='notify' className={styles.fieldName + " " + styles.checkboxWrap}>
                      <div
                        name='notify'
                        id='notify'
                        type='checkbox'
                        onClick={() => {
                          setNotify(!notify);
                        }}
                        className={notify ? styles.checkbox + " " + styles.checked : styles.checkbox}></div>
                      <span>Показывать уведомления</span>
                    </label>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
                  Нет доступных чатов. Зарегистрируйте объект недвижимости в Личном кабинете.
                </div>
              )}

              <div className={styles.fieldWrap}>
                {chatList !== "empty" && (
                  <button type='submit' className={styles.submitBtn} onClick={() => chatRoomSignUp()}>
                    Зарегистрироваться
                  </button>
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => {
                    router.push("/workers/chat");
                  }}>
                  Отменить
                </span>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </LayoutWorker>
  );
}
