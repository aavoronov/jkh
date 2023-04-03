import React, { useState } from "react";

import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../components/LayoutWorker";
import { toggle } from "../../store/notificationSlice";
import { updateRole } from "../../store/userSlice";
import styles from "./workers.module.scss";

const payments = [1500, -1500, 1500];

export default function WorkerProfile(props) {
  const dispatch = useDispatch();
  const router = useRouter();

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

  const user = useSelector((state) => state.user);
  const { pseudonym, email, phone, color, profilePic, balance } = user;

  const [transactionsShown, setTransactionsShown] = useState(1);
  return (
    <LayoutWorker>
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
                  {pseudonym.split(" ").length > 1 ? pseudonym.split(" ")[0][0] + pseudonym.split(" ")[1][0] : pseudonym.slice(0, 2)}
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
            <span className={styles.spent}>Потрачено на рекламу: 0 баллов</span>
          </div>
        </div>
        <div className={styles.transactionsWrap}>
          <div className={styles.sectionHeaderWrap}>
            <span className={styles.blockHeader}>Транзакции</span>
            <span className={styles.timelapseFilter}>За весь период</span>
          </div>
          <div className={styles.transactionsBlock}>
            {[...Array(transactionsShown)].map((e, i) => (
              <React.Fragment key={i}>
                <div className={styles.transaction}>
                  <span className={styles.transactionType}>Покупка услуги</span>
                  <div className={styles.datetimeWrap}>
                    <span className={styles.transactionDatetime}>12.08.2022</span>
                    <span className={styles.transactionDatetime}>14:36</span>
                  </div>
                  <span className={payments[0] < 0 ? styles.transactionValue : styles.transactionValue + " " + styles.green}>
                    {payments[0]} баллов
                  </span>
                </div>
                <div className={styles.transaction}>
                  <span className={styles.transactionType}>Покупка услуги</span>
                  <div className={styles.datetimeWrap}>
                    <span className={styles.transactionDatetime}>12.08.2022</span>
                    <span className={styles.transactionDatetime}>14:36</span>
                  </div>
                  <span className={payments[1] < 0 ? styles.transactionValue : styles.transactionValue + " " + styles.green}>
                    {payments[1]} баллов
                  </span>
                </div>
                <div className={styles.transaction}>
                  <span className={styles.transactionType}>Покупка услуги</span>
                  <div className={styles.datetimeWrap}>
                    <span className={styles.transactionDatetime}>12.08.2022</span>
                    <span className={styles.transactionDatetime}>14:36</span>
                  </div>
                  <span className={payments[2] < 0 ? styles.transactionValue : styles.transactionValue + " " + styles.green}>
                    {payments[2]} баллов
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <span
            className={styles.showMore}
            onClick={() => {
              setTransactionsShown(transactionsShown + 1);
            }}>
            Показать еще
          </span>
        </div>
      </div>
    </LayoutWorker>
  );
}
