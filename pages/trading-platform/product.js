import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
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

import styles from "./product.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

export default function Product(props) {
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

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

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

      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <span>Главная</span>
          <span>Торговая площадка </span>
          <span>Электроника</span>
          <span>Телефоны</span>
          <span>iPhone 11 Green 128 Gb / как новенький в пленочке</span>
        </div>
        {width && width > 1134 ? (
          <>
            <div className={styles.meta}>
              <span className={styles.date}>
                Объявление размещено: <span className={styles.dateValue}>21.03.2021</span>
              </span>
              {/* <span className={styles.faveBtn}>Добавить в избранное</span> */}
              <button className={favorite ? styles.faveBtn + " " + styles.faved : styles.faveBtn} onClick={() => setFavorite(!favorite)}>
                {/* {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />} */}
                <span>Добавить в избранное</span>
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
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
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
              {/* <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide> */}
            </Swiper>
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView={5}
              className={styles.sliderThumbs}
              thumbs={{ slideThumbActiveClass: styles.slideActive, thumbsContainerClass: styles.thumbsWrap }}>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>{" "}
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
              <SwiperSlide className={styles.slide}>
                <img src='/img/temp/iphone.png' style={{ verticalAlign: "top" }} className={styles.slideImage} />
              </SwiperSlide>
            </Swiper>
            {width && width <= 1134 ? (
              <>
                <div className={styles.meta}>
                  <span className={styles.date}>
                    Объявление размещено: <span className={styles.dateValue}>21.03.2021</span>
                  </span>
                  {/* <span className={styles.faveBtn}>Добавить в избранное</span> */}
                  <button
                    className={favorite ? styles.faveBtn + " " + styles.faved : styles.faveBtn}
                    onClick={() => setFavorite(!favorite)}>
                    {/* {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />} */}
                    <span>Добавить в избранное</span>
                  </button>
                </div>
                {/* <div className={styles.profileMeta}>
                  <span className={styles.profileSince}>Виктория Ивановна на сайте с 2019 года</span>
                  <span className={styles.profileChecked}>Проверенный</span>
                </div> */}
                <div className={styles.stats}>
                  <span className={styles.statsItem + " " + styles.faves}>465</span>
                  <span className={styles.statsItem + " " + styles.views}>
                    465 <span className={styles.plusViews}>(+15)</span>
                  </span>
                </div>
              </>
            ) : null}
          </div>
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>iPhone 11 Green 128 Gb / как новенький в пленочке</h1>
            <span className={styles.productPrice}>54 000 ₽</span>
            <button
              className={styles.suggestPriceBtn}
              onClick={() => {
                setPriceSuggestion(true);
              }}>
              Предложить свою цену
            </button>
            <div className={styles.btnsWrap}>
              <button className={styles.adCallBtn}>Показать телефон</button>
              {/* <button className={styles.adWriteBtn}>Написать в чате</button> */}
            </div>
            <span className={styles.messengersHeader}>Мессенджеры:</span>
            <div className={styles.messengersWrap}>
              <span className={styles.messengerItem + " " + styles.telegram}></span>
              <span className={styles.messengerItem + " " + styles.whatsapp}></span>
            </div>
            <div className={styles.profileMeta}>
              <span className={styles.profileSince}>Виктория Ивановна на сайте с 2019 года</span>
              <span className={styles.profileChecked}>Проверенный</span>
            </div>
            {width > 1134 ? (
              <>
                <div className={styles.stats}>
                  <span className={styles.statsItem + " " + styles.faves}>465</span>
                  <span className={styles.statsItem + " " + styles.views}>
                    465 <span className={styles.plusViews}>(+15)</span>
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <span className={styles.descHeader}>Описание:</span>
        <p className={styles.productDescription}>
          Добрый день. Продаю iPhone X на 64gb черного цвета (Space Gray). Состояние отличное, никаких царапин и сколов. Телефон не
          вскрывался, не бился. Относились к нему бережно. Все функции работают исправно (в том числе Face ID и True Tone). Готов на любые
          проверки с вашей стороны. Состояние аккумулятора 96%, что очень хорошо. К тому же установлен Сбербанк Онлайн, могу установить
          Альфа Банк при необходимости). В комплекте: коробка (с серийным номером и тд), зарядный провод, вилка и проводные наушники. Буду
          рад ответить на все вопросы по телефону или в личных сообщениях
        </p>
      </div>
    </LayoutLoggedIn>
  );
}
