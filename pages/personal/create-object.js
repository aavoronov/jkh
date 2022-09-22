import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import { useDropzone } from "react-dropzone";

import LayoutPersonal from "../../components/LayoutPersonal";

export default function Profile({}) {
  const profileData = {
    photo: "/img/temp/adProfilePic.png",
    nickname: "Александр Константинович",
  };

  const [files, setFiles] = useState([]);
  const [nickname, setNickname] = useState(profileData.nickname);
  const [address, setAddress] = useState("Москва, ул. Лермонтова");
  const [email, setEmail] = useState("");
  const [isOwner, setIsOwner] = useState(true);

  const [secure, setSecure] = useState(true);

  const [block1, setBlock1] = useState(true);
  const [block2, setBlock2] = useState(true);
  const [block3, setBlock3] = useState(true);

  const router = useRouter();

  // useEffect(() => {
  //   profileData.photo && setFiles(profileData.photo);
  // }, []);

  return (
    <LayoutPersonal>
      <h1 className={styles.pageHeading + " " + styles.profile}>Добавление нового адреса</h1>
      <div className={styles.personalSection}>
        <div className={styles.fieldWrap}>
          <label htmlFor='address' className={styles.fieldName}>
            Адрес объекта
          </label>
          <input
            name='address'
            type='text'
            placeholder=''
            className={styles.field}
            value={address}
            // onChange={(e) => {
            //   setNickname(e.target.value);
            //   console.log(e.target.value);
            // }}
          />
        </div>

        <div className={styles.fieldWrap + " " + styles.twoSmallFields}>
          <div className={styles.smallField}>
            <label htmlFor='email' className={styles.fieldName}>
              Номер дома, строения
            </label>
            <input
              name='email'
              type='email'
              placeholder=''
              className={styles.field}
              // value={email}
              // onChange={(e) => {
              //   setNickname(e.target.value);
              //   console.log(e.target.value);
              // }}
            />
          </div>
          <div className={styles.smallField}>
            <label htmlFor='email' className={styles.fieldName}>
              Номер квартиры
            </label>
            <input
              name='email'
              type='email'
              placeholder=''
              className={styles.field}
              // value={email}
              // onChange={(e) => {
              //   setNickname(e.target.value);
              //   console.log(e.target.value);
              // }}
            />
          </div>
        </div>

        {/* <label htmlFor='nickname' className={styles.fieldName}>
          Повторите пароль
        </label>
        <div className={styles.fieldWrap + " " + styles.relative}>
          <input name='password' type={secure ? "password" : "text"} placeholder='' className={styles.field} />
          <span
            className={secure ? styles.withEyeSecure : styles.withEyeInsecure}
            onClick={() => {
              setSecure(!secure);
            }}></span>
        </div> */}

        <div className={styles.fieldWrap}>
          <label htmlFor='address' className={styles.fieldName}>
            Лицевой счет
          </label>
          <input
            name='address'
            type='text'
            placeholder=''
            className={styles.field}
            // value={address}
            // onChange={(e) => {
            //   setNickname(e.target.value);
            //   console.log(e.target.value);
            // }}
          />
        </div>
        <div className={styles.fieldWrap}>
          <div className={styles.form_radio} onClick={() => setIsOwner(true)}>
            <input id='isOwner-1' className={styles.radio} type='radio' name='isOwner' value='Личные вещи' checked={isOwner} />
            <label htmlFor='category-1'>Я собственник</label>
          </div>

          <div className={styles.form_radio} onClick={() => setIsOwner(false)}>
            <input id='isOwner-2' className={styles.radio} type='radio' name='isOwner' value='Транспорт' checked={!isOwner} />
            <label htmlFor='category-2'>В аренде</label>
          </div>
        </div>

        <div className={styles.editObjectBtnsWrap}>
          <span className={styles.text}>Добавить аккаунт арендатора</span>
          {/* <span className={styles.text + " " + styles.border}>Написать администратору</span> */}
          <span></span>

          <button
            type='button'
            className={styles.text + " " + styles.solid}
            onClick={() => {
              router.push("/personal");
            }}>
            Сохранить
          </button>
          <span
            className={styles.text + " " + styles.border}
            onClick={() => {
              confirm("Отменить создание объекта? Данные не будут сохранены") && router.push("/personal");
            }}>
            Отменить
          </span>
        </div>
      </div>
    </LayoutPersonal>
  );
}
