import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import LayoutWorker from "../../../components/LayoutWorker";
import styles from "../workers-newad.module.scss";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toggle } from "../../../store/notificationSlice";

const displayZones = ["Москва и МО", "Ленинград и ЛО", "Свердловск и СО"];

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
              key={index}
              className={styles.dropdownListItem}
              onClick={() => {
                setValue(item);
                setDropdownOpen(false);
              }}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default function CreateChatAd(props) {
  const router = useRouter();
  const profileData = {
    // photo: "/img/temp/adProfilePic.png",
    orgName: "Компания Бизнес Альянс Компани",
  };
  const [orgName, setOrgName] = useState("");
  const [displayZone, setDisplayZone] = useState(displayZones[0]);
  const [files, setFiles] = useState([]);
  const [radius, setRadius] = useState(null);
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState([]);
  const [link, setLink] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    async function getChatsInRadius() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/ad-prices`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res.data);
        setPrices(res.data);
      } catch (e) {
        console.log(e);
      }
      // ...
      // return null;
    }
    getChatsInRadius();
  }, []);

  const g_orgName = useSelector((state) => state.user.pseudonym);
  const g_address = useSelector((state) => state.user.address);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!g_orgName) {
      setOrgName(g_orgName);
    }
  }, [g_orgName]);

  const createChatAd = async () => {
    try {
      if (!files.length) {
        throw new Error("Прикрепите изображение");
      }
      if (!description) {
        throw new Error("Заполните поле текста объявления");
      }
      if (!link) {
        throw new Error("Заполните поле ссылки");
      }
      if (!hours) {
        throw new Error("Заполните поле часов публикации");
      }
      if (!minutes) {
        throw new Error("Заполните поле минут публикации");
      }

      if (hours > 23 || minutes > 59) {
        throw new Error("Некорректный формат времени публикации");
      }

      const pricesItem = prices.find((item) => item.radius === radius);
      console.log(pricesItem);
      const data = new FormData();
      // data.append('name', name)
      // data.append("name", pseudonym);
      data.append("image", files[0]);
      data.append("description", description);
      data.append("link", link);
      data.append("hours", hours);
      data.append("minutes", minutes);
      data.append("radius", pricesItem.radius);
      data.append("chats", pricesItem.ids);
      data.append("price", pricesItem.price);

      console.log(data);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat-ads`, data, {
        // "Content-Type": "multipart/form-data",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      dispatch(toggle({ text: "Объявление отправлено на модерацию", type: "success" }));
      router.push("/workers/ads");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
    }
  };
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
      console.log(files);
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

    // return (
    //   <div {...getRootProps()} className={styles.dragndropWrap}>
    //     <div className={styles.dragndropField}>
    //       <input {...getInputProps()} />
    //       <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
    //       <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p>
    //     </div>
    //   </div>
    // );

    return (
      <>
        <div className={styles.dragndropWrap}>
          {!files.length ? (
            <div
              {...getRootProps({
                className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField,
              })}>
              <input {...getInputProps()} />
              <span className={styles.dragndropPlaceholder}>Разместить изображение</span>
              {/* <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
        <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p> */}
            </div>
          ) : null}
        </div>
        {files.length ? <aside className={styles.thumbsContainer}>{thumbs}</aside> : null}
      </>
    );
  };

  return (
    <LayoutWorker>
      <div className={styles.container + " " + styles.whiteBg}>
        <h1 className={styles.pageHeader}>Размещение рекламного объявления</h1>
        <div className={styles.editOrgProfile}>
          <div className={styles.formWrap}>
            <div className={styles.fieldWrap}>
              <label htmlFor='orgName' className={styles.fieldName}>
                Организация
              </label>
              <input disabled name='orgName' type='text' placeholder='' className={styles.field} value={orgName} />
            </div>
            <div className={styles.fieldWrap}>
              <label htmlFor='orgName' className={styles.fieldName}>
                Адрес
              </label>
              <input disabled name='orgName' type='text' placeholder='' className={styles.field} value={g_address} />
            </div>

            <div className={styles.fieldWrap}>
              <Dropzone />
            </div>

            <div className={styles.fieldWrap}>
              <label htmlFor='description' className={styles.fieldName}>
                Текст рекламного объявления
              </label>
              <textarea
                name='description'
                rows={10}
                resize='none'
                type='text'
                placeholder='Введите текст'
                className={styles.field + " " + styles.textarea}
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className={styles.warningWrap}>
                {/* <span className={styles.errorText}>
                  <ErrorMessage name='description' />
                </span> */}
                <span></span>
                <span className={styles.warning}>Не более 1000 символов</span>
              </div>
            </div>

            <div className={styles.fieldWrap}>
              <label htmlFor='link' className={styles.fieldName}>
                Укажите ссылку на ваш сайт
              </label>
              <input
                name='link'
                type='text'
                placeholder=''
                className={styles.field}
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </div>

            <span className={styles.sectionHeader}>Условия размещения</span>

            {/* <div className={styles.fieldWrap}>
              <label htmlFor='orgName' className={styles.fieldName}>
                Где показывать
              </label>
              <DropdownList objects={displayZones} value={displayZone} setValue={setDisplayZone} />
            </div> */}

            <div className={styles.fieldWrap + " " + styles.twoSmallFields}>
              <div className={styles.smallField}>
                <label htmlFor='hours' className={styles.fieldName}>
                  Время публикации (по Москве)
                </label>
                <input
                  name='hours'
                  type='hours'
                  placeholder='Часы'
                  className={styles.field}
                  value={hours}
                  onChange={(e) => {
                    const reg = /^\d+$/;
                    if ((e.target.value === "" || reg.test(e.target.value)) && e.target.value.length <= 2) {
                      setHours(e.target.value);
                    }
                  }}
                />
              </div>
              <div className={styles.smallField}>
                <label htmlFor='minutes' className={styles.fieldName}></label>
                <input
                  name='minutes'
                  type='minutes'
                  placeholder='Минуты'
                  className={styles.field}
                  value={minutes}
                  onChange={(e) => {
                    const reg = /^\d+$/;
                    if ((e.target.value === "" || reg.test(e.target.value)) && e.target.value.length <= 2) {
                      setMinutes(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <label htmlFor='hours' className={styles.fieldName}>
                Будет округлено до ближайшей следующей пятой минуты.
              </label>
            </div>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Радиус показа</span>

              {!!prices.length &&
                prices.map((item, index) => (
                  <div
                    style={item.price === 0 ? { opacity: 0.5, pointerEvents: "none" } : { opacity: 1 }}
                    className={styles.form_radio}
                    onClick={() => {
                      // setPromotionSecondary("Выделить лейблом VIP");
                      // setPromotionSecondaryPrice(500);
                      setRadius(item.radius);
                    }}>
                    <input
                      id={`radius-${index}`}
                      className={styles.radio}
                      type='radio'
                      name='radius'
                      value={radius}
                      disabled={item.price === 0}
                      checked={item.radius === radius}
                    />
                    <label htmlFor={`radius-${index}`} onClick={() => console.log(radius)}>
                      {item.radius / 1000} км ({item.chats} чатов, {item.users} пользователей)
                    </label>
                    <span className={styles.price}>{item.price} ₽</span>
                  </div>
                ))}
            </div>

            <div className={styles.fieldWrap}>
              <button
                type='button'
                className={styles.submitBtn + " " + styles.saveBtn}
                style={!radius ? { opacity: 0.5, pointerEvents: "none" } : { opacity: 1 }}
                onClick={() => {
                  createChatAd();
                  // router.push("/workers/ads");
                }}>
                Отправить на модерацию
              </button>
              <span
                className={styles.cancelBtn}
                onClick={() => {
                  confirm("Отменить создание объявления? Данные будут утеряны.") && router.push("/workers/ads");
                }}>
                Отменить
              </span>
            </div>
          </div>
        </div>
      </div>
    </LayoutWorker>
  );
}
