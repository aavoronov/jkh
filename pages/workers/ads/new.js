import React, { useState, useEffect } from "react";

import LayoutLoggedIn from "../../../components/LayoutLoggedIn";
import EstateObject from "../../../components/EstateObject";

import { objectsData } from "../../../components/data";

import LayoutWorker from "../../../components/LayoutWorker";
import styles from "../workers.module.scss";
import InputMask from "react-input-mask";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";

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

export default function WorkerProfile(props) {
  const router = useRouter();
  const profileData = {
    // photo: "/img/temp/adProfilePic.png",
    orgName: "Компания Бизнес Альянс Компани",
  };
  const [orgName, setOrgName] = useState(profileData.orgName);
  const [displayZone, setDisplayZone] = useState(displayZones[0]);
  const [files, setFiles] = useState([]);
  const [radius, setRadius] = useState(null);

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
            <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
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
              <input
                name='orgName'
                type='text'
                placeholder=''
                className={styles.field}
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  console.log(e.target.value);
                }}
              />
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
                maxLength={1000}
                rows={10}
                resize='none'
                type='text'
                placeholder='Введите текст'
                className={styles.field + " " + styles.textarea}
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
              <label htmlFor='orgName' className={styles.fieldName}>
                Укажите ссылку на ваш сайт
              </label>
              <input
                name='orgName'
                type='text'
                placeholder=''
                className={styles.field}
                // value={orgName}
                // onChange={(e) => {
                //   setOrgName(e.target.value);
                //   console.log(e.target.value);
                // }}
              />
            </div>

            <span className={styles.sectionHeader}>Условия размещения</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='orgName' className={styles.fieldName}>
                Где показывать
              </label>
              <DropdownList objects={displayZones} value={displayZone} setValue={setDisplayZone} />
            </div>

            <div className={styles.fieldWrap + " " + styles.twoSmallFields}>
              <div className={styles.smallField}>
                <label htmlFor='email' className={styles.fieldName}>
                  Время публикации
                </label>
                <input
                  name='email'
                  type='email'
                  placeholder='Часы'
                  className={styles.field}
                  // value={email}
                  // onChange={(e) => {
                  //   setNickname(e.target.value);
                  //   console.log(e.target.value);
                  // }}
                />
              </div>
              <div className={styles.smallField}>
                <label htmlFor='email' className={styles.fieldName}></label>
                <input
                  name='email'
                  type='email'
                  placeholder='Минуты'
                  className={styles.field}
                  // value={email}
                  // onChange={(e) => {
                  //   setNickname(e.target.value);
                  //   console.log(e.target.value);
                  // }}
                />
              </div>
            </div>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Радиус показа</span>

              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Выделить лейблом VIP");
                  // setPromotionSecondaryPrice(500);
                  setRadius("10 км (15 чатов)");
                }}>
                <input
                  id='radius-1'
                  className={styles.radio}
                  type='radio'
                  name='radius'
                  value='10 км (15 чатов)'
                  // checked={promoSecondary.type == "Выделить лейблом VIP"}
                />
                <label htmlFor='radius-1'>10 км (15 чатов)</label> <span className={styles.price}>1500 ₽</span>
              </div>
              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Выделить лейблом VIP");
                  // setPromotionSecondaryPrice(500);
                  setRadius("15 км (25 чатов)");
                }}>
                <input
                  id='radius-2'
                  className={styles.radio}
                  type='radio'
                  name='radius'
                  value='15 км (25 чатов)'
                  // checked={promoSecondary.type == "Выделить лейблом VIP"}
                />
                <label htmlFor='radius-2'>15 км (25 чатов)</label> <span className={styles.price}>2500 ₽</span>
              </div>
              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Выделить лейблом VIP");
                  // setPromotionSecondaryPrice(500);
                  setRadius("20 км (37 чатов)");
                }}>
                <input
                  id='radius-3'
                  className={styles.radio}
                  type='radio'
                  name='radius'
                  value='20 км (37 чатов)'
                  // checked={promoSecondary.type == "Выделить лейблом VIP"}
                />
                <label htmlFor='radius-3'>20 км (37 чатов)</label> <span className={styles.price}>3500 ₽</span>
              </div>
              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Выделить лейблом VIP");
                  // setPromotionSecondaryPrice(500);
                  setRadius("50 км (100 чатов)");
                }}>
                <input
                  id='radius-4'
                  className={styles.radio}
                  type='radio'
                  name='radius'
                  value='50 км (100 чатов)'
                  // checked={promoSecondary.type == "Выделить лейблом VIP"}
                />
                <label htmlFor='radius-4'>50 км (100 чатов)</label> <span className={styles.price}>5000 ₽</span>
              </div>
            </div>

            <div className={styles.fieldWrap}>
              <button
                type='button'
                className={styles.submitBtn + " " + styles.saveBtn}
                onClick={() => {
                  router.push("/workers/ads");
                }}>
                Оплатить
              </button>
              <span
                className={styles.cancelBtn}
                onClick={() => {
                  router.push("/workers/ads");
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
