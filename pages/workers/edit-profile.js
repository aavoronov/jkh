import React, { useEffect, useState } from "react";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../components/LayoutWorker";
import { toggle } from "../../store/notificationSlice";
import { updateProfile } from "../../store/userSlice";
import styles from "./workers.module.scss";

export default function WorkerProfile(props) {
  const user = useSelector((state) => state.user);
  const { pseudonym, email, phone, color, profilePic, role } = user;
  const router = useRouter();
  const dispatch = useDispatch();

  const [orgName, setOrgName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    if (pseudonym) {
      setOrgName(pseudonym);
    }
  }, [pseudonym]);

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

  const update = async () => {
    try {
      const profileFormData = new FormData();
      profileFormData.append("pseudonym", orgName);
      profileFormData.append("role", role);
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
      !!files.length
        ? typeof files[0] !== "string"
          ? profileFormData.append("file", files[0], filename)
          : profileFormData.append("filename", files[0])
        : null;
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, profileFormData, {
        headers: { Authorization: getCookie("jkh-token"), "Content-Type": "multipart/form-data" },
      });
      dispatch(updateProfile({ pseudonym: orgName, color: res.data.color, profilePic: res.data.profilePic }));
      dispatch(toggle({ text: "Профиль успешно обновлен", type: "success" }));
      setOldPassword("");
      setNewPassword("");
      setPasswordRepeat("");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      // console.log(e);
    }
  };

  const [secure, setSecure] = useState(true);

  return (
    <LayoutWorker title='ЖКХ Консьерж - редактирование профиля' description='description' keywords='keywords'>
      <div className={styles.container + " " + styles.whiteBg}>
        <h1 className={styles.pageHeader}>Рабочий кабинет</h1>
        <div className={styles.editOrgProfile}>
          {/* {profilePic ? (
            <div className={styles.orgProfilePicWrap}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
                className={styles.orgProfilePic}

                //style={{ backgroundImage: `${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}` }}
              />
            </div>
          ) : (
            <span className={styles.orgLetters + " " + styles.large} style={{ backgroundColor: color }}>
              {pseudonym.split(" ").length > 1 ? pseudonym.split(" ")[0][0] + pseudonym.split(" ")[1][0] : pseudonym.slice(0, 2)}
            </span>
          )} */}
          <Dropzone />
          <div className={styles.formWrap}>
            {profilePic ? null : (
              <span className={styles.orgLetters + " " + styles.small} style={{ backgroundColor: color }}>
                {pseudonym.split(" ").length > 1 ? pseudonym.split(" ")[0][0] + pseudonym.split(" ")[1][0] : pseudonym.slice(0, 2)}
              </span>
            )}
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
                }}
              />
            </div>
            <div className={styles.fieldWrap}>
              <label htmlFor='phoneNumber' className={styles.fieldName}>
                Телефон организации
              </label>
              <div className={styles.phoneFieldWrap}>
                <input
                  className={styles.field}
                  value={phone}
                  disabled
                  // onChange={(event) => {
                  //   // setPhone(val);
                  //   setPhone(event.target.value);
                  // }}
                  onClick={() => {
                    // console.log(phone.includes("_"));
                    // console.log(phoneError);
                  }}
                />
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <label htmlFor='email' className={styles.fieldName}>
                E-mail
              </label>
              <input
                name='email'
                type='text'
                placeholder=''
                className={styles.field}
                value={email}
                disabled
                // onChange={(e) => {
                //   setOrgName(e.target.value);
                //   console.log(e.target.value);
                // }}
              />
            </div>
            <span className={styles.sectionHeader}>Сменить пароль</span>

            <div className={styles.fieldWrap + " " + styles.relative}>
              <label htmlFor='oldPassword' className={styles.fieldName}>
                Старый пароль
              </label>
              <input
                name='oldPassword'
                autoComplete='new-password'
                type={secure ? "password" : "text"}
                placeholder=''
                className={styles.field}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
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
              />
            </div>

            <div className={styles.fieldWrap}>
              <label htmlFor='repeatPassword' className={styles.fieldName}>
                Повторите пароль
              </label>
              <input
                name='repeatPassword'
                type={secure ? "password" : "text"}
                placeholder=''
                className={styles.field}
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            </div>

            <div className={styles.fieldWrap}>
              <button
                type='button'
                className={styles.submitBtn + " " + styles.saveBtn}
                onClick={() => {
                  // router.push("/workers");
                  update();
                }}>
                Сохранить
              </button>
              <span
                className={styles.cancelBtn}
                onClick={() => {
                  router.push("/workers");
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
