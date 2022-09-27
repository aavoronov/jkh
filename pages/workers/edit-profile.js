import React, { useState } from "react";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import EstateObject from "../../components/EstateObject";

import { objectsData } from "../../components/data";

import LayoutWorker from "../../components/LayoutWorker";
import styles from "./workers.module.scss";
import InputMask from "react-input-mask";
import { useRouter } from "next/router";

export default function WorkerProfile(props) {
  const router = useRouter();
  const profileData = {
    // photo: "/img/temp/adProfilePic.png",
    orgName: "Компания Бизнес Альянс Компани",
  };
  const [orgName, setOrgName] = useState(profileData.orgName);

  const [secure, setSecure] = useState(true);
  return (
    <LayoutWorker>
      <div className={styles.container + " " + styles.whiteBg}>
        <h1 className={styles.pageHeader}>Рабочий кабинет</h1>
        <div className={styles.editOrgProfile}>
          <span className={styles.orgLetters + " " + styles.large}>УК</span>
          <div className={styles.formWrap}>
            <span className={styles.orgLetters + " " + styles.small}>УК</span>
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
              <label htmlFor='phoneNumber' className={styles.fieldName}>
                Телефон организации
              </label>
              <div className={styles.phoneFieldWrap}>
                <InputMask
                  className={styles.field}
                  mask='+7 (999) 999-99-99'
                  // value={phone}
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
                // value={orgName}
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
                onClick={() => {
                  router.push("/workers");
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
