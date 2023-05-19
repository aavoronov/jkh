import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import AdItem from "../../components/AdItem";
import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Pagination from "../../components/Pagination";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import { createComplaint, Types } from "../../service/functions";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";
import styles from "./serviceinner.module.scss";

// SwiperCore.use([Navigation]);

export default function ServiceInner({ id }) {
  // const [guarantee, setGuarantee] = useState(false);
  // const [withAccommodation, setWithAccommodation] = useState(false);
  // const [withoutAccommodation, setWithoutAccommodation] = useState(false);
  // const [radius, setRadius] = useState(null);
  // const [contract, setContract] = useState(false);
  // const [examples, setExamples] = useState(false);
  // const [privatePerson, setPrivatePerson] = useState(false);
  // const [organization, setOrganization] = useState(false);
  // const [passport, setPassport] = useState(false);
  // const [jobNow, setJobNow] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // const [activeObject, setActiveObject] = useState(objectList[0]);
  // const [activeService, setActiveService] = useState("Показать все");

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rating, setRating] = useState(0);

  const [block1open, setBlock1open] = useState(true);
  const [block2open, setBlock2open] = useState(true);
  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { height, width } = useWindowDimensions();

  const ServiceDetails = () => {
    const breakpoints =
      width >= 900
        ? {
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
          }
        : {
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
          };
    return (
      <>
        <Swiper
          spaceBetween={10}
          className={styles.slider}
          modules={[Navigation]}
          // navigation
          breakpoints={breakpoints}
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
          slidesPerView={width >= 900 ? 4 : undefined}

          // navigation={swiperNavigation}
        >
          {service.portfolio &&
            service.portfolio.map((image, index) => (
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
        </Swiper>

        <div className={block1open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
          <span className={styles.dropdownBtn} onClick={() => setBlock1open(!block1open)}></span>
          <div className={styles.blockHeader}>{service.subcategory.category.category + " / " + service.subcategory.subcategory}</div>
          <table>
            <colgroup style={{ width: "100%" }}>
              <col span='1' style={{ width: "40%" }}></col>
              <col span='1' style={{ width: "60%" }}></col>
            </colgroup>
            <tbody>
              {/* <tr>
                <td className={styles.firstcol}>Опыт работы</td>
                <td className={styles.secondcol}>{service.experience}</td>
              </tr> */}
              <tr>
                <td className={styles.firstcol}>Бригада</td>
                <td className={styles.secondcol}>{service.brigade ? "Да" : "Нет"}</td>
              </tr>
              <tr>
                <td className={styles.firstcol}>Работа по договору</td>
                <td className={styles.secondcol}>{service.contract ? "Да" : "Нет"}</td>
              </tr>
              <tr>
                <td className={styles.firstcol}>Проживание на объекте</td>
                <td className={styles.secondcol}>{service.accommodation ? "Да" : "Нет"}</td>
              </tr>

              <tr>
                <td className={styles.firstcol}>Гарантия на работу</td>
                <td className={styles.secondcol}>{service.warranty ? "Да" : "Нет"}</td>
              </tr>
              <tr>
                <td className={styles.firstcol}>Дни работы</td>
                <td className={styles.secondcol}>{service.workDays}</td>
              </tr>
              <tr>
                <td className={styles.firstcol}>Место работы</td>
                <td className={styles.secondcol}>{service.workLocation}</td>
              </tr>
              <tr>
                <td className={styles.firstcol}>Время работы</td>
                <td className={styles.secondcol}>{service.workTime}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={block2open ? styles.serviceBlock : styles.serviceBlock + " " + styles.collapsed}>
          <span className={styles.dropdownBtn} onClick={() => setBlock2open((prev) => !prev)}></span>
          <div className={styles.blockHeader}>Отзывы о специалисте</div>
          <div className={styles.reviewForm}>
            <div className={styles.master}>
              <div className={styles.image}>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${service.mainImage}`}
                  style={{ width: 52, height: 52 }}
                  width={52}
                  height={52}
                />
              </div>
              <div className={styles.nameWrap}>
                <div className={styles.ratePrompt}>Оцените работу специалиста</div>
                <div className={styles.rateName}>{service.name}</div>
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
                    if (!values.review) {
                      dispatch(toggle({ text: "Заполните поле комментария", type: "error" }));
                      return;
                    }
                    values.rating = rating / 20;
                    values.serviceId = id;
                    createReview(values);
                    // alert(JSON.stringify(values, null, 2));
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
                        className={width >= 900 ? styles.cancelReviewBtn : styles.cancelBtn}
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
            {reviews.map((item, index) => {
              const date = new Date(item.createdAt);
              return (
                <div className={styles.reviewItem} key={index}>
                  <div className={styles.reviewer}>
                    <div className={styles.reviewerImage}>
                      {item.user.profile.profilePic ? (
                        <img
                          className={styles.reviewProfilePic}
                          style={{ width: 36, height: 36, objectFit: "cover" }}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${item.user.profile.profilePic}`}
                          // height={35}
                          // width={35}
                        />
                      ) : (
                        <span className={styles.objectLetters} style={{ backgroundColor: item.user.profile.color }}>
                          {item.user.profile.pseudonym.split(" ").length > 1
                            ? item.user.profile.pseudonym.split(" ")[0][0] + item.user.profile.pseudonym.split(" ")[1][0]
                            : item.user.profile.pseudonym.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className={styles.nameWrap}>
                      <div className={styles.reviewerName} style={{ position: "relative" }}>
                        {item.user.profile.pseudonym}
                      </div>
                      <Rating initialValue={item.rating} readonly={true} size={13} fillColor='#22C54F' emptyColor='#D1D3DF'></Rating>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div className={styles.reviewDate}>
                        {date.getDate().toString().padStart(2, "0") +
                          "." +
                          (date.getMonth() + 1).toString().padStart(2, "0") +
                          "." +
                          date.getFullYear().toString()}
                      </div>
                      <div className={styles.threeDotsBtn} style={{ marginLeft: 10, marginTop: -10, flexShrink: 0, position: "static" }}>
                        <div className={styles.threeDotsBtnMenu}>
                          <span
                            className={styles.objectOptionsItem}
                            onClick={() => {
                              setComplaintActive("review");
                            }}>
                            Пожаловаться
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewText}>{item.text}</p>
                </div>
              );
            })}
          </div>
          <Pagination
            // className='pagination-bar'
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            currentPage={page}
            totalCount={pageCount}
            pageSize={process.env.NEXT_PUBLIC_SERVICES_REVIEWS_PAGE_LIMIT}
            onPageChange={(page) => {
              setPage(page);
              getReviews(page);
            }}
          />
        </div>

        <div className={styles.masterBtnsWrap}>
          <a href={`tel:${service.user.phone}`} className={styles.adCallBtn}>
            Позвонить
          </a>
          {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
        </div>
      </>
    );
  };

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  const getObjectById = async () => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      // const { service } = ;
      // setPoints(res.data);
      // setReviews(reviews);
      setService(res.data);

      // dispatch(updateRole({ role: res.data.role }));
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  const getReviews = async (page) => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}/reviews?page=${page}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      const { reviews, rating, count } = res.data;
      // setPoints(res.data);

      setPageCount(count);
      setReviews(reviews);
      setService((prev) => {
        return { ...prev, rating: rating };
      });

      // dispatch(updateRole({ role: res.data.role }));
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  useEffect(() => {
    getObjectById();
    getReviews(page);
  }, []);

  const createReview = async (values) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/services/reviews`, values, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      setRating(0);
      dispatch(toggle({ text: "Спасибо! Отзыв опубликован", type: "success" }));
      getObjectById();
      setPage(1);
      getReviews(page);
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  };

  return (
    <LayoutLoggedIn title={`ЖКХ Консьерж - ${service?.name || "услуга"}`} description='description' keywords='keywords'>
      {width <= 768 && leftMenuIsOpen && (
        <div
          id={styles.overlay}
          className={styles.underneath}
          onClick={() => {
            setLeftMenuIsOpen(false);
          }}></div>
      )}

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
            <span className={styles.complaintHeading}>{`Пожаловаться на ${
              complaintActive === "service" ? "услугу" : "комментарий"
            } `}</span>

            {complaintActive === "service" ? (
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
                    objectId: id,
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
            ) : (
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
                    type: complaintActive === "service" ? Types.service : Types.serviceReview,
                    objectId: id,
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
                      <Field id='complaint-1' className={styles.radio} type='radio' name='issue' value='Неизвестно, что здесь будет' />
                      <label htmlFor='complaint-1'>Неизвестно, что здесь будет</label>
                    </div>

                    {/* <div className={styles.form_radio}>
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
                    </div> */}

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
            )}
          </div>
        </>
      ) : null}
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        {/* <div className={styles.leftMenuItem}>
          <Link href='./all-services' style={{ color: "#fff" }}>
            Найти мастера
          </Link>
        </div> */}
        {/* <div className={styles.leftMenuItem} onClick={() => router.push("./all-services")}>
          Найти мастера
        </div> */}
        <div className={styles.leftMenuItem} onClick={() => router.push("/personal/create-service")}>
          Предложить свою услугу
        </div>
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
        {!!service && Object.keys(service).length > 1 ? (
          <div className={styles.col}>
            <div className={styles.adWrap}>
              <div className={styles.adProfileWrap}>
                <div className={styles.picWrap}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${service.mainImage}`}
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                </div>
                <div className={styles.rating}>
                  <div>
                    <Image src='/img/star6.svg' width={25} height={25} className={service.rating ? "" : styles.starGrey} />
                  </div>
                  <div className={styles.ratingNumbers}>
                    {service.rating ? (
                      <span>{Math.round(service.rating * 100) / 100}</span>
                    ) : (
                      <span className={styles.noRating}>Нет рейтинга</span>
                    )}
                    {service.rating ? <span>{pageCount} оценок</span> : <span className={styles.noRating}>Нет оценок</span>}
                  </div>
                </div>
                {service.isChecked ? (
                  <div className={styles.rating}>
                    <div className={styles.masterCheckWrap}>
                      <Image src='/img/master-check.svg' width={25} height={25} />
                    </div>
                    <span className={styles.checkStatus}>Документ проверен</span>
                  </div>
                ) : null}
                {service.contract ? (
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
                        setComplaintActive("service");
                      }}>
                      Пожаловаться
                    </span>
                  </div>
                </div>
                <div className={styles.nameWrap}>
                  <span className={styles.adName}>{service.name}</span>
                  {service.isPaidAd ? <span className={styles.isAd}>Реклама</span> : null}
                </div>
                <span className={styles.adLocation}>{service.address}</span>
                <span className={styles.adPrice}>Цена на работы:</span>
                <span className={styles.adPriceValue}>{service.price}</span>
                <p className={styles.adDescription}>{service.description}</p>

                {width >= 900 ? <ServiceDetails /> : null}
              </div>
            </div>
            {width < 900 ? <ServiceDetails /> : null}
          </div>
        ) : (
          <div style={{ position: "absolute", top: 20, textAlign: "center" }}>
            Услуга не найдена. Проверьте правильность введенного адреса
          </div>
        )}
      </div>
    </LayoutLoggedIn>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}
