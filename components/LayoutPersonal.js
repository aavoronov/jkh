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

import styles from "./personal.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "./data";
import useWindowDimensions from "./useWindowDimensionsSSR";

// SwiperCore.use([Navigation]);

export default function ServiceInner({ children, withProducts }) {
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
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <Link href='/personal'>
          <div className={styles.leftMenuItem}>Мой профиль</div>
        </Link>
        <Link href='/personal/my-services'>
          <div className={styles.leftMenuItem}>Мои услуги</div>
        </Link>
        <Link href='/personal/my-ads'>
          <div className={styles.leftMenuItem}>Мои объявления</div>
        </Link>
        <Link href='/personal/my-favorites'>
          <div className={styles.leftMenuItem}>Избранное</div>
        </Link>
        <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} />
      </aside>
      <div className={withProducts ? styles.container + " " + styles.withProducts : styles.container}>
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
        {children}
      </div>
    </LayoutLoggedIn>
  );
}
