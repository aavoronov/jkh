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

import styles from "./services.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

// SwiperCore.use([Navigation]);

export default function Services(props) {
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

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);

  const { height, width } = useWindowDimensions();

  const changeStateWithDelay = (setState, newState) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setState(newState);
    }, 500);
  };

  const DropdownList = ({ objects, value, setValue }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <div className={styles.dropdownWrap}>
        <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className={styles.dropdownField}>{value}</span>
          <span className={styles.dropdownBtn}></span>
        </div>
        {dropdownOpen ? (
          <ul className={styles.dropdownList}>
            {objects.map((item, index) => (
              <li
                key={index}
                className={styles.dropdownListItem}
                onClick={() => {
                  setValue(item);
                  setDropdownOpen(false);
                }}>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  return (
    <LayoutLoggedIn>
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        <div className={styles.filtersHeader}>Фильтр</div>
        <div className={styles.filterWrap}>
          <label htmlFor='guarantee' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='guarantee'
              className={guarantee ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                // setGuarantee(!guarantee);
                changeStateWithDelay(setGuarantee, !guarantee);
              }}></div>
            <span className={styles.filterName}>С гарантией (тут демо загрузки)</span>
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
            <span className={styles.filterNameWithHeader}>Да</span>
          </label>
          <label htmlFor='withoutAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='withoutAccommodation'
              className={withoutAccommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setWithoutAccommodation(!withoutAccommodation);
              }}></div>
            <span className={styles.filterNameWithHeader}>Нет</span>
          </label>
        </div>

        <div className={styles.filterWrap + " " + styles.fieldWithBtn}>
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

        <div className={styles.filterWrap}>
          <label htmlFor='contract' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='contract'
              className={contract ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setContract(!contract);
              }}></div>
            <span className={styles.filterName}>Работа по договору</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='examples' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='examples'
              className={examples ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setExamples(!examples);
              }}></div>
            <span className={styles.filterName}>С примерами работ</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <span className={styles.filterBlockName}>Тип исполнителя</span>
          <label htmlFor='privatePerson' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='privatePerson'
              className={privatePerson ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setPrivatePerson(!privatePerson);
              }}></div>
            <span className={styles.filterNameWithHeader}>Частное лицо</span>
          </label>
          <label htmlFor='organization' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='organization'
              className={organization ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setOrganization(!organization);
              }}></div>
            <span className={styles.filterNameWithHeader}>Организация</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='passport' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='passport'
              className={passport ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setPassport(!passport);
              }}></div>
            <span className={styles.filterName}>С проверенным паспортом</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='jobNow' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='jobNow'
              className={jobNow ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setJobNow(!jobNow);
              }}></div>
            <span className={styles.filterName}>Работа сейчас</span>
          </label>
        </div>
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
        {/* {width < 768 ? <div id={styles.overlay} className={leftMenuIsOpen ? "" : styles.hidden}></div> : null} */}
        {isLoading ? (
          <div id={styles.overlay} className={styles.loader}>
            <div className={styles.loaderWrap}>
              <RotatingLines
                strokeColor='#FF8C00'
                strokeWidth='5'
                animationDuration='0.75'
                width='40'
                visible={true}
                className={styles.loader}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.mainInputWrap + " " + styles.fieldWithBtn}>
          <input name='name' type='text' placeholder='Я хочу найти...' className={styles.field} />
        </div>
        <div className={styles.dropdownsWrap}>
          <div className={styles.dropdownName}>
            <span className={styles.dropdownLabel}>Адрес объекта</span>
            <DropdownList objects={objectList} value={activeObject} setValue={setActiveObject} className={styles.dropdownServices} />
          </div>
          <div className={styles.dropdownName}>
            <span className={styles.dropdownLabel}>Виды услуг</span>
            <DropdownList objects={servicesList} value={activeService} setValue={setActiveService} />
          </div>
        </div>
        <span className={styles.filterHeader}>{activeService}</span>
        {mastersData.map((item, index) => (
          <ServiceAd data={item} key={index} />
        ))}
        {/* <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} /> */}
        <div className={styles.paginationWrap}>
          <span className={styles.paginationItem + " " + styles.active}>1</span>
          <span className={styles.paginationItem}>2</span>
          <span className={styles.paginationItem}>3</span>
          <span className={styles.paginationItem}>4</span>
          <span className={styles.paginationItem}>5</span>
          <span className={styles.paginationArrow}></span>
        </div>
      </div>
    </LayoutLoggedIn>
  );
}
