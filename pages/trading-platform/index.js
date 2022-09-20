import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

import styles from "./tradingplatform.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

const SubcategoryItem = ({ name }) => {
  const [listIsShown, setListIsShown] = useState(false);
  return (
    <li className={styles.subcategoryWrap}>
      <span
        className={listIsShown ? styles.subcategoryName + " " + styles.expanded : styles.subcategoryName}
        onClick={() => setListIsShown(!listIsShown)}>
        {name}
      </span>
      {listIsShown ? (
        <ul className={styles.subcategoryList}>
          <li className={styles.subsubcat}>Мобильные телефоны</li>
          <li className={styles.subsubcat}>Аксессуары</li>
          <li className={styles.subsubcat}>Рации</li>
          <li className={styles.subsubcat}>Стационарные</li>
        </ul>
      ) : null}
    </li>
  );
};

export default function TradingPlatform(props) {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryHorizontal, setCategoryHorizontal] = useState("Любая категория");
  const [location, setLocation] = useState("Москва и Московская область");
  const [withPhotos, setWithPhotos] = useState(false);
  const [buySellMode, setBuySellMode] = useState("Куплю");
  const [productNew, setProductNew] = useState(false);
  const [productUsed, setProductUsed] = useState(false);

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

  const categories = [
    "Любая категория",
    "Личные вещи",
    "Транспорт",
    "Работа",
    "Для дома и дачи",
    "Недвижимость",
    "Животные",
    "Электроника",
    "Автозапчасти и аксессуары",
  ];

  const DropdownList = ({ objects, value, setValue, className = "" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <div className={styles.dropdownWrap + " " + className}>
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
        {!category ? (
          <div className={styles.categories}>
            <span className={styles.categoriesHeader}>Категории</span>

            <div className={styles.form_radio} onClick={() => setCategory("Личные вещи")}>
              <input id='category-1' className={styles.radio} type='radio' name='category' value='Личные вещи' />
              <label htmlFor='category-1'>Личные вещи</label>
            </div>

            <div className={styles.form_radio} onClick={() => setCategory("Транспорт")}>
              <input id='category-2' className={styles.radio} type='radio' name='category' value='Транспорт' />
              <label htmlFor='category-2'>Транспорт</label>
            </div>

            <div className={styles.form_radio} onClick={() => setCategory("Работа")}>
              <input id='category-3' className={styles.radio} type='radio' name='category' value='Работа' />
              <label htmlFor='category-3'>Работа</label>
            </div>

            <div className={styles.form_radio} onClick={() => setCategory("Для дома и дачи")}>
              <input id='category-4' className={styles.radio} type='radio' name='category' value='Для дома и дачи' />
              <label htmlFor='category-4'>Для дома и дачи</label>
            </div>

            <div className={styles.form_radio} onClick={() => setCategory("Недвижимость")}>
              <input id='category-5' className={styles.radio} type='radio' name='category' value='Недвижимость' />
              <label htmlFor='category-5'>Недвижимость</label>
            </div>
            <div className={styles.form_radio} onClick={() => setCategory("Животные")}>
              <input id='category-6' className={styles.radio} type='radio' name='category' value='Животные' />
              <label htmlFor='category-6'>Животные</label>
            </div>
            <div className={styles.form_radio} onClick={() => setCategory("Электроника")}>
              <input id='category-7' className={styles.radio} type='radio' name='category' value='Электроника' />
              <label htmlFor='category-7'>Электроника</label>
            </div>
            <div className={styles.form_radio} onClick={() => setCategory("Автозапчасти и аксессуары")}>
              <input id='category-8' className={styles.radio} type='radio' name='category' value='Автозапчасти и аксессуары' />
              <label htmlFor='category-8'>Автозапчасти и аксессуары</label>
            </div>
          </div>
        ) : (
          <div>
            <span className={styles.categoriesHeader}>{category}</span>
            <ul className={styles.subcategories}>
              <SubcategoryItem name='Телефоны' />
              <SubcategoryItem name='Аудио и видео' />
              <SubcategoryItem name='Товары для компьютера' />
              <SubcategoryItem name='Игры, приставки' />
              <SubcategoryItem name='Фототехника' />
              <SubcategoryItem name='Планшеты, ноутбуки' />
              <SubcategoryItem name='Оргтехника, расходники' />
            </ul>
            <div className={styles.filterWrap}>
              <span className={styles.filterBlockName}>Состояние</span>
              <label htmlFor='withAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='withAccommodation'
                  className={productNew ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setProductNew(!productNew);
                  }}></div>
                <span className={styles.filterNameWithHeader}>Новое</span>
              </label>
              <label htmlFor='withoutAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='withoutAccommodation'
                  className={productUsed ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setProductUsed(!productUsed);
                  }}></div>
                <span className={styles.filterNameWithHeader}>б/у</span>
              </label>
            </div>
            <div className={styles.filterWrap}>
              <span className={styles.filterBlockName}>Цена, ₽</span>
              <div className={styles.priceRange}>
                <div className={styles.price}>
                  <span>от</span>
                  <input />
                </div>
                <div className={styles.price}>
                  <span>до</span>
                  <input />
                </div>
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <button className={styles.submitBtn}>Показать объявления</button>
              <span className={styles.cancelBtn}>Сбросить фильтр</span>
            </div>
          </div>
        )}
        <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} />
      </aside>
      <div className={styles.container}>
        <Link href='/trading-platform/new'>
          <div className={styles.createAdBtn}>
            <span>+</span>
            <span>Разместить объявление</span>
          </div>
        </Link>
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
        <div className={styles.breadcrumbs}>
          <span>Главная</span>
          <span>Торговая площадка </span>
          {category ? (
            <>
              <span>{category}</span>
              <span>Телефоны, смартфоны, рации в Москве</span>
            </>
          ) : null}
        </div>

        {category ? (
          <DropdownList objects={["Куплю", "Продам"]} value={buySellMode} setValue={setBuySellMode} className={styles.buySell} />
        ) : (
          <div className={scrollPosition < 80 ? styles.filtersFixed : styles.filtersFixed + " " + styles.offset}>
            <div className={styles.filters}>
              <DropdownList objects={categories} value={categoryHorizontal} setValue={setCategoryHorizontal} />

              <input className={styles.filtersInput} placeholder='Поиск по объявлениям' />
              <DropdownList
                objects={["Москва и Московская область", "Ленинград и Ленинградская область", "Свердловск и Свердловская область"]}
                value={location}
                setValue={setLocation}
              />
              <button className={styles.findBtn} onClick={() => console.log(scrollPosition)}>
                Найти
              </button>
            </div>
            <div className={styles.filterOptions}>
              <label htmlFor='withPhotos' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='withPhotos'
                  className={withPhotos ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setWithPhotos(!withPhotos);
                  }}></div>
                <span className={styles.filterNameWithHeader}>Только с фото</span>
              </label>
            </div>
          </div>
        )}
        <div className={styles.productsBlock}>
          <div className={styles.productsHeader}>Рекомендуем для вас</div>
          <div className={styles.productsWrap}>
            <ProductCard isPaidAd /> <ProductCard isVip /> <ProductCard /> <ProductCard /> <ProductCard /> <ProductCard /> <ProductCard />{" "}
            <ProductCard /> <ProductCard /> <ProductCard /> <ProductCard /> <ProductCard />
          </div>
        </div>
      </div>
    </LayoutLoggedIn>
  );
}
