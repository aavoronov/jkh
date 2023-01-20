import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import { useDropzone } from "react-dropzone";

import LayoutPersonal from "../../components/LayoutPersonal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCookie } from "cookies-next";
import { updateProfile } from "../../store/userSlice";

export default function Profile({}) {
  // const profileData = {
  //   photo: "/img/temp/adProfilePic.png",
  //   nickname: "Александр Константинович",
  // };

  const [files, setFiles] = useState([]);

  const [secure, setSecure] = useState(true);

  const [block1, setBlock1] = useState(true);
  const [block2, setBlock2] = useState(true);
  const [block3, setBlock3] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          headers: { Authorization: getCookie("jkh-token") },
        });

        const updatePseudonym = res.data.pseudonym === null ? "" : res.data.pseudonym;
        console.log(updatePseudonym);
        dispatch(updateProfile({ pseudonym: updatePseudonym, color: res.data.color }));
        console.log(nicknameLocal);
      } catch (e) {
        console.log(e);
      }
    }
    getProfile();
  }, []);

  const pseudonym = useSelector((state) => state.user.pseudonym);
  const email = useSelector((state) => state.user.email);
  const [nicknameLocal, setNicknameLocal] = useState(pseudonym);
  const [emailLocal, setEmailLocal] = useState(pseudonym);
  useEffect(() => {
    setNicknameLocal(pseudonym);
    setEmailLocal(email);
  }, [pseudonym, email]);

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

  return (
    <LayoutPersonal>
      <h1 className={styles.pageHeading + " " + styles.profile}>Мой профиль</h1>
      <div className={styles.personalSection}>
        <span className={styles.sectionHeader}>Личные данные</span>
        <div className={styles.fieldWrap}>
          <label htmlFor='dropzone' className={styles.fieldName}>
            Добавьте аватарку
          </label>
          <Dropzone />
        </div>
        <div className={styles.fieldWrap}>
          <label htmlFor='nickname' className={styles.fieldName}>
            Псевдоним
          </label>
          <input
            name='nickname'
            type='text'
            placeholder=''
            className={styles.field}
            value={nicknameLocal}
            onChange={(e) => {
              // dispatch(updateProfile({ pseudonym: e.target.value }));
              setNicknameLocal(e.target.value);
              // console.log(e.target.value);
            }}
          />
          <span className={styles.headsUp}>Вы можете ввести ФИО или сохранить анонимность, используя псевдоним</span>
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='email' className={styles.fieldName}>
            Email
          </label>
          <input
            name='email'
            type='email'
            placeholder=''
            disabled
            className={styles.field}
            value={email}
            onChange={(e) => {
              // setNickname(e.target.value);
              console.log(e.target.value);
            }}
          />
        </div>

        <span className={styles.sectionHeader}>Сменить пароль</span>

        <label htmlFor='oldPassword' className={styles.fieldName}>
          Старый пароль
        </label>
        <div className={styles.fieldWrap + " " + styles.relative}>
          <input name='oldPassword' type={secure ? "password" : "text"} placeholder='' className={styles.field} />
          <span
            className={secure ? styles.withEyeSecure : styles.withEyeInsecure}
            onClick={() => {
              setSecure(!secure);
            }}></span>
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='newPassword' className={styles.fieldName}>
            Новый пароль
          </label>
          <input name='newPassword' type={secure ? "password" : "text"} placeholder='' className={styles.field} />
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='repeatPassword' className={styles.fieldName}>
            Повторите пароль
          </label>
          <input name='repeatPassword' type={secure ? "password" : "text"} placeholder='' className={styles.field} />
        </div>

        <div className={styles.fieldWrap}>
          <button
            type='button'
            className={styles.submitBtn + " " + styles.saveBtn}
            onClick={async () => {
              const values = { pseudonym: nicknameLocal };
              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
                { pseudonym: nicknameLocal },
                {
                  headers: { Authorization: getCookie("jkh-token") },
                }
              );
              console.log(res.data);
              dispatch(updateProfile({ pseudonym: nicknameLocal }));
            }}>
            Сохранить
          </button>
          <span className={styles.cancelBtn} onClick={() => {}}>
            Отменить
          </span>
        </div>

        <span className={styles.sectionHeader}>Сменить email</span>

        {/* <label htmlFor='oldEmail' className={styles.fieldName}>
          Текущий email
        </label>
        <div className={styles.fieldWrap + " " + styles.relative}>
          <input name='oldEmail' type='text' placeholder='' className={styles.field} />
        </div> */}

        <div className={styles.fieldWrap}>
          <label htmlFor='newEmail' className={styles.fieldName}>
            Новый email
          </label>
          <input name='newEmail' type='text' placeholder='' className={styles.field} />
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='newEmail' className={styles.fieldName}>
            Введите пароль от учетной записи
          </label>
          <input name='newEmail' type='text' placeholder='' className={styles.field} />
        </div>

        <div className={styles.fieldWrap}>
          <button type='button' className={styles.submitBtn + " " + styles.saveBtn}>
            Сохранить
          </button>
          <span className={styles.cancelBtn} onClick={() => {}}>
            Отменить
          </span>
        </div>
      </div>

      <div className={styles.personalSection}>
        <span className={styles.sectionHeader}>Мои адреса</span>
        {block1 && (
          <div className={styles.object}>
            <div className={styles.iconWrap}>
              <Image src='/img/objectIcon.png' alt='' width={42} height={42} />
            </div>
            <div className={styles.objName}>
              <span className={styles.objectTitle}>2-комнатная квартира</span>
              <span className={styles.objectAddress}>Москва, ул. Иванова, д. 97</span>
            </div>
            <div className={styles.myServicesBtnsWrap}>
              <Link href='/personal/edit-object'>
                <button className={styles.myServicesBtn + " " + styles.pencil}></button>
              </Link>
              <button
                className={styles.myServicesBtn + " " + styles.trash}
                onClick={() => {
                  confirm("Вы уверены, что хотите навсегда удалить этот объект?") && setBlock1(false);
                }}></button>
            </div>
          </div>
        )}
        {block2 && (
          <div className={styles.object}>
            <div className={styles.iconWrap}>
              <Image src='/img/objectIcon.png' alt='' width={42} height={42} />
            </div>
            <div className={styles.objName}>
              <span className={styles.objectTitle}>2-комнатная квартира</span>
              <span className={styles.objectAddress}>Москва, ул. Иванова, д. 97</span>
            </div>
            <div className={styles.myServicesBtnsWrap}>
              <Link href='/personal/edit-object'>
                <button className={styles.myServicesBtn + " " + styles.pencil}></button>
              </Link>
              <button
                className={styles.myServicesBtn + " " + styles.trash}
                onClick={() => {
                  confirm("Вы уверены, что хотите навсегда удалить этот объект?") && setBlock2(false);
                }}></button>
            </div>
          </div>
        )}

        {block3 && (
          <div className={styles.object}>
            <div className={styles.iconWrap}>
              <Image src='/img/objectIcon.png' alt='' width={42} height={42} />
            </div>
            <div className={styles.objName}>
              <span className={styles.objectTitle}>2-комнатная квартира</span>
              <span className={styles.objectAddress}>Москва, ул. Иванова, д. 97</span>
            </div>
            <div className={styles.myServicesBtnsWrap}>
              <Link href='/personal/edit-object'>
                <button className={styles.myServicesBtn + " " + styles.pencil}></button>
              </Link>
              <button
                className={styles.myServicesBtn + " " + styles.trash}
                onClick={() => {
                  confirm("Вы уверены, что хотите навсегда удалить этот объект?") && setBlock3(false);
                }}></button>
            </div>
          </div>
        )}

        <Link href='/personal/create-object'>
          <button type='button' className={styles.submitBtn}>
            Добавить адрес
          </button>
        </Link>
      </div>

      <div className={styles.personalSection}>
        <span
          className={styles.deleteProfileBtn}
          onClick={() => {
            confirm("Удалить профиль? Это действие необратимо.");
          }}>
          Удалить профиль
        </span>
      </div>
    </LayoutPersonal>
  );
}
