import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import ProgressBar from "@ramonak/react-progress-bar";
import * as Yup from "yup";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import LayoutMap from "../../components/LayoutMap";
import AdItem from "../../components/AdItem";
import ServiceAd from "../../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";
import ProductCard from "../../components/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./polls.module.scss";
import { objectList } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

export default function Polls(props) {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryHorizontal, setCategoryHorizontal] = useState("Любая категория");
  const [location, setLocation] = useState("Москва и Московская область");
  const [withPhotos, setWithPhotos] = useState(false);
  const [buySellMode, setBuySellMode] = useState("Куплю");
  const [productNew, setProductNew] = useState(false);
  const [productUsed, setProductUsed] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [priceSuggestion, setPriceSuggestion] = useState(false);
  const [popupError, setPopupError] = useState(false);

  const [dropdownValue, setDropdownValue] = useState(objectList[0]);
  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  const DropdownList = ({ objects, value, setValue, className = "" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <div className={styles.dropdownWrap + " " + className}>
        <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className={styles.dropdownField}>{value}</span>
          <span className={styles.dropdownBtn}></span>
        </div>
        {dropdownOpen ? (
          <ul className={styles.dropdownList}>
            {objects.map((item, index) => (
              <li
                key={index}
                className={styles.dropdownListItem}
                onClick={() => {
                  setValue(item);
                  setDropdownOpen(false);
                }}>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  return (
    <LayoutLoggedIn>
      {complaintActive ? (
        <>
          <div
            id={styles.overlay}
            onClick={() => {
              setComplaintError(false);
              setComplaintActive(false);
            }}></div>
          <div className={styles.complaintPopup}>
            <div
              className={styles.closeBtn}
              onClick={() => {
                setComplaintActive(false);
                setComplaintError(false);
              }}></div>
            <span className={styles.complaintHeading}>Пожаловаться на услугу</span>

            <Formik
              initialValues={{
                issue: "",
                comment: "",
              }}
              onSubmit={(values) => {
                if (values.issue == 4 && !values.comment) {
                  setComplaintError(true);
                  console.log("error");
                  return;
                }

                alert(JSON.stringify(values, null, 2));
                setComplaintError(false);
                setComplaintActive(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.form_radio}>
                    <Field id='complaint-1' className={styles.radio} type='radio' name='issue' value='1' />
                    <label htmlFor='complaint-1'>Некорректный вопрос</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-2' className={styles.radio} type='radio' name='issue' value='2' />
                    <label htmlFor='complaint-2'>Неправильная информация</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-3' className={styles.radio} type='radio' name='issue' value='3' />
                    <label htmlFor='complaint-3'>Опрос не по нашему дому</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-4' className={styles.radio} type='radio' name='issue' value='4' />
                    <label htmlFor='complaint-4'>Другое</label>
                  </div>

                  {values.issue == 4 ? (
                    <div className={styles.complaintFieldWrap}>
                      <Field
                        as='textarea'
                        name='comment'
                        maxLength={1500}
                        rows={10}
                        resize='none'
                        type='text'
                        placeholder='Напишите ваш отзыв'
                        className={styles.field + " " + styles.textarea + " " + styles.complaintComment}
                      />
                      <div className={styles.warningWrap}>
                        {complaintError ? <span className={styles.errorText}>Обязательное поле</span> : null}
                        <span className={styles.warning}>Не более 1500 символов</span>
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.fieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        setComplaintError(false);
                        setComplaintActive(false);
                      }}>
                      Отменить
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : null}

      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Голосования</h1>
        <DropdownList objects={objectList} value={dropdownValue} setValue={setDropdownValue} />
        <div className={styles.poll}>
          <div className={styles.pollHeader}>Планируется проведение собрания на 24.07.2022. Кто прийдет</div>
          <div className={styles.threeDots}>
            <div className={styles.threeDotsBtnMenu}>
              <span
                className={styles.optionsItem}
                onClick={() => {
                  setComplaintActive(true);
                  console.log(complaintActive);
                }}>
                Пожаловаться
              </span>
            </div>
          </div>

          <Formik
            initialValues={{
              option: "",
            }}
            onSubmit={(values) => {
              alert(JSON.stringify(values, null, 2));
            }}>
            {({ values }) => (
              <Form>
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    <Field id='radio-1' className={styles.radio} type='radio' name='option' value='1' />
                    <label htmlFor='radio-1'>Смогу прийти</label>
                    <span className={styles.percentage}>60%</span>
                  </div>
                  <ProgressBar
                    completed={60}
                    isLabelVisible={false}
                    className={styles.progress}
                    barContainerClassName={styles.progressContainer}
                    completedClassName={styles.progressComplete}
                    height='6px'
                    bgColor='#ff8c00'
                    borderRadius='10px'
                    animateOnRender={true}
                    transitionTimingFunction='ease-out'
                  />
                </div>
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    <Field id='radio-2' className={styles.radio} type='radio' name='option' value='2' />
                    <label htmlFor='radio-2'>Смогу не прийти</label>
                    <span className={styles.percentage}>20%</span>
                  </div>
                  <ProgressBar
                    completed={20}
                    isLabelVisible={false}
                    className={styles.progress}
                    barContainerClassName={styles.progressContainer}
                    completedClassName={styles.progressComplete}
                    height='6px'
                    bgColor='#ff8c00'
                    borderRadius='10px'
                    animateOnRender={true}
                    transitionTimingFunction='ease-out'
                  />
                </div>
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    <Field id='radio-3' className={styles.radio} type='radio' name='option' value='3' />

                    <label htmlFor='radio-3'>Не смогу прийти</label>
                    <span className={styles.percentage}>15%</span>
                  </div>
                  <ProgressBar
                    completed={15}
                    isLabelVisible={false}
                    className={styles.progress}
                    barContainerClassName={styles.progressContainer}
                    completedClassName={styles.progressComplete}
                    height='6px'
                    bgColor='#ff8c00'
                    borderRadius='10px'
                    animateOnRender={true}
                    transitionTimingFunction='ease-out'
                  />
                </div>
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    <Field id='radio-4' className={styles.radio} type='radio' name='option' value='4' />
                    <label htmlFor='radio-4'>Не смогу не прийти</label>
                    <span className={styles.percentage}>5%</span>
                  </div>
                  <ProgressBar
                    completed={5}
                    isLabelVisible={false}
                    className={styles.progress}
                    barContainerClassName={styles.progressContainer}
                    completedClassName={styles.progressComplete}
                    height='6px'
                    bgColor='#ff8c00'
                    borderRadius='10px'
                    animateOnRender={true}
                    transitionTimingFunction='ease-out'
                  />
                </div>
                <div className={styles.fieldWrap}>
                  <button type='submit' className={styles.submitBtn}>
                    Проголосовать
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className={styles.votesTotal}>37 голосов</div>

          {/* <div className={styles.option}>
            <ProgressBar
              completed={60}
              isLabelVisible={false}
              className={styles.progress}
              barContainerClassName={styles.progressContainer}
              completedClassName={styles.progressComplete}
              height={6}
              bgColor='#ff8c00'
              borderRadius='10px'
              animateOnRender={true}
              transitionTimingFunction='ease-out'
            />
          </div> */}
        </div>
      </div>
    </LayoutLoggedIn>
  );
}
