import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";

import LayoutLoggedIn from "../components/LayoutLoggedIn";
import LayoutMap from "../components/LayoutMap";
import AdItem from "../components/AdItem";

import styles from "./services.module.scss";

export default function Services(props) {
  const [guarantee, setGuarantee] = useState(false);
  const [withAccommodation, setWithAccommodation] = useState(false);
  const [withoutAccommodation, setWithoutAccommodation] = useState(false);
  const [radius, setRadius] = useState(null);

  return (
    <LayoutLoggedIn menuIsCollapsible={true}>
      <aside className={styles.leftMenu}>
        <div className={styles.filtersHeader}>Фильтр</div>
        <div className={styles.filterWrap}>
          <label htmlFor='guarantee' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='guarantee'
              className={guarantee ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setGuarantee(!guarantee);
              }}></div>
            <span className={styles.filterName}>С гарантией</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <span className={styles.filterBlockName}>Проживание на объекте</span>
          <label htmlFor='withAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='withAccommodation'
              className={withAccommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setWithAccommodation(!withAccommodation);
              }}></div>
            <span className={styles.filterName}>Да</span>
          </label>
          <label htmlFor='withoutAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='withoutAccommodation'
              className={withoutAccommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setWithoutAccommodation(!withoutAccommodation);
              }}></div>
            <span className={styles.filterName}>Нет</span>
          </label>
        </div>

        <div className={styles.filterWrap} onClick={() => console.log(radius)}>
          <span className={styles.filterBlockName}>Место, город</span>
          <input name='name' type='text' placeholder='Выбрать город' className={styles.field} />
        </div>

        <div className={styles.filterWrap}>
          <div className={styles.form_radio} onClick={() => setRadius("5km")}>
            <span className={styles.filterBlockName}>Радиус поиска услуги</span>
            <input id='radio-1' className={styles.radio} type='radio' name='radius' value='1' />
            <label htmlFor='radio-1'>5 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("10km")}>
            <input id='radio-2' className={styles.radio} type='radio' name='radius' value='2' />
            <label htmlFor='radio-2'>10 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("15km")}>
            <input id='radio-3' className={styles.radio} type='radio' name='radius' value='3' />
            <label htmlFor='radio-3'>15 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("20km")}>
            <input id='radio-4' className={styles.radio} type='radio' name='radius' value='4' />
            <label htmlFor='radio-4'>20 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("any")}>
            <input id='radio-5' className={styles.radio} type='radio' name='radius' value='5' />
            <label htmlFor='radio-5'>Любое расстояние </label>
          </div>
        </div>
      </aside>
      <div className={styles.test}>test main</div>
    </LayoutLoggedIn>
  );
}
