import React, { useState, useRef } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import ProgressBar from "@ramonak/react-progress-bar";
import LayoutLoggedIn from "../../../components/LayoutLoggedIn";
import EstateObject from "../../../components/EstateObject";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

import { objectsData } from "../../../components/data";

import LayoutWorker from "../../../components/LayoutWorker";
import styles from "../workers.module.scss";
import { useRouter } from "next/router";

export default function WorkerPolls(props) {
  const router = useRouter();

  return (
    <LayoutWorker>
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Рекламные объявления</h1>

        <span className={styles.threeDotsBtn}>
          {/* <div className={styles.threeDotsBtnMenu}>
            <span className={styles.chatOptionsItem}>Редактировать</span>
            <span className={styles.chatOptionsItem}>Удалить аккаунт</span>
          </div> */}
        </span>
        <span className={styles.timelapseFilterAds}>За весь период</span>
        <div className={styles.adsWrap}>
          {[...Array(4)].map((e, i) => (
            <div className={styles.chatMessagePartner} key={i}>
              {/* <span className={styles.objectLetters}>ЛИ</span> */}

              <div className={styles.messageBubble}>
                <div className={styles.chatPicWrap}>
                  <img src='/img/temp/partnerMessagePic.png' layout='responsive' width='100%' height='100%' />
                  {/* <Image src='/img/temp/chatPic.png' width='100%' height='100%' layout='responsive' className={styles.chatPic} /> */}
                </div>
                <span className={styles.messageText}>
                  С 27 мая по 11 июня скидки до 100% на товары помеченные желтым ценником. Приобретая товары в www.magazintut.ru вы можете
                  выиграть главный приз. Спешите делать покупки и не упустить возможность отдохнуть на Гаваях.
                </span>
                <div className={styles.partnerTimeWrap}>
                  <span className={styles.partnerInfo}>
                    Это <span className={styles.hashtag}>#партнерский</span> пост
                  </span>
                </div>
              </div>
              <div className={styles.adOptionsWrap}>
                <span className={styles.adOptionsBtn + " " + styles.trash}></span>
                <span className={styles.adOptionsBtn + " " + styles.refresh}></span>
              </div>
            </div>
          ))}
        </div>
        <span className={styles.showMore}>Показать еще</span>
        <div className={styles.fieldWrap}>
          <button
            type='submit'
            className={styles.submitBtn + " " + styles.createAdBtn}
            onClick={() => {
              router.push("/workers/ads/new");
            }}>
            Разместить рекламный пост
          </button>
        </div>
      </div>
    </LayoutWorker>
  );
}
