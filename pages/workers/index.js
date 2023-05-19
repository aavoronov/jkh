import React, { useEffect, useState } from "react";

import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../components/LayoutWorker";
import { currentDatetime, getGeocode } from "../../service/functions";
import { toggle } from "../../store/notificationSlice";
import { updateRole } from "../../store/userSlice";
import styles from "./workers.module.scss";

const Transaction = ({ item }) => {
  let type, isExpense;
  if (item.basis === "chat ad") {
    type = "Реклама в чатах";
    isExpense = true;
  }

  const sum = isExpense ? -item.sum : item.sum;

  return (
    <div className={styles.transaction}>
      <span className={styles.transactionType}>{type}</span>
      <div className={styles.datetimeWrap}>
        <span className={styles.transactionDatetime}>{currentDatetime(item.createdAt)}</span>
        {/* <span className={styles.transactionDatetime}></span> */}
      </div>
      <span className={isExpense ? styles.transactionValue : styles.transactionValue + " " + styles.green}>{sum} баллов</span>
    </div>
  );
};

export default function WorkerProfile(props) {
  const [objects, setObjects] = useState(null);
  const [addObject, setAddObject] = useState(false);
  const [objectAddressField, setObjectAddressField] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [startReached, setStartReached] = useState(false);
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    async function getObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        setObjects(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getObjects();
  }, []);

  async function getTransactions(page) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      setTransactions((prev) => [...prev, ...res.data]);
      if (res.data.length < 3) setStartReached(true);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getTransactions(page);
  }, []);

  async function getMyExpenses() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/expenses`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      setExpenses(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMyExpenses();
  }, []);

  const registerObject = async () => {
    try {
      const { geocodedAddress, latitude, longitude, precision } = await getGeocode(objectAddressField);

      if (precision !== "exact") {
        throw new Error("Введенный адрес не найден. Проверьте правильность введенного адреса");
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/worker-object`,
        { address: geocodedAddress, latitude: latitude, longitude: longitude },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Объект отправлен на проверку", type: "success" }));
      setAddObject(false);
      setObjectAddressField("");
    } catch (e) {
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
      console.log(e);
    }
  };

  const deleteObject = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects/${id}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Объект успешно удален", type: "success" }));
      const newObjects = objects.filter((item) => item.id !== id);
      setObjects(newObjects);
    } catch (e) {
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
      // dispatch(updateProfile({ pseudonym: nicknameLocal }));
      dispatch(toggle({ text: "Ваш аккаунт успешно удален", type: "success" }));
      dispatch(updateRole({ role: "" }));
      router.replace("/");
      setCookie("jkh-token", "");
    } catch (e) {
      console.log(e);
    }
  };

  const user = useSelector((state) => state.user);
  const { pseudonym, email, phone, color, profilePic, balance } = user;

  return (
    <LayoutWorker title='ЖКХ Консьерж - рабочий кабинет' description='description' keywords='keywords'>
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Рабочий кабинет</h1>
        <span className={styles.threeDotsBtn}>
          <div className={styles.threeDotsBtnMenu}>
            <Link href='/workers/edit-profile'>
              <span className={styles.chatOptionsItem}>Редактировать</span>
            </Link>
            <span
              className={styles.chatOptionsItem}
              onClick={() => {
                confirm("Удалить профиль? Это действие необратимо.") && deleteProfile();
              }}>
              Удалить аккаунт
            </span>
          </div>
        </span>
        <div className={styles.profileWrap}>
          <div className={styles.orgData}>
            <div className={styles.orgNameWrap}>
              {profilePic ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}`}
                  className={styles.orgProfilePic}

                  //style={{ backgroundImage: `${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${profilePic}` }}
                />
              ) : (
                <span className={styles.orgLetters} style={{ backgroundColor: color }}>
                  {!!pseudonym
                    ? pseudonym.split(" ").length > 1
                      ? pseudonym.split(" ")[0][0] + pseudonym.split(" ")[1][0]
                      : pseudonym.slice(0, 2)
                    : ""}
                </span>
              )}
              <span className={styles.orgName}>{pseudonym}</span>
            </div>
            <div className={styles.orgContacts}>
              <span>{phone}</span>

              <span>{email}</span>
            </div>
            <button className={styles.payBtn}>Пополнить баланс</button>
          </div>
          <div className={styles.balanceWrap}>
            <span className={styles.mask}></span>
            <span className={styles.infoBtn}>i</span>
            <span className={styles.balance}>Ваш баланс</span>
            <span className={styles.balanceValue}>{balance} баллов</span>
            <span className={styles.spent}>Потрачено на рекламу: {expenses} баллов</span>
          </div>
        </div>
        {(role === "uk" || role === "upravdom") && (
          <div className={styles.personalSection}>
            <span className={styles.sectionHeader}>Дома под управлением</span>
            {!!objects?.length &&
              objects.map((item, index) => {
                const addressArray = item.estateObject.address.split(", ");

                return (
                  <div className={styles.object} key={index} style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
                    <div className={styles.iconWrap}>
                      <Image src='/img/objectIcon.png' alt='' width={42} height={42} />
                    </div>
                    <div className={styles.objName}>
                      <span className={styles.objectTitle}>{addressArray.at(-2) + " " + addressArray.at(-1)}</span>
                      <span className={styles.objectAddress}>{addressArray.slice(0, addressArray.length - 2).join(", ")}</span>
                    </div>
                    <div className={styles.myServicesBtnsWrap}>
                      {/* <Link href={{ pathname: "/personal/edit-object/[id]", query: { id: item.id } }}>
                      <button className={styles.myServicesBtn + " " + styles.pencil}></button>
                    </Link> */}
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

            <button type='button' className={styles.submitBtn} onClick={() => setAddObject((prev) => !prev)}>
              Добавить дом
            </button>

            {addObject && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "white", marginTop: 10 }}>Введите адрес дома</span>
                <input
                  type='text'
                  value={objectAddressField}
                  onChange={(e) => setObjectAddressField(e.target.value)}
                  className={styles.field}
                  style={{ marginTop: 10 }}
                  placeholder='Район, город*, улица*, дом*, корпус/строение'
                />
                <button
                  type='button'
                  className={styles.submitBtn}
                  style={{ width: 150, height: 40, marginTop: 10 }}
                  onClick={registerObject}>
                  Зарегистрировать
                </button>
              </div>
            )}
          </div>
        )}

        <div className={styles.transactionsWrap}>
          <div className={styles.sectionHeaderWrap}>
            <span className={styles.blockHeader}>Транзакции</span>
            {/* <span className={styles.timelapseFilter}>За весь период</span> */}
          </div>
          <div className={styles.transactionsBlock}>
            {!!transactions.length ? (
              transactions.map((e, i) => <Transaction item={e} key={i} />)
            ) : (
              <div style={{ color: "white", marginBottom: 30 }}>Транзакций пока не было</div>
            )}
          </div>
          {!startReached && (
            <span
              className={styles.showMore}
              onClick={() => {
                // setTransactionsShown(transactionsShown + 1);
              }}>
              Показать еще
            </span>
          )}
        </div>
      </div>
    </LayoutWorker>
  );
}
