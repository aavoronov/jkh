import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./personal-sections.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import LayoutPersonal from "../../components/LayoutPersonal";
import { toggle } from "../../store/notificationSlice";

export default function Profile({}) {
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user.email);

  async function getGeocode() {
    const res = await axios.get(
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.NEXT_PUBLIC_YMAPS_KEY}&geocode=${address + " " + house}`
    );
    //  const {data.response.GeoObjectCollection} = res
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text);
    const fullAddress = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
    const coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    const precision = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.precision;
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted);
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point);
    const longitude = coords.split(" ")[0];
    const latitude = coords.split(" ")[1];

    return { address: fullAddress, latitude, longitude, precision };
  }

  const createEstateObject = async () => {
    try {
      const { address, latitude, longitude, precision } = await getGeocode();
      console.log(address, precision);
      if (precision !== "exact") {
        throw new Error("Введенный адрес не найден. Проверьте правильность введенного адреса");
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/estate-objects`,
        { email, address, latitude, longitude, apartment: apartment, account: account, isOwner: isOwner },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      console.log(res.data);
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Объект успешно зарегистрирован", type: "success" }));
      // dispatch(updateRole(""));
      router.replace("/personal");
      // setCookie("jkh-token", "");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      console.log(e);
    }
  };

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
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>

        <div className={styles.fieldWrap + " " + styles.twoSmallFields}>
          <div className={styles.smallField}>
            <label htmlFor='house' className={styles.fieldName}>
              Номер дома, строения
            </label>
            <input
              name='house'
              type='house'
              placeholder=''
              className={styles.field}
              value={house}
              onChange={(e) => {
                setHouse(e.target.value);
              }}
            />
          </div>
          <div className={styles.smallField}>
            <label htmlFor='apartment' className={styles.fieldName}>
              Номер квартиры
            </label>
            <input
              name='apartment'
              type='apartment'
              placeholder=''
              className={styles.field}
              value={apartment}
              onChange={(e) => {
                setApartment(e.target.value);
              }}
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
          <label htmlFor='account' className={styles.fieldName}>
            Лицевой счет
          </label>
          <input
            name='account'
            type='text'
            placeholder=''
            className={styles.field}
            value={account}
            onChange={(e) => {
              const re = /^[0-9\b]+$/;
              if (e.target.value === "" || re.test(e.target.value)) {
                setAccount(e.target.value);
              }
            }}
            // setAccount(e.target.value);
          />
        </div>
        <div className={styles.fieldWrap}>
          <div className={styles.form_radio} onClick={() => setIsOwner(true)}>
            <input
              id='isOwner-1'
              className={styles.radio}
              type='radio'
              name='isOwner'
              value='Я собственник'
              checked={isOwner}
              onChange={() => setIsOwner(true)}
            />
            <label htmlFor='category-1'>Я собственник</label>
          </div>

          <div className={styles.form_radio} onClick={() => setIsOwner(false)}>
            <input
              id='isOwner-2'
              className={styles.radio}
              type='radio'
              name='isOwner'
              value='В аренде'
              checked={!isOwner}
              onChange={() => setIsOwner(false)}
            />
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
              // router.push("/personal");
              // console.log(JSON.stringify({ address: address, house: house, apartment: apartment, account: account, isOwner: isOwner }));
              // mapRef.current.ymaps.geocode(address + " " + house);
              // mapRef.current.ymaps.geocode(address + " " + house);
              // console.log(mapRef);
              if (!!address && !!house && !!apartment && !!account) {
                createEstateObject();
              } else {
                dispatch(toggle({ text: "Заполните все поля", type: "error" }));
              }
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
