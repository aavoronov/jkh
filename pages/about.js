import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";

import LayoutLoggedIn from "../components/LayoutLoggedIn";
import LayoutMap from "../components/LayoutMap";
import AdItem from "../components/AdItem";
import ServiceAd from "../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";
import ProductCard from "../components/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./about.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../components/data";

import useWindowDimensions from "../components/useWindowDimensionsSSR";

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
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Заголовок</h1>
        <h2 className={styles.h2}>Заголовок второго уровня</h2>
        <h3 className={styles.h3}>Заголовок третьего уровня</h3>
        <p className={styles.paragraph}>
          Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности требуют от нас анализа дальнейших
          направлений развития. Задача организации, в особенности же реализация намеченных плановых заданий представляет собой интересный
          эксперимент проверки систем массового участия. Товарищи! начало повседневной работы по формированию позиции способствует
          подготовки и реализации существенных финансовых и административных условий.
        </p>
        <p className={styles.paragraph}>
          Товарищи! постоянный количественный рост и сфера нашей активности играет важную роль в формировании систем массового участия.
          Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий влечет за собой процесс внедрения и
          модернизации позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что постоянный
          количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации модели развития.
        </p>
        <h2 className={styles.h2}>Заголовок второго уровня</h2>
        <p className={styles.paragraph}>
          Равным образом начало повседневной работы по формированию позиции в значительной степени обуславливает создание системы обучения
          кадров, соответствует насущным потребностям. Таким образом укрепление и развитие структуры представляет собой интересный
          эксперимент проверки существенных финансовых и административных условий. Таким образом реализация намеченных плановых заданий
          требуют от нас анализа направлений прогрессивного развития. Не следует, однако забывать, что дальнейшее развитие различных форм
          деятельности требуют от нас анализа модели развития. Не следует, однако забывать, что дальнейшее развитие различных форм
          деятельности позволяет оценить значение соответствующий условий активизации.
        </p>
        <a href='/#' className={styles.link}>
          Ссылка, например, на политику
        </a>
      </div>
    </LayoutLoggedIn>
  );
}
