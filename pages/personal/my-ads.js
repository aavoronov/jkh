import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import LayoutPersonal from "../../components/LayoutPersonal";
import ProductCard from "../../components/ProductCard";

export default function MyAds({}) {
  return (
    <LayoutPersonal withProducts>
      <h1 className={styles.pageHeading + " " + styles.withProducts}>Мои объявления</h1>
      <div className={styles.productsWrap}>
        <ProductCard isPaidAd isOnMyAdsPage /> <ProductCard isVip isOnMyAdsPage /> <ProductCard isOnMyAdsPage />{" "}
        <ProductCard isOnMyAdsPage /> <ProductCard isOnMyAdsPage /> <ProductCard isOnMyAdsPage /> <ProductCard isOnMyAdsPage />{" "}
        <ProductCard isOnMyAdsPage /> <ProductCard isOnMyAdsPage /> <ProductCard isOnMyAdsPage />
        <span className={styles.createAd}>У вас пока нет ни одного размещенного объявления. Разместите объявление прямо сейчас</span>
      </div>
      <div className={styles.bottomBtnWrap + " " + styles.withProducts}>
        <Link href='/trading-platform/new'>
          <button className={styles.submitBtn}>Разместить</button>
        </Link>
      </div>
    </LayoutPersonal>
  );
}
