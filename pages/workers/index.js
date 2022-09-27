import React, { useState } from "react";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import EstateObject from "../../components/EstateObject";

import { objectsData } from "../../components/data";

import LayoutWorker from "../../components/LayoutWorker";
import styles from "./workers.module.scss";
import Link from "next/link";

const payments = [1500, -1500, 1500];

export default function WorkerProfile(props) {
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
            <span className={styles.chatOptionsItem}>Удалить аккаунт</span>
          </div>
        </span>
        <div className={styles.profileWrap}>
          <div className={styles.orgData}>
            <div className={styles.orgNameWrap}>
              <span className={styles.orgLetters}>УК</span>
              <span className={styles.orgName}>Организация «Компания Бизнес Альянс Компани»</span>
            </div>
            <div className={styles.orgContacts}>
              <a href='tel:+7 (913) 000-00-00'>+7 (913) 000-00-00</a>

              <a href='mailto:inf0@mail.ru'>inf0@mail.ru</a>
            </div>
            <button className={styles.payBtn}>Пополнить баланс</button>
          </div>
          <div className={styles.balanceWrap}>
            <span className={styles.mask}></span>
            <span className={styles.infoBtn}>i</span>
            <span className={styles.balance}>Ваш баланс</span>
            <span className={styles.balanceValue}>12 000 баллов</span>
            <span className={styles.spent}>Потрачено на рекламу: 10 900 баллов</span>
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
