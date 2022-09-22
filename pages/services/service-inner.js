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

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import AdItem from "../../components/AdItem";
import ServiceAd from "../../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "./serviceinner.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";

// SwiperCore.use([Navigation]);

export default function ServiceInner(props) {
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
            <span className={styles.complaintHeading}>Пожаловаться на объект</span>

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
                    <label htmlFor='complaint-1'>Объект отсутствует на указанном месте</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-2' className={styles.radio} type='radio' name='issue' value='2' />
                    <label htmlFor='complaint-2'>Не соответствует описание</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-3' className={styles.radio} type='radio' name='issue' value='3' />
                    <label htmlFor='complaint-3'>Не соответствуют фото</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-4' className={styles.radio} type='radio' name='issue' value='4' />
                    <label htmlFor='complaint-4'>Это реклама</label>
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
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <div className={styles.leftMenuItem}>
          <Link href='./all-services'>Найти мастера</Link>
        </div>
        <div className={styles.leftMenuItem}>Предложить свою услугу</div>
        <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} />
      </aside>
      <div className={styles.container}>
        {width < 768 ? (
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
                <span className={styles.adName}>{data.name}</span>
                {data.isPaidAd ? <span className={styles.isAd}>Реклама</span> : null}
              </div>
              <span className={styles.adLocation}>{data.location}</span>
              <span className={styles.adPrice}>Цена на работы:</span>
              <span className={styles.adPriceValue}>{data.price}</span>
              <p className={styles.adDescription}>{data.description}</p>

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
                      1500: {
                        slidesPerView: 6,
                      },
                      1700: {
                        slidesPerView: 7,
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

                  <div className={block1open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
                    <span className={styles.dropdownBtn} onClick={() => setBlock1open(!block1open)}></span>
                    <div className={styles.blockHeader}>Сантехнические работы</div>
                    <table>
                      <colgroup style={{ width: "100%" }}>
                        <col span='1' style={{ width: "40%" }}></col>
                        <col span='1' style={{ width: "60%" }}></col>
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className={styles.firstcol}>Опыт работы</td>
                          <td className={styles.secondcol}>Более 7 лет</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Бригада</td>
                          <td className={styles.secondcol}>Нет</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Работа по договору</td>
                          <td className={styles.secondcol}>2</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Проживание на объекте</td>
                          <td className={styles.secondcol}>Нет</td>
                        </tr>

                        <tr>
                          <td className={styles.firstcol}>Гарантия на работу</td>
                          <td className={styles.secondcol}>Нет</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Дни работы</td>
                          <td className={styles.secondcol}>Кроме воскресенья</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Место работы</td>
                          <td className={styles.secondcol}>Нет</td>
                        </tr>
                        <tr>
                          <td className={styles.firstcol}>Время работы</td>
                          <td className={styles.secondcol}>Нет</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={block3open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
                    <span className={styles.dropdownBtn} onClick={() => setBlock3open(!block3open)}></span>
                    <div className={styles.blockHeader}>Отзывы о специалисте</div>
                    <div className={styles.reviewForm}>
                      <div className={styles.master}>
                        <div className={styles.image}>
                          <Image src={data.profilePic} width={52} height={52} />
                        </div>
                        <div className={styles.nameWrap}>
                          <div className={styles.ratePrompt}>Оцените работу специалиста</div>
                          <div className={styles.rateName}>{data.name}</div>
                        </div>
                      </div>
                      <div className={styles.ratingWrap}>
                        <Rating
                          style={{ width: "100%" }}
                          initialValue={0}
                          ratingValue={rating}
                          onClick={(rate) => {
                            setRating(rate);
                            // console.log(rating);
                          }}
                          size={36}
                          fillColor='#FF8C00'
                          emptyColor='#D1D3DF'></Rating>
                        {rating ? (
                          <Formik
                            initialValues={{
                              review: "",
                            }}
                            onSubmit={(values) => {
                              values.rating = rating / 20;

                              alert(JSON.stringify(values, null, 2));
                              setRating(0);
                            }}>
                            <Form>
                              <Field
                                as='textarea'
                                name='review'
                                maxLength={1500}
                                rows={10}
                                resize='none'
                                type='text'
                                placeholder='Напишите ваш комментарий'
                                className={styles.reviewField + " " + styles.textarea}
                              />

                              <span className={styles.warning}>Не более 1500 символов</span>
                              <div className={styles.btnsWrap}>
                                <button type='submit' className={styles.reviewSubmitBtn}>
                                  Отправить
                                </button>
                                <div
                                  className={styles.cancelReviewBtn}
                                  onClick={() => {
                                    setRating(0);
                                  }}>
                                  Отменить
                                </div>
                              </div>
                            </Form>
                          </Formik>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.reviews}>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewer}>
                          <div className={styles.reviewerImage}>
                            <Image src='/img/temp/image 1842.png' width={36} height={36} />
                          </div>
                          <div className={styles.nameWrap}>
                            <div className={styles.reviewerName}>Сергей Ц.</div>
                            <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                          </div>
                          <span className={styles.reviewDate}>12.06.2022</span>
                        </div>
                        <p className={styles.reviewText}>
                          Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала
                          небольшая цена за работу, а самое главное гарантия на работу 6 месяцев.
                        </p>
                      </div>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewer}>
                          <div className={styles.reviewerImage}>
                            <Image src='/img/temp/image 1842.png' width={36} height={36} />
                          </div>
                          <div className={styles.nameWrap}>
                            <div className={styles.reviewerName}>Сергей Ц.</div>
                            <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                          </div>
                          <span className={styles.reviewDate}>12.06.2022</span>
                        </div>
                        <p className={styles.reviewText}>
                          Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала
                          небольшая цена за работу, а самое главное гарантия на работу 6 месяцев.
                        </p>
                      </div>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewer}>
                          <div className={styles.reviewerImage}>
                            <Image src='/img/temp/image 1842.png' width={36} height={36} />
                          </div>
                          <div className={styles.nameWrap}>
                            <div className={styles.reviewerName}>Сергей Ц.</div>
                            <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                          </div>
                          <span className={styles.reviewDate}>12.06.2022</span>
                        </div>
                        <p className={styles.reviewText}>
                          Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала
                          небольшая цена за работу, а самое главное гарантия на работу 6 месяцев.
                        </p>
                      </div>
                    </div>
                    <div className={styles.paginationWrap}>
                      <span className={styles.paginationItem + " " + styles.active}>1</span>
                      <span className={styles.paginationItem}>2</span>
                      <span className={styles.paginationItem}>3</span>
                      <span className={styles.paginationItem}>4</span>
                      <span className={styles.paginationItem}>5</span>
                      <span className={styles.paginationArrow}></span>
                    </div>
                  </div>

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
                  500: {
                    slidesPerView: 4,
                  },
                  640: {
                    // width: 640,
                    slidesPerView: 5,
                  },
                  769: {
                    slidesPerView: 2,
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
              <div className={block1open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
                <span className={styles.dropdownBtn} onClick={() => setBlock1open(!block1open)}></span>
                <div className={styles.blockHeader}>Сантехнические работы</div>
                <table>
                  <colgroup style={{ width: "100%" }}>
                    <col span='1' style={{ width: "40%" }}></col>
                    <col span='1' style={{ width: "60%" }}></col>
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className={styles.firstcol}>Опыт работы</td>
                      <td className={styles.secondcol}>Более 7 лет</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Бригада</td>
                      <td className={styles.secondcol}>Нет</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Работа по договору</td>
                      <td className={styles.secondcol}>2</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Проживание на объекте</td>
                      <td className={styles.secondcol}>Нет</td>
                    </tr>

                    <tr>
                      <td className={styles.firstcol}>Гарантия на работу</td>
                      <td className={styles.secondcol}>Нет</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Дни работы</td>
                      <td className={styles.secondcol}>Кроме воскресенья</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Место работы</td>
                      <td className={styles.secondcol}>Нет</td>
                    </tr>
                    <tr>
                      <td className={styles.firstcol}>Время работы</td>
                      <td className={styles.secondcol}>Нет</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={block2open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
                <span className={styles.dropdownBtn} onClick={() => {}}></span>
                <div className={styles.blockHeader}>Мастер на час</div>
              </div>

              <div className={block3open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
                <span className={styles.dropdownBtn} onClick={() => setBlock3open(!block3open)}></span>
                <div className={styles.blockHeader}>Отзывы о специалисте</div>
                <div className={styles.reviewForm}>
                  <div className={styles.master}>
                    <div className={styles.image}>
                      <Image src={data.profilePic} width={52} height={52} />
                    </div>
                    <div className={styles.nameWrap}>
                      <div className={styles.ratePrompt}>Оцените работу специалиста</div>
                      <div className={styles.rateName}>{data.name}</div>
                    </div>
                  </div>
                  <div className={styles.ratingWrap}>
                    <Rating
                      style={{ width: "100%" }}
                      initialValue={0}
                      ratingValue={rating}
                      onClick={(rate) => {
                        setRating(rate);
                        // console.log(rating);
                      }}
                      size={36}
                      fillColor='#FF8C00'
                      emptyColor='#D1D3DF'></Rating>
                    {rating ? (
                      <Formik
                        initialValues={{
                          review: "",
                        }}
                        onSubmit={(values) => {
                          values.rating = rating / 20;

                          alert(JSON.stringify(values, null, 2));
                          setRating(0);
                        }}>
                        <Form>
                          <Field
                            as='textarea'
                            name='review'
                            maxLength={1500}
                            rows={10}
                            resize='none'
                            type='text'
                            placeholder='Напишите ваш комментарий'
                            className={styles.reviewField + " " + styles.textarea}
                          />

                          <span className={styles.warning}>Не более 1500 символов</span>
                          <div className={styles.btnsWrap}>
                            <button type='submit' className={styles.reviewSubmitBtn}>
                              Отправить
                            </button>
                            <div
                              className={styles.cancelBtn}
                              onClick={() => {
                                setRating(0);
                              }}>
                              Отменить
                            </div>
                          </div>
                        </Form>
                      </Formik>
                    ) : null}
                  </div>
                </div>
                <div className={styles.reviews}>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewer}>
                      <div className={styles.reviewerImage}>
                        <Image src='/img/temp/image 1842.png' width={36} height={36} />
                      </div>
                      <div className={styles.nameWrap}>
                        <div className={styles.reviewerName}>Сергей Ц.</div>
                        <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                      </div>
                      <span className={styles.reviewDate}>12.06.2022</span>
                    </div>
                    <p className={styles.reviewText}>
                      Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала небольшая
                      цена за работу, а самое главное гарантия на работу 6 месяцев.
                    </p>
                  </div>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewer}>
                      <div className={styles.reviewerImage}>
                        <Image src='/img/temp/image 1842.png' width={36} height={36} />
                      </div>
                      <div className={styles.nameWrap}>
                        <div className={styles.reviewerName}>Сергей Ц.</div>
                        <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                      </div>
                      <span className={styles.reviewDate}>12.06.2022</span>
                    </div>
                    <p className={styles.reviewText}>
                      Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала небольшая
                      цена за работу, а самое главное гарантия на работу 6 месяцев.
                    </p>
                  </div>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewer}>
                      <div className={styles.reviewerImage}>
                        <Image src='/img/temp/image 1842.png' width={36} height={36} />
                      </div>
                      <div className={styles.nameWrap}>
                        <div className={styles.reviewerName}>Сергей Ц.</div>
                        <Rating initialValue={3} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                      </div>
                      <span className={styles.reviewDate}>12.06.2022</span>
                    </div>
                    <p className={styles.reviewText}>
                      Большое спасибо за работу! Константин очень оперативно выполнил работу, очень качественно. Очень порадовала небольшая
                      цена за работу, а самое главное гарантия на работу 6 месяцев.
                    </p>
                  </div>
                </div>
                <div className={styles.paginationWrap}>
                  <span className={styles.paginationItem + " " + styles.active}>1</span>
                  <span className={styles.paginationItem}>2</span>
                  <span className={styles.paginationItem}>3</span>
                  <span className={styles.paginationItem}>4</span>
                  <span className={styles.paginationItem}>5</span>
                  <span className={styles.paginationArrow}></span>
                </div>
              </div>
              <div className={styles.masterBtnsWrap}>
                <button className={styles.adCallBtn}>Позвонить</button>
                <button className={styles.adWriteBtn}>Написать в чате</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </LayoutLoggedIn>
  );
}
