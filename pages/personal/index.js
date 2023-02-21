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
import { getCookie, setCookie } from "cookies-next";
import { updateProfile, updateRole } from "../../store/userSlice";
import { toggle } from "../../store/notificationSlice";
import { useRouter } from "next/router";

export default function Profile({}) {
  // const profileData = {
  //   photo: "/img/temp/adProfilePic.png",
  //   nickname: "Александр Константинович",
  // };

  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");

  const [secure, setSecure] = useState(true);

  const [block1, setBlock1] = useState(true);
  const [block2, setBlock2] = useState(true);
  const [block3, setBlock3] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [emailChange, setEmailChange] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [objects, setObjects] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res);

        const updatePseudonym = res.data.pseudonym === null ? "" : res.data.pseudonym;
        const updateProfilePic = res.data.profilePic === null ? "" : res.data.profilePic;
        console.log(updatePseudonym);
        dispatch(updateProfile({ pseudonym: updatePseudonym, color: res.data.color, profilePic: updateProfilePic }));
        console.log(nicknameLocal);
      } catch (e) {
        console.log(e);
      }
    }
    getProfile();
  }, []);

  useEffect(() => {
    async function getObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res);
        setObjects(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getObjects();
  }, []);

  const deleteObject = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects/${id}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      console.log(res.data);
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Объект успешно удален", type: "success" }));
      const newObjects = objects.filter((item) => item.id !== id);
      setObjects(newObjects);
    } catch (e) {
      console.log(e);
    }
  };

  const pseudonym = useSelector((state) => state.user.pseudonym);
  const email = useSelector((state) => state.user.email);
  const profilePic = useSelector((state) => state.user.profilePic);
  const [nicknameLocal, setNicknameLocal] = useState(pseudonym);
  const [emailLocal, setEmailLocal] = useState(pseudonym);
  useEffect(() => {
    setNicknameLocal(pseudonym);
    setEmailLocal(email);
  }, [pseudonym, email]);

  useEffect(() => {
    if (!!profilePic) {
      setFiles([profilePic]);
    }
  }, [profilePic]);

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
            // src={file.preview}
            src={file?.preview ?? `${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
            className={styles.img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              // URL.revokeObjectURL(file.preview);
            }}
          />
          <button
            className={styles.imageRemove}
            onClick={() => {
              removeFile(file);
            }}></button>
          {/* <span className={styles.fileName}>{file.name}</span> */}
        </div>
      </div>
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      // return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
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

  const update = async () => {
    try {
      const profileFormData = new FormData();
      profileFormData.append("pseudonym", nicknameLocal);
      if (!!oldPassword || !!newPassword || !!passwordRepeat) {
        if (!oldPassword || !newPassword || !passwordRepeat) {
          throw new Error("Для смены пароля заполните поля Старый пароль, Новый пароль и Повторите пароль или оставьте их пустыми");
        }
        if (newPassword !== passwordRepeat) {
          throw new Error("Новый пароль и подтверждение пароля не совпадают");
        }
        profileFormData.append("oldPassword", oldPassword);
        profileFormData.append("newPassword", newPassword);
      }
      !!files.length && typeof files[0] !== "string" && profileFormData.append("file", files[0], filename);
      console.log(profileFormData);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, profileFormData, {
        headers: { Authorization: getCookie("jkh-token"), "Content-Type": !files.length ? "application/json" : "multipart/form-data" },
      });
      console.log(res.data);
      dispatch(updateProfile({ pseudonym: nicknameLocal, color: res.data.color, profilePic: res.data.profilePic }));
      dispatch(toggle({ text: "Профиль успешно обновлен", type: "success" }));
      setOldPassword("");
      setNewPassword("");
      setPasswordRepeat("");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      // console.log(e);
    }
  };

  const changeEmail = async () => {
    try {
      if (!emailPassword || !emailChange) {
        throw new Error("Для смены почты заполните поля новой почты и пароля");
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateEmail`,
        { email: emailChange, password: emailPassword },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      console.log(res.data);
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Адрес электронной почты успешно обновлен. Проверьте почту", type: "success" }));
      dispatch(updateRole(""));
      router.replace("/");
      setCookie("jkh-token", "");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      console.log(e);
    }
  };

  const deleteProfile = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/delete/${email}`,
        { email: email },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      console.log(res.data);
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Ваш аккаунт успешно удален", type: "success" }));
      dispatch(updateRole(""));
      router.replace("/");
      setCookie("jkh-token", "");
    } catch (e) {
      console.log(e);
    }
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
          <input
            name='oldPassword'
            type={secure ? "password" : "text"}
            placeholder=''
            className={styles.field}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete='new-password'
          />
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
          <input
            name='newPassword'
            type={secure ? "password" : "text"}
            placeholder=''
            className={styles.field}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete='new-password'
          />
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='passwordRepeat' className={styles.fieldName}>
            Повторите пароль
          </label>
          <input
            name='passwordRepeat'
            type={secure ? "password" : "text"}
            placeholder=''
            className={styles.field}
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            autoComplete='new-password'
          />
        </div>

        <div className={styles.fieldWrap}>
          <button type='button' className={styles.submitBtn + " " + styles.saveBtn} onClick={update}>
            Сохранить
          </button>
          <span
            className={styles.cancelBtn}
            onClick={() => {
              setNicknameLocal(pseudonym);
              setOldPassword("");
              setNewPassword("");
              setPasswordRepeat("");
            }}>
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
          <input
            name='newEmail'
            type='text'
            placeholder=''
            className={styles.field}
            value={emailChange}
            onChange={(e) => setEmailChange(e.target.value)}
          />
        </div>

        <div className={styles.fieldWrap}>
          <label htmlFor='newEmail' className={styles.fieldName}>
            Введите пароль от учетной записи
          </label>
          <input
            name='newEmail'
            type='password'
            placeholder=''
            className={styles.field}
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
          />
          <span className={styles.headsUp}>
            Внимание: новую почту необходимо будет подтвердить. Вы будете разлогинены из системы до подтверждения новой почты.
          </span>
        </div>

        <div className={styles.fieldWrap}>
          <button type='button' className={styles.submitBtn + " " + styles.saveBtn} onClick={changeEmail}>
            Сохранить
          </button>
          <span
            className={styles.cancelBtn}
            onClick={() => {
              setEmailChange("");
              setEmailPassword("");
            }}>
            Отменить
          </span>
        </div>
      </div>

      <div className={styles.personalSection}>
        <span className={styles.sectionHeader}>Мои адреса</span>
        {!!objects?.length &&
          objects.map((item, index) => {
            const addressArray = item.estateObject.address.split(", ");

            console.log(item.estateObject);
            return (
              <div className={styles.object}>
                <div className={styles.iconWrap}>
                  <Image src='/img/objectIcon.png' alt='' width={42} height={42} />
                </div>
                <div className={styles.objName}>
                  <span className={styles.objectTitle}>
                    {addressArray.at(-2) + " " + addressArray.at(-1) + ", " + item.estateObject.apartment}
                  </span>
                  <span className={styles.objectAddress}>{addressArray.slice(0, addressArray.length - 2).join(", ")}</span>
                </div>
                <div className={styles.myServicesBtnsWrap}>
                  <Link href={{ pathname: "/personal/edit-object/[id]", query: { id: item.id } }}>
                    <button className={styles.myServicesBtn + " " + styles.pencil}></button>
                  </Link>
                  <button
                    className={styles.myServicesBtn + " " + styles.trash}
                    onClick={() => {
                      confirm("Вы уверены, что хотите навсегда удалить этот объект? Вы также покинете домовой чат объекта.") &&
                        deleteObject(item.id);
                    }}></button>
                </div>
              </div>
            );
          })}

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
            confirm("Удалить профиль? Это действие необратимо.") && deleteProfile();
          }}>
          Удалить профиль
        </span>
      </div>
    </LayoutPersonal>
  );
}
