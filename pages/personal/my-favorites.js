import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import LayoutPersonal from "../../components/LayoutPersonal";
import ProductCard from "../../components/ProductCard";

export default function MyFavorites({}) {
  return (
    <LayoutPersonal withProducts>
      <h1 className={styles.pageHeading + " " + styles.withProducts}>Избранное</h1>
      <div className={styles.productsWrap}>
        <ProductCard isPaidAd isOnMyFavesPage /> <ProductCard isVip isOnMyFavesPage /> <ProductCard isOnMyFavesPage />{" "}
        <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage />{" "}
        <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage />
        <span className={styles.createAd}>У вас пока нет добавленных объявлений в избранное. Посмотрите объявлния еще раз</span>
      </div>
      <div className={styles.bottomBtnWrap + " " + styles.withProducts}>
        <button className={styles.submitBtn}>Перейти к объявлениям</button>
      </div>
    </LayoutPersonal>
  );
}
