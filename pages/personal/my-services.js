import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import LayoutPersonal from "../../components/LayoutPersonal";

import { mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

export default function MyServices({}) {
  const { height, width } = useWindowDimensions();
  const data = mastersData[0];

  const [block1, setBlock1] = useState(true);
  const [block2, setBlock2] = useState(true);

  return (
    <LayoutPersonal>
      <h1 className={styles.pageHeading}>Мои услуги</h1>

      {block1 && (
        <div className={styles.col}>
          <div className={styles.adWrap}>
            <div className={styles.adProfileWrap}>
              <div className={styles.picWrap}>
                <Image src={data.profilePic} width={120} height={120} />
              </div>
            </div>
            <div className={styles.adInfoWrap}>
              <div className={styles.myServicesBtnsWrap}>
                <button className={styles.myServicesBtn + " " + styles.pencil}></button>
                <button
                  className={styles.myServicesBtn + " " + styles.trash}
                  onClick={() => {
                    confirm("Вы уверены, что хотите навсегда удалить это объявление?") && setBlock1(false);
                  }}></button>
              </div>
              <div className={styles.nameWrap}>
                <Link href='/services/service-inner'>
                  <span className={styles.adName}>{data.name}</span>
                </Link>
              </div>
              <span className={styles.adLocation}>{data.location}</span>
              <span className={styles.adPrice}>Цена на работы:</span>
              <span className={styles.adPriceValue}>{data.price}</span>
              <p className={styles.adDescription}>
                {data.description.substring(0, 250).concat(data.description.length > 250 ? "..." : "")}
              </p>
            </div>
          </div>
        </div>
      )}

      {block2 && (
        <div className={styles.col}>
          <div className={styles.adWrap}>
            <div className={styles.adProfileWrap}>
              <div className={styles.picWrap}>
                <Image src={data.profilePic} width={120} height={120} />
              </div>
            </div>
            <div className={styles.adInfoWrap}>
              <div className={styles.myServicesBtnsWrap}>
                <button className={styles.myServicesBtn + " " + styles.pencil}></button>
                <button
                  className={styles.myServicesBtn + " " + styles.trash}
                  onClick={() => {
                    confirm("Вы уверены, что хотите навсегда удалить это объявление?") && setBlock2(false);
                    // setBlock2(!confirm("Вы уверены, что хотите навсегда удалить это объявление?"));
                  }}></button>
              </div>
              <div className={styles.nameWrap}>
                <Link href='/services/service-inner'>
                  <span className={styles.adName}>{data.name}</span>
                </Link>
              </div>
              <span className={styles.adLocation}>{data.location}</span>
              <span className={styles.adPrice}>Цена на работы:</span>
              <span className={styles.adPriceValue}>{data.price}</span>
              <p className={styles.adDescription}>
                {data.description.substring(0, 250).concat(data.description.length > 250 ? "..." : "")}
              </p>
            </div>
          </div>
        </div>
      )}

      {!block1 && !block2 ? (
        <span className={styles.createAdServices}>
          У вас пока нет ни одного объявления по предоставлению услуги. Вы можете разместить объявление об услуге, которую вы оказываете.
          Объявление размещается на платной основе.
        </span>
      ) : null}

      <div className={styles.bottomBtnWrap}>
        <Link href='/personal/create-service'>
          <button className={styles.submitBtn}>Разместить услугу</button>
        </Link>
      </div>
    </LayoutPersonal>
  );
}
