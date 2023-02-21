import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";

import LayoutLoggedIn from "../../../components/LayoutLoggedIn";
import LayoutMap from "../../../components/LayoutMap";
import AdItem from "../../../components/AdItem";
import ServiceAd from "../../../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";
import ProductCard from "../../../components/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./product.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../../components/data";

import useWindowDimensions from "../../../components/useWindowDimensionsSSR";
import { loading } from "../../../store/loaderSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Product({ id }) {
  const [product, setProduct] = useState(null);
  const [datetime, setDatetime] = useState(new Date());
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [priceSuggestion, setPriceSuggestion] = useState(false);
  const [popupError, setPopupError] = useState(false);

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

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

  useEffect(() => {
    async function getProductById() {
      try {
        dispatch(loading({ visible: true }));
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/${id}`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res.data);
        setProduct(res.data);
        setDatetime(new Date(res.data.createdAt));
        setFavorite(!!res.data.favorites.length);
        // dispatch(updateProfile({ pseudonym: nicknameLocal }));
        // dispatch(toggle({ text: "Объект успешно удален", type: "success" }));
        // const newObjects = objects.filter((item) => item.id !== id);
        // setObject(res.data);
        // const fullAddress = res.data.estateObject.address;
        // setObjectId(res.data.estateObjectId);
        // setAddress(
        //   res.data.estateObject.address
        //     .split(", ")
        //     .slice(0, res.data.estateObject.address.split(", ").length - 1)
        //     .join(", ")
        // );
        // setHouse(res.data.estateObject.address.split(", ").at(-1));
        // setApartment(res.data.estateObject.apartment);
        // setAccount(res.data.account);
        // setIsOwner(res.data.isOwnerRatherThanTenant);
      } catch (e) {
        console.log(e);
      }
      dispatch(loading({ visible: false }));
    }
    getProductById();
  }, []);

  // condition: 1
  // ​
  // createdAt: "2023-02-17T12:39:18.302Z"
  // ​
  // description: "123"
  // ​
  // favorites: Array [ {…} ]
  // ​​
  // 0: Object { id: 1, createdAt: "2023-02-17T14:16:13.965Z", updatedAt: "2023-02-17T14:16:13.965Z", … }
  // ​​
  // length: 1
  // ​​
  // <prototype>: Array []
  // ​
  // hasTelegram: false
  // ​
  // hasWhatsapp: true
  // ​
  // id: 35
  // ​
  // images: Array(5) [ "Ni40NTYyMDI1NDg3Mzg2ODgxNjc2NjM3NTU4Mjk2.jpg", "NTYxLjc0MTA0NzkzMzk5NjYxNjc2NjM3NTU4Mjk2.png", "OTczLjg5NDQxMzE5NzI1NzMxNjc2NjM3NTU4Mjk2.png", … ]
  // ​
  // isPaidUntil: "2023-02-24T12:39:18.301Z"
  // ​
  // isVip: true
  // ​
  // likes: 0
  // ​
  // location: "Адрес"
  // ​
  // name: "Test"
  // ​
  // phone: "131"
  // ​
  // price: "150"
  // ​
  // subcategoryId: 1
  // ​
  // updatedAt: "2023-02-17T12:39:18.302Z"
  // ​
  // userId: 1
  // ​
  // views: 0
  // ​
  // wts: true

  return (
    <LayoutLoggedIn>
      {priceSuggestion ? (
        <>
          <div
            id={styles.overlay}
            onClick={() => {
              setPriceSuggestion(false);
              setPopupError(false);
            }}></div>
          <div className={styles.popup}>
            <div
              className={styles.closeBtn}
              onClick={() => {
                setPriceSuggestion(false);
                setPopupError(false);
              }}></div>
            <span className={styles.popupHeading}>Предложите свою цену</span>
            <div className={styles.popupFieldWrap}>
              <Formik
                initialValues={{
                  comment: "",
                }}
                onSubmit={(values) => {
                  if (!values.comment) {
                    setPopupError(true);
                    console.log("error");
                    return;
                  }
                  alert(JSON.stringify(values, null, 2));
                  setPriceSuggestion(false);
                  setPopupError(false);
                }}>
                {({ values }) => (
                  <Form>
                    <Field
                      as='textarea'
                      name='comment'
                      maxLength={1500}
                      rows={10}
                      resize='none'
                      type='text'
                      placeholder='Напишите сообщение продавцу'
                      className={styles.field + " " + styles.textarea + " " + styles.popupComment}
                    />

                    <div className={styles.warningWrap}>
                      {popupError ? <span className={styles.errorText}>Обязательное поле</span> : null}
                      <span className={styles.warning}>Не более 1500 символов</span>
                    </div>

                    {/* <div className={styles.fieldWrap}> */}
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    {/* </div> */}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      ) : null}

      {product && (
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            {/* <span>Главная</span> */}

            <Link href='/trading-platform'>
              <span>Торговая площадка</span>
            </Link>

            {/* <span
              onClick={() =>
                router.push({
                  pathname: "/trading-platform",
                  query: { category: product.subcategory.category.category },
                })
              }>
              {product.subcategory.category.category}
            </span>

            <span
              onClick={() =>
                router.push({
                  pathname: "/trading-platform",
                  query: {
                    category: product.subcategory.category.category,
                    subcategory: product.subcategory.subcategory,
                  },
                })
              }>
              {product.subcategory.subcategory}
            </span> */}

            <span>{product.name}</span>
          </div>
          {width && width > 1134 ? (
            <>
              <div className={styles.meta}>
                <span className={styles.date}>
                  Объявление размещено{" "}
                  <span className={styles.dateValue}>
                    {datetime.getDate() +
                      "." +
                      (datetime.getMonth() + 1).toString().padStart(2, "0") +
                      "." +
                      datetime.getFullYear().toString().slice(2) +
                      " " +
                      datetime.getHours().toString().padStart(2, "0") +
                      ":" +
                      datetime.getMinutes().toString().padStart(2, "0")}
                  </span>
                </span>
                {/* <span className={styles.faveBtn}>Добавить в избранное</span> */}
                <button className={favorite ? styles.faveBtn + " " + styles.faved : styles.faveBtn} onClick={() => setFavorite(!favorite)}>
                  {/* {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />} */}
                  <span>{favorite ? "В избранном" : "Добавить в избранное"}</span>
                </button>
              </div>
            </>
          ) : null}
          <div className={styles.productWrap}>
            <div className={styles.sliderWrap}>
              <Swiper
                spaceBetween={10}
                className={styles.slider}
                modules={[Navigation, Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                // navigation
                // breakpoints={{
                //   // when window width is >= 640px
                //   640: {
                //     // width: 640,
                //     slidesPerView: 2,
                //   },
                //   // when window width is >= 768px
                //   920: {
                //     // width: 768,
                //     slidesPerView: 3,
                //   },
                //   1100: {
                //     slidesPerView: 4,
                //   },
                //   1280: {
                //     slidesPerView: 5,
                //   },
                // }}
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
                slidesPerView={1}
                watchSlidesProgress
                onSlideChange={() => console.log("slide change")}
                onSwiper={() => setThumbsSwiper}
                // navigation={swiperNavigation}
              >
                {/* {data.sliderPhotos &&
                data.sliderPhotos.map((image, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <img src={image} style={{ verticalAlign: "top" }} className={styles.slideImage} />
                  </SwiperSlide>
                ))} */}

                {!!product.images?.length ? (
                  product.images.map((item, index) => (
                    <SwiperSlide className={styles.slide} key={index}>
                      <img
                        // slot='container-end'

                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`}
                        // style={{ verticalAlign: "top" }}
                        className={styles.slideImage}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className={styles.slide}>
                    <img src='/img/no-image.jpg' style={{ verticalAlign: "top" }} className={styles.slideImage} />
                  </SwiperSlide>
                )}

                {/* <SwiperSlide className={styles.slide}>
                  <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
                </SwiperSlide> */}
                <span
                  className={styles.arrowNext}
                  // onClick={onClickHandler}
                  ref={navigationNextRef}></span>

                <span
                  className={styles.arrowPrev}
                  // onClick={onClickHandler}

                  ref={navigationPrevRef}
                  style={{
                    left: 10,
                  }}></span>
              </Swiper>
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                slidesPerView={5}
                className={styles.sliderThumbs}
                thumbs={{ slideThumbActiveClass: styles.slideActive, thumbsContainerClass: styles.thumbsWrap }}>
                {!!product.images?.length &&
                  product.images.map((item, index) => (
                    <SwiperSlide className={styles.slide} key={index}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`}
                        // style={{ objectFit: "cover", width: "100%" }}
                        // className={styles.slide}
                        // height={width > 1050 || width < 421 ? 177 : 120}
                        style={{ verticalAlign: "top" }}
                        className={styles.slideImage}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              {width && width <= 1134 ? (
                <>
                  <div className={styles.meta}>
                    <span className={styles.date}>
                      Объявление размещено{" "}
                      <span className={styles.dateValue}>
                        {datetime.getDate() +
                          "." +
                          (datetime.getMonth() + 1).toString().padStart(2, "0") +
                          "." +
                          datetime.getFullYear().toString().slice(2) +
                          " " +
                          datetime.getHours().toString().padStart(2, "0") +
                          ":" +
                          datetime.getMinutes().toString().padStart(2, "0")}
                      </span>
                    </span>
                    {/* <span className={styles.faveBtn}>Добавить в избранное</span> */}
                    <button
                      className={favorite ? styles.faveBtn + " " + styles.faved : styles.faveBtn}
                      onClick={() => setFavorite(!favorite)}>
                      {/* {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />} */}
                      <span>{favorite ? "В избранном" : "Добавить в избранное"}</span>
                    </button>
                  </div>
                  {/* <div className={styles.profileMeta}>
                  <span className={styles.profileSince}>Виктория Ивановна на сайте с 2019 года</span>
                  <span className={styles.profileChecked}>Проверенный</span>
                </div> */}
                  <div className={styles.stats}>
                    <span className={styles.statsItem + " " + styles.faves}>{product.likes}</span>
                    <span className={styles.statsItem + " " + styles.views}>
                      {product.views}
                      {/* <span className={styles.plusViews}>(+15)</span> */}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles.productInfo}>
              <h1 className={styles.productName}>{product.name}</h1>
              <span className={styles.productPrice}>{product.price} ₽</span>
              {/* <button
              className={styles.suggestPriceBtn}
              onClick={() => {
                setPriceSuggestion(true);
              }}>
              Предложить свою цену
            </button> */}
              <div className={styles.btnsWrap}>
                <button className={styles.adCallBtn}>Показать телефон</button>
                {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
              </div>
              <span className={styles.messengersHeader}>Мессенджеры:</span>
              <div className={styles.messengersWrap}>
                {product.hasWhatsapp && (
                  <a href={`https://wa.me/${product.phone}`} className={styles.messengerItem + " " + styles.whatsapp}></a>
                )}
                {!product.hasTelegram && (
                  <a href={`https://t.me/+${product.phone}`} className={styles.messengerItem + " " + styles.telegram}></a>
                )}
              </div>
              <div className={styles.profileMeta}>
                <span className={styles.profileSince}>Виктория Ивановна на сайте с 2019 года</span>
                {/* <span className={styles.profileChecked}>Проверенный</span> */}
              </div>
              {width > 1134 ? (
                <>
                  <div className={styles.stats}>
                    <span className={styles.statsItem + " " + styles.faves}>{product.likes}</span>
                    <span className={styles.statsItem + " " + styles.views}>
                      {product.views}
                      {/* <span className={styles.plusViews}>(+15)</span> */}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <span className={styles.descHeader}>Описание</span>
          <p className={styles.productDescription}>{product.description}</p>
        </div>
      )}
      <style jsx global>{`
        .swiper-wrapper {
          display: flex;
          align-items: center;
          max-height: 500px;
        }
        .swiper-slide {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </LayoutLoggedIn>
  );
}

export async function getServerSideProps(context) {
  console.log(context.params);

  return {
    props: { id: context.params.id },
  };
}
