import React, { useState, useRef } from "react";
import styles from "./servicead.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

import useWindowDimensions from "./useWindowDimensionsSSR";

const ServiceAd = ({ data }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);

  return (
    <>
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
                if (values.issue == 5 && !values.comment) {
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
                    <label htmlFor='complaint-1'>Цена не соответствует заявленной в объявлении</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-2' className={styles.radio} type='radio' name='issue' value='2' />
                    <label htmlFor='complaint-2'>Не соответствует описание</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-3' className={styles.radio} type='radio' name='issue' value='3' />
                    <label htmlFor='complaint-3'>Нагрубил при общении</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-4' className={styles.radio} type='radio' name='issue' value='4' />
                    <label htmlFor='complaint-4'>Мошенник</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-5' className={styles.radio} type='radio' name='issue' value='5' />
                    <label htmlFor='complaint-5'>Другое</label>
                  </div>

                  {values.issue == 5 ? (
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
      <div className={styles.col}>
        <div className={styles.adWrap}>
          <div className={styles.adProfileWrap}>
            <div className={styles.picWrap}>
              <Image src={data.profilePic} width={120} height={120} />
            </div>
            <div className={styles.rating}>
              <div>
                <Image src='/img/star6.svg' width={25} height={25} className={data.rating ? "" : styles.starGrey} />
              </div>
              <div className={styles.ratingNumbers}>
                {data.votes ? <span>{data.rating}</span> : <span className={styles.noRating}>Нет рейтинга</span>}
                {data.votes ? <span>{data.votes} оценок</span> : <span className={styles.noRating}>Нет оценок</span>}
              </div>
            </div>
            {data.documentChecked ? (
              <div className={styles.rating}>
                <div className={styles.masterCheckWrap}>
                  <Image src='/img/master-check.svg' width={25} height={25} />
                </div>
                <span className={styles.checkStatus}>Документ проверен</span>
              </div>
            ) : null}
            {data.contract ? (
              <div className={styles.rating}>
                <div className={styles.masterCheckWrap}>
                  <Image src='/img/master-check.svg' width={25} height={25} />
                </div>
                <span className={styles.checkStatus}>Работает по договору</span>
              </div>
            ) : null}
          </div>
          <div className={styles.adInfoWrap}>
            <div className={styles.threeDotsBtn}>
              <div className={styles.threeDotsBtnMenu}>
                <span className={styles.objectOptionsItem}>Поделиться</span>
                <span
                  className={styles.objectOptionsItem}
                  onClick={() => {
                    setComplaintActive(true);
                  }}>
                  Пожаловаться
                </span>
              </div>
            </div>
            <div className={styles.nameWrap}>
              <Link href='/services/service-inner'>
                <span className={styles.adName}>{data.name}</span>
              </Link>
              {data.isPaidAd ? <span className={styles.isAd}>Реклама</span> : null}
            </div>
            <span className={styles.adLocation}>{data.location}</span>
            <span className={styles.adPrice}>Цена на работы:</span>
            <span className={styles.adPriceValue}>{data.price}</span>
            <p className={styles.adDescription}>{data.description.substring(0, 250).concat(data.description.length > 250 ? "..." : "")}</p>

            {width >= 900 ? (
              <>
                <Swiper
                  spaceBetween={10}
                  className={styles.slider}
                  modules={[Navigation]}
                  // navigation
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      // width: 640,
                      slidesPerView: 2,
                    },
                    // when window width is >= 768px
                    920: {
                      // width: 768,
                      slidesPerView: 3,
                    },
                    1100: {
                      slidesPerView: 4,
                    },
                    1280: {
                      slidesPerView: 5,
                    },
                  }}
                  navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                    disabledClass: styles.disabled,
                  }}
                  onBeforeInit={(swiper) => {
                    {
                      swiper.params.navigation.prevEl = navigationPrevRef.current;
                      swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                  }}
                  rewind={true}
                  slidesPerView={4}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                  // navigation={swiperNavigation}
                >
                  {data.sliderPhotos &&
                    data.sliderPhotos.map((image, index) => (
                      <SwiperSlide key={index} className={styles.slide}>
                        <img src={image} style={{ verticalAlign: "top" }} className={styles.slideImage} />
                      </SwiperSlide>
                    ))}
                  <span
                    className={styles.arrowNext}
                    // onClick={onClickHandler}
                    ref={navigationNextRef}
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: "calc(50% - 10px)",
                      cursor: "pointer",
                      right: 0,
                    }}></span>

                  <span
                    className={styles.arrowPrev}
                    // onClick={onClickHandler}

                    ref={navigationPrevRef}
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: "calc(50% - 10px)",
                      cursor: "pointer",
                      left: 0,
                    }}></span>
                  {/* <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide> */}
                </Swiper>
                <div className={styles.masterBtnsWrap}>
                  <button className={styles.adCallBtn}>Позвонить</button>
                  {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
                </div>
              </>
            ) : null}
          </div>
        </div>
        {width < 900 ? (
          <>
            <Swiper
              spaceBetween={10}
              className={styles.slider}
              modules={[Navigation]}
              // slidesPerView={2}
              // navigation
              breakpoints={{
                // when window width is >= 640px
                360: {
                  slidesPerView: 2,
                },
                640: {
                  // width: 640,
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 1,
                },
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
                disabledClass: styles.disabled,
              }}
              onBeforeInit={(swiper) => {
                {
                  swiper.params.navigation.prevEl = navigationPrevRef.current;
                  swiper.params.navigation.nextEl = navigationNextRef.current;
                }
              }}
              rewind={true}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              // navigation={swiperNavigation}
            >
              {data.sliderPhotos &&
                data.sliderPhotos.map((image, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <img src={image} style={{ verticalAlign: "top" }} className={styles.slideImage} />
                  </SwiperSlide>
                ))}
              <span
                className={styles.arrowNext}
                // onClick={onClickHandler}
                ref={navigationNextRef}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  top: "calc(50% - 10px)",
                  cursor: "pointer",
                  right: 0,
                }}></span>

              <span
                className={styles.arrowPrev}
                // onClick={onClickHandler}

                ref={navigationPrevRef}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  top: "calc(50% - 10px)",
                  cursor: "pointer",
                  left: 0,
                }}></span>
              {/* <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide> */}
            </Swiper>
            <div className={styles.masterBtnsWrap}>
              <button className={styles.adCallBtn}>Позвонить</button>
              {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ServiceAd;
