import React, { useState, useRef, useEffect } from "react";
import styles from "./servicead.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createComplaint, Types } from "../service/functions";

import useWindowDimensions from "./useWindowDimensionsSSR";
import { toggle } from "../store/notificationSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const ServiceAd = ({ data }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const router = useRouter();

  let sumRating = 0;
  data.reviews.forEach((item) => (sumRating = sumRating + item.rating));

  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);
  const [votes, setVotes] = useState(data.reviews.length);
  const [rating, setRating] = useState(sumRating / votes);

  // useEffect(() => {
  //   if (!!data.reviews) {
  //     setVotes(data.reviews.length);
  //     let sumRating = 0;
  //     data.reviews.forEach((item) => (sumRating = sumRating + item.rating));
  //     setRating(sumRating / votes);
  //   }
  // }, []);

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
                if (values.issue == "Другое" && !values.comment) {
                  setComplaintError(true);
                  return;
                }
                // values.objectId = objectInfoActive.id;
                const complaintData = {
                  type: Types.service,
                  objectId: data.id,
                  reason: values.issue,
                  text: values.issue === "Другое" ? values.comment : undefined,
                };
                createComplaint(complaintData);
                // alert(JSON.stringify(complaintData, null, 2));
                dispatch(toggle({ type: "success", text: "Жалоба успешно отправлена" }));
                setComplaintError(false);
                setComplaintActive(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.form_radio}>
                    <Field
                      id='complaint-1'
                      className={styles.radio}
                      type='radio'
                      name='issue'
                      value='Цена не соответствует заявленной в объявлении'
                    />
                    <label htmlFor='complaint-1'>Цена не соответствует заявленной в объявлении</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-2' className={styles.radio} type='radio' name='issue' value='Не соответствует описание' />
                    <label htmlFor='complaint-2'>Не соответствует описание</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-3' className={styles.radio} type='radio' name='issue' value='Нагрубил при общении' />
                    <label htmlFor='complaint-3'>Нагрубил при общении</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-4' className={styles.radio} type='radio' name='issue' value='Мошенник' />
                    <label htmlFor='complaint-4'>Мошенник</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-5' className={styles.radio} type='radio' name='issue' value='Другое' />
                    <label htmlFor='complaint-5'>Другое</label>
                  </div>

                  {values.issue == "Другое" ? (
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
              <img
                onClick={() => router.push({ pathname: "/services/[id]", query: { id: data.id } })}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${data.mainImage}`}
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
            </div>
            <div className={styles.rating}>
              <div>
                <Image src='/img/star6.svg' width={25} height={25} className={rating ? "" : styles.starGrey} />
              </div>
              <div className={styles.ratingNumbers}>
                {votes ? <span>{Math.round(rating * 100) / 100}</span> : <span className={styles.noRating}>Нет рейтинга</span>}
                {votes ? <span>{votes} оценок</span> : <span className={styles.noRating}>Нет оценок</span>}
              </div>
            </div>
            {data.isChecked ? (
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
                {/* <span className={styles.objectOptionsItem}>Поделиться</span> */}
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
              {/* <Link href='/services/service-inner'> */}
              <span className={styles.adName} onClick={() => router.push({ pathname: "/services/[id]", query: { id: data.id } })}>
                {data.name}
              </span>
              {/* </Link> */}
              {data.isPaidAd ? <span className={styles.isAd}>Реклама</span> : null}
            </div>
            <span className={styles.adLocation}>{data.address}</span>
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
                  // onSlideChange={() => console.log("slide change")}
                  // onSwiper={(swiper) => console.log(swiper)}
                  // navigation={swiperNavigation}
                >
                  {data.portfolio &&
                    data.portfolio.map((image, index) => (
                      <SwiperSlide key={index} className={styles.slide}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${image}`}
                          style={{ verticalAlign: "top", height: 100, objectFit: "cover" }}
                          className={styles.slideImage}
                        />
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
                  {data.user.phone && (
                    <a href={`tel:${data.user.phone}`} className={styles.adCallBtn}>
                      Позвонить
                    </a>
                  )}
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
              // onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) => console.log(swiper)}
              // navigation={swiperNavigation}
            >
              {data.sliderPhotos &&
                data.sliderPhotos.map((image, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <img src={image} style={{ verticalAlign: "top", height: 100, objectFit: "cover" }} className={styles.slideImage} />
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
              {data.user.phone && (
                <a href={`tel:${data.user.phone}`} className={styles.adCallBtn}>
                  Позвонить
                </a>
              )}
              {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ServiceAd;
