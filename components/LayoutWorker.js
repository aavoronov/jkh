import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import LayoutLoggedIn from "./LayoutLoggedIn";
import AdItem from "./AdItem";
import ServiceAd from "./ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "../components/personal.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "./data";
import useWindowDimensions from "./useWindowDimensionsSSR";

// SwiperCore.use([Navigation]);

export default function LayoutWorker({ children, withProducts }) {
  const [guarantee, setGuarantee] = useState(false);
  const [withAccommodation, setWithAccommodation] = useState(false);
  const [withoutAccommodation, setWithoutAccommodation] = useState(false);
  const [radius, setRadius] = useState(null);
  const [contract, setContract] = useState(false);
  const [examples, setExamples] = useState(false);
  const [privatePerson, setPrivatePerson] = useState(false);
  const [organization, setOrganization] = useState(false);
  const [passport, setPassport] = useState(false);
  const [jobNow, setJobNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeObject, setActiveObject] = useState(objectList[0]);
  const [activeService, setActiveService] = useState("Показать все");

  const [block1open, setBlock1open] = useState(true);
  const [block2open, setBlock2open] = useState(false);
  const [block3open, setBlock3open] = useState(true);
  const [rating, setRating] = useState(0);
  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [adRequest, setAdRequest] = useState(false);

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  const data = mastersData[0];

  return (
    <LayoutLoggedIn noRightMenu>
      {width <= 768 && leftMenuIsOpen && (
        <div
          id={styles.overlay}
          onClick={() => {
            setLeftMenuIsOpen(false);
          }}></div>
      )}
      {adRequest && (
        <>
          <div
            id={styles.overlay}
            className={styles.adRequest}
            onClick={() => {
              setAdRequest(false);
            }}></div>
          <div className={styles.adPopup}>
            <div
              className={styles.closeBtn}
              onClick={() => {
                setAdRequest(false);
                // setComplaintError(false);
              }}></div>
            <span className={styles.adHeading}>Заявка на рекламу</span>

            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
              }}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
                // setComplaintError(false);
                setAdRequest(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='name' className={styles.fieldName}>
                      Ваше имя
                    </label>
                    <Field name='name' type='text' placeholder='Укажите ваше имя' className={styles.field} />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='phone' className={styles.fieldName}>
                      Ваш телефон
                    </label>
                    <Field name='phone' type='text' placeholder='Укажите ваш телефон' className={styles.field} />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='email' className={styles.fieldName}>
                      Ваш email
                    </label>
                    <Field name='email' type='text' placeholder='Укажите ваш email' className={styles.field} />
                  </div>
                  <div className={styles.modalBtnsWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        // setComplaintError(false);
                        setAdRequest(false);
                      }}>
                      Отменить
                    </span>
                  </div>
                  <div className={styles.fieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <Link href='/workers'>
          <div className={styles.leftMenuItem}>Данные организации</div>
        </Link>
        <Link href='/workers/polls'>
          <div className={styles.leftMenuItem}>Голосования, опросы</div>
        </Link>
        <Link href='/workers/ads'>
          <div className={styles.leftMenuItem}>Рекламные объявления</div>
        </Link>
        <Link href='/workers'>
          <div className={styles.leftMenuItem}>Домовые чаты</div>
        </Link>
        {/* <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} /> */}
        <span className={styles.orderAdText}>
          Вы можете разместить рекламму на площадке нашего приложения, для этого нужно оставить заявку
        </span>
        <button
          className={styles.orderAdBtn}
          onClick={() => {
            setAdRequest(true);
          }}>
          Заказать рекламу
        </button>
      </aside>
      <div className={styles.containerWorker}>
        {width <= 768 ? (
          <>
            <button
              className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
              onClick={() => {
                setLeftMenuIsOpen(!leftMenuIsOpen);
              }}>
              <Image src={arrowLeft} alt='' width={14} height={31} />
            </button>
          </>
        ) : null}
        {children}
      </div>
    </LayoutLoggedIn>
  );
}
