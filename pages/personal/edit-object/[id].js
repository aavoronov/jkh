import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../personal-sections.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import LayoutPersonal from "../../../components/LayoutPersonal";
import { getGeocode } from "../../../service/functions";
import { loading } from "../../../store/loaderSlice";
import { toggle } from "../../../store/notificationSlice";

export default function Profile({ id }) {
  const profileData = {
    photo: "/img/temp/adProfilePic.png",
    nickname: "Александр Константинович",
  };

  const [files, setFiles] = useState([]);
  const [nickname, setNickname] = useState(profileData.nickname);
  const [objectId, setObjectId] = useState("");
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [account, setAccount] = useState("");
  // const [email, setEmail] = useState("");
  // const [object, setObject] = useState(null);
  const [isOwner, setIsOwner] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [secure, setSecure] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    async function getObjectById() {
      try {
        // setHasLoaded(false);
        dispatch(loading({ visible: true }));
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects/${id}`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        // dispatch(updateProfile({ pseudonym: nicknameLocal }));
        // dispatch(toggle({ text: "Объект успешно удален", type: "success" }));
        // const newObjects = objects.filter((item) => item.id !== id);
        // setObject(res.data);
        // const fullAddress = res.data.estateObject.address;
        setObjectId(res.data.estateObjectId);
        setAddress(
          res.data.estateObject.address
            .split(", ")
            .slice(0, res.data.estateObject.address.split(", ").length - 1)
            .join(", ")
        );
        setHouse(res.data.estateObject.address.split(", ").at(-1));
        setApartment(res.data.estateObject.apartment);
        setAccount(res.data.account);
        setIsOwner(res.data.isOwnerRatherThanTenant);
      } catch (e) {
        console.log(e);
      }
      dispatch(loading({ visible: false }));
      setHasLoaded(true);
    }
    getObjectById();
  }, []);

  const deleteObject = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects/${id}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Объект успешно удален", type: "success" }));
      // const newObjects = objects.filter((item) => item.id !== id);
      // setObjects(newObjects);
      router.push("/personal");
    } catch (e) {
      console.log(e);
    }
  };

  const updateEstateObject = async () => {
    try {
      const { geocodedAddress, latitude, longitude, precision } = await getGeocode(address + " " + house);
      if (precision !== "exact") {
        throw new Error("Введенный адрес не найден. Проверьте правильность введенного адреса");
      }
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/estate-objects`,
        { email, id: objectId, address: geocodedAddress, latitude, longitude, apartment: apartment, account: account, isOwner: isOwner },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
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

  // useEffect(() => {
  //   profileData.photo && setFiles(profileData.photo);
  // }, []);

  return (
    <LayoutPersonal title='ЖКХ Консьерж - редактировать адрес' description='description' keywords='keywords'>
      <h1 className={styles.pageHeading + " " + styles.profile}>Редактирование адреса</h1>

      <div className={styles.personalSection}>
        <span className={styles.deleteObject} onClick={deleteObject}>
          Удалить объект
        </span>
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
              setAccount(e.target.value);
            }}
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
          <span className={styles.text}>Удалить аккаунт арендатора</span>
          <span className={styles.text + " " + styles.border}>Написать администратору</span>

          <button
            type='button'
            className={styles.text + " " + styles.solid}
            onClick={() => {
              if (!!address && !!house && !!apartment && !!account) {
                updateEstateObject();
              }
            }}>
            Сохранить
          </button>
          <span
            className={styles.text + " " + styles.border}
            onClick={() => {
              confirm("Отменить изменение объекта? Данные не будут сохранены.") && router.push("/personal");
            }}>
            Отменить
          </span>
        </div>
      </div>
    </LayoutPersonal>
  );
}

export async function getServerSideProps(context) {
  // console.log(context.params);

  return {
    props: { id: context.params.id },
  };
}
