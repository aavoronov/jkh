import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToggleSwitch from "../../components/ToggleSwitch";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import { RotatingLines } from "react-loader-spinner";

import { useDropzone } from "react-dropzone";
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

import styles from "./new.module.scss";
import { objectList, servicesList, portfolio, mastersData } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";

const categories = [
  // "Любая категория",
  "Личные вещи",
  "Транспорт",
  "Работа",
  "Для дома и дачи",
  "Недвижимость",
  "Животные",
  "Электроника",
  "Автозапчасти и аксессуары",
];

const adTypes = ["Продаю свое", "Покупаю свое", "Покупаю ваше", "Продаю ваше"];

export default function Product(props) {
  const [category, setCategory] = useState(null);
  const [sectionToDisplay, setSectionToDisplay] = useState("1");
  const [adName, setAdName] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [condition, setCondition] = useState("");
  const [adType, setAdType] = useState(adTypes[0]);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [promotion, setPromotion] = useState("");
  const [promotionSecondary, setPromotionSecondary] = useState("");
  const [promotionPrimaryPrice, setPromotionPrimaryPrice] = useState(0);
  const [promotionSecondaryPrice, setPromotionSecondaryPrice] = useState(0);

  const [promoPrimary, setPromoPrimary] = useState({ type: "", price: 0 });
  const [promoSecondary, setPromoSecondary] = useState({ type: "", price: 0 });

  const router = useRouter();

  const { height, width } = useWindowDimensions();

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

  const [files, setFiles] = useState([]);
  const Dropzone = () => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        "image/*": [],
      },
      onDrop: (acceptedFiles) => {
        setFiles(
          files
            .concat(
              acceptedFiles.map((file) =>
                Object.assign(file, {
                  preview: URL.createObjectURL(file),
                })
              )
            )
            .slice(0, 10)
        );
        setIsDraggedOver(false);
      },
      onDragOver: () => {
        setIsDraggedOver(true);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      maxFiles: 10,
      maxSize: 3000000,
      multiple: true,
    });
    // const { getRootProps, getInputProps } = useDropzone({ maxFiles: 10, maxSize: 3000000, multiple: true, onDrop });

    const removeFile = (file) => {
      const newFiles = [...files];
      newFiles.splice(newFiles.indexOf(file), 1);
      setFiles(newFiles);
      console.log(files);
    };

    const removeAll = () => {
      setFiles([]);
    };

    const thumbs = files.map((file) => (
      <div
        className={styles.thumb}
        // key={file.name}
        key={Math.random().toString()}>
        <div className={styles.thumbInner}>
          <img
            src={file.preview}
            className={styles.img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
          <button
            className={styles.imageRemove}
            onClick={() => {
              removeFile(file);
            }}></button>
          <span className={styles.fileName}>{file.name}</span>
        </div>
      </div>
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    return (
      <aside className={styles.thumbsContainer}>
        {thumbs}
        {files.length < 10 ? (
          <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
            <input {...getInputProps()} />
            {/* <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
          <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p> */}
          </div>
        ) : null}
      </aside>
    );
  };

  const finalData = {
    category: category,
    subcategory: subcategory,
    adName: adName,
    adType: adType,
    description: description,
    files: files,
    video: video,
    address: address,
    phone: phone,
    price: price,
    promo: promoPrimary,
    additional: promoSecondary,
  };

  return (
    <LayoutLoggedIn>
      <div className={styles.container}>
        {sectionToDisplay == "1" ? (
          <>
            <h1 className={styles.pageHeader}>Размещение объявления</h1>
            <div className={styles.section + " " + styles.section1}>
              <div className={styles.categories}>
                <span className={styles.categoriesHeader}>Выберите категорию</span>

                {/* {categories.map((item, idx) => {
                  return (
                    <div className={styles.form_radio} onClick={() => setCategory(item)} key={idx}>
                      <input
                        id={`category-${idx}`}
                        className={styles.radio}
                        type='radio'
                        name='category'
                        value={item}
                        checked={category === { item }}
                        onChange={(event) => console.log(event.target.checked)}
                      />
                      <label htmlFor={`category-${idx}`}>{item}</label>
                    </div>
                  );
                })} */}

                <div className={styles.form_radio} onClick={() => setCategory("Личные вещи")}>
                  <input
                    id='category-1'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Личные вещи'
                    checked={category == "Личные вещи"}
                  />
                  <label htmlFor='category-1'>Личные вещи</label>
                </div>

                <div className={styles.form_radio} onClick={() => setCategory("Транспорт")}>
                  <input
                    id='category-2'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Транспорт'
                    checked={category == "Транспорт"}
                  />
                  <label htmlFor='category-2'>Транспорт</label>
                </div>

                <div className={styles.form_radio} onClick={() => setCategory("Работа")}>
                  <input
                    id='category-3'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Работа'
                    checked={category == "Работа"}
                  />
                  <label htmlFor='category-3'>Работа</label>
                </div>

                <div className={styles.form_radio} onClick={() => setCategory("Для дома и дачи")}>
                  <input
                    id='category-4'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Для дома и дачи'
                    checked={category == "Для дома и дачи"}
                  />
                  <label htmlFor='category-4'>Для дома и дачи</label>
                </div>

                <div className={styles.form_radio} onClick={() => setCategory("Недвижимость")}>
                  <input
                    id='category-5'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Недвижимость'
                    checked={category == "Недвижимость"}
                  />
                  <label htmlFor='category-5'>Недвижимость</label>
                </div>
                <div className={styles.form_radio} onClick={() => setCategory("Животные")}>
                  <input
                    id='category-6'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Животные'
                    checked={category == "Животные"}
                  />
                  <label htmlFor='category-6'>Животные</label>
                </div>
                <div className={styles.form_radio} onClick={() => setCategory("Электроника")}>
                  <input
                    id='category-7'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Электроника'
                    checked={category == "Электроника"}
                  />
                  <label htmlFor='category-7'>Электроника</label>
                </div>
                <div className={styles.form_radio} onClick={() => setCategory("Автозапчасти и аксессуары")}>
                  <input
                    id='category-8'
                    className={styles.radio}
                    type='radio'
                    name='category'
                    value='Автозапчасти и аксессуары'
                    checked={category == "Автозапчасти и аксессуары"}
                  />
                  <label htmlFor='category-8'>Автозапчасти и аксессуары</label>
                </div>
              </div>

              <span
                className={styles.cancelBtn}
                onClick={() => {
                  router.push("/trading-platform");
                }}>
                Отменить
              </span>
              <button
                type='button'
                className={category ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
                onClick={() => {
                  category && setSectionToDisplay("2");
                }}>
                Продолжить
              </button>
            </div>
          </>
        ) : null}

        {sectionToDisplay == "2" ? (
          <div className={styles.section + " " + styles.section2}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>{category}</span>
            <span className={styles.categoriesHeader}>Параметры</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='adName' className={styles.fieldName}>
                Название объявления
              </label>
              <input
                name='adName'
                type='text'
                placeholder=''
                className={styles.field}
                value={adName}
                onChange={(e) => {
                  setAdName(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>
            <div className={styles.fieldWrap}>
              <label htmlFor='adSubcategory' className={styles.fieldName}>
                Категория товара
              </label>
              <input
                name='adSubcategory'
                type='text'
                placeholder=''
                className={styles.field}
                value={subcategory}
                onChange={(e) => {
                  setSubcategory(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>
            <span
              className={styles.cancelBtn}
              onClick={() => {
                setSectionToDisplay("1");
              }}>
              Вернуться
            </span>
            <button
              type='button'
              className={subcategory && adName ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
              onClick={() => {
                category && setSectionToDisplay("3");
              }}>
              Продолжить
            </button>
          </div>
        ) : null}

        {sectionToDisplay == "3" ? (
          <div className={styles.section + " " + styles.section3}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>
              {category} / {subcategory}
            </span>
            <span className={styles.categoriesHeader}>Параметры</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='adName' className={styles.fieldName}>
                Название объявления
              </label>
              <input
                name='adName'
                type='text'
                placeholder=''
                className={styles.field}
                value={adName}
                onChange={(e) => {
                  setAdName(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>
            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Состояние</span>

              <div className={styles.form_radio} onClick={() => setCondition("Состояние нового")}>
                <input
                  id='condition-1'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='Состояние нового'
                  checked={condition == "Состояние нового"}
                />
                <label htmlFor='condition-1'>Состояние нового</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("Отличное состояние")}>
                <input
                  id='condition-2'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='Отличное состояние'
                  checked={condition == "Отличное состояние"}
                />
                <label htmlFor='condition-2'>Отличное состояние</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("Хорошее состояние")}>
                <input
                  id='condition-3'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='Хорошее состояние'
                  checked={condition == "Хорошее состояние"}
                />
                <label htmlFor='condition-3'>Хорошее состояние</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("Удовлетворительное состояние")}>
                <input
                  id='condition-4'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='Удовлетворительное состояние'
                  checked={condition == "Удовлетворительное состояние"}
                />
                <label htmlFor='condition-4'>Удовлетворительное состояние</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("Требуется ремонт")}>
                <input
                  id='condition-5'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='Требуется ремонт'
                  checked={condition == "Требуется ремонт"}
                />
                <label htmlFor='condition-5'>Требуется ремонт</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("На запчасти")}>
                <input
                  id='condition-6'
                  className={styles.radio}
                  type='radio'
                  name='condition'
                  value='На запчасти'
                  checked={condition == "На запчасти"}
                />
                <label htmlFor='condition-6'>На запчасти</label>
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Вид объявления</span>
              <DropdownList objects={adTypes} value={adType} setValue={setAdType} />
            </div>
            <span className={styles.categoriesHeader}>Подробности</span>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Описание</span>
              <textarea
                name='description'
                maxLength={1500}
                rows={10}
                resize='none'
                type='text'
                placeholder='Введите описание товара'
                className={styles.field + " " + styles.textarea + " " + styles.complaintComment}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Фотографии (не более 10)</span>
              <Dropzone />
            </div>

            <div className={styles.fieldWrap}>
              <label htmlFor='video' className={styles.fieldName}>
                Ссылка на видео
              </label>
              <input
                name='video'
                type='text'
                placeholder='Укажите ссылку на видео'
                className={styles.field}
                value={video}
                onChange={(e) => {
                  setVideo(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>

            <span className={styles.categoriesHeader}>Место сделки</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Адрес
              </label>
              <input
                name='address'
                type='text'
                placeholder='Укажите адрес сделки'
                className={styles.field}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>

            <span className={styles.categoriesHeader}>Условия сделки</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='price' className={styles.fieldName}>
                Цена, ₽
              </label>
              <input
                name='price'
                type='text'
                placeholder='Укажите цену'
                className={styles.field}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>

            <span className={styles.categoriesHeader}>Контакты</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='phone' className={styles.fieldName}>
                Телефон
              </label>
              <input
                name='phone'
                type='text'
                placeholder='Укажите цену'
                className={styles.field}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  console.log(e.target);
                }}
              />
            </div>

            <span
              className={styles.cancelBtn}
              onClick={() => {
                setSectionToDisplay("2");
              }}>
              Вернуться
            </span>
            <button
              type='button'
              className={
                adName && condition && description && files.length && address && price && phone
                  ? styles.submitBtn
                  : styles.submitBtn + " " + styles.disabled
              }
              onClick={() => {
                adName && condition && description && files.length && address && price && phone && setSectionToDisplay("4");
              }}>
              Продолжить
            </button>
          </div>
        ) : null}
        {sectionToDisplay == "4" ? (
          <div className={styles.section + " " + styles.section3}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>
              {category} / {subcategory}
            </span>
            <span className={styles.categoriesHeader}>Услуги продвижения</span>
            <div className={styles.fieldWrap + " " + styles.promoWrap}>
              <div
                className={
                  promoPrimary.type == "Без продвижения"
                    ? styles.form_radio + " " + styles.promotionItem + " " + styles.checked
                    : styles.form_radio + " " + styles.promotionItem
                }
                onClick={() => {
                  setPromoPrimary({ type: "Без продвижения", price: 0 });
                }}>
                <input
                  id='promotion-1'
                  className={styles.radio}
                  type='radio'
                  name='promotion'
                  value='Без продвижения'
                  checked={promoPrimary.type == "Без продвижения"}
                />
                <label htmlFor='promotion-1'></label>
                <span className={styles.promoName}>Без продвижения</span>

                <span className={styles.promoDesc}>Объявление будет тонуть</span>
                <span className={styles.promoPrice}>0 ₽</span>
              </div>

              <div
                className={
                  promoPrimary.type == "На три дня"
                    ? styles.form_radio + " " + styles.promotionItem + " " + styles.checked
                    : styles.form_radio + " " + styles.promotionItem
                }
                onClick={() => {
                  setPromoPrimary({ type: "На три дня", price: 500 });
                }}>
                <input
                  id='promotion-2'
                  className={styles.radio}
                  type='radio'
                  name='promotion'
                  value='На три дня'
                  checked={promoPrimary.type == "На три дня"}
                />
                <label htmlFor='promotion-2'></label>
                <span className={styles.promoName}>На 3 дня</span>

                <span className={styles.promoDesc}>Три дня показа в топе</span>
                <span className={styles.promoPrice}>500 ₽</span>
              </div>

              <div
                className={
                  promoPrimary.type == "На 7 дней"
                    ? styles.form_radio + " " + styles.promotionItem + " " + styles.checked
                    : styles.form_radio + " " + styles.promotionItem
                }
                onClick={() => {
                  setPromoPrimary({ type: "На 7 дней", price: 1000 });
                }}>
                <input
                  id='promotion-3'
                  className={styles.radio}
                  type='radio'
                  name='promotion'
                  value='На 7 дней'
                  checked={promoPrimary.type == "На 7 дней"}
                />
                <label htmlFor='promotion-3'></label>
                <span className={styles.promoName}>На 7 дней</span>

                <span className={styles.promoDesc}>Неделю показа в топе</span>
                <span className={styles.promoPrice}>1000 ₽</span>
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Дополнительно</span>

              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Выделить лейблом VIP");
                  // setPromotionSecondaryPrice(500);
                  setPromoSecondary({ type: "Выделить лейблом VIP", price: 500 });
                }}>
                <input
                  id='promotionSecondary-1'
                  className={styles.radio}
                  type='radio'
                  name='promotionSecondary'
                  value='Выделить лейблом VIP'
                  checked={promoSecondary.type == "Выделить лейблом VIP"}
                />
                <label htmlFor='promotionSecondary-1'>Выделить лейблом VIP</label> <span className={styles.price}>500 ₽</span>
              </div>
              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Цвет рамки объявления красная");
                  // setPromotionSecondaryPrice(500);
                  setPromoSecondary({ type: "Цвет рамки объявления красная", price: 500 });
                }}>
                <input
                  id='promotionSecondary-2'
                  className={styles.radio}
                  type='radio'
                  name='promotionSecondary'
                  value='Цвет рамки объявления красная'
                  checked={promoSecondary.type == "Цвет рамки объявления красная"}
                />
                <label htmlFor='promotionSecondary-2'>Цвет рамки объявления красная</label>
                <span className={styles.price}>500 ₽</span>
              </div>
              <div
                className={styles.form_radio}
                onClick={() => {
                  // setPromotionSecondary("Без услуг продвижения");
                  // setPromotionSecondaryPrice(0);
                  setPromoSecondary({ type: "Без услуг продвижения", price: 0 });
                }}>
                <input
                  id='promotionSecondary-3'
                  className={styles.radio}
                  type='radio'
                  name='promotionSecondary'
                  value='Без услуг продвижения'
                  checked={promoSecondary.type == "Без услуг продвижения"}
                />
                <label htmlFor='promotionSecondary-3'>Без услуг продвижения</label>
                <span className={styles.price}>0 ₽</span>
              </div>
              <span className={styles.categoriesHeader}>
                Итого за продвижение <span className={styles.price}>{promoPrimary.price + promoSecondary.price} ₽</span>
              </span>
            </div>

            <button
              type='button'
              className={promoPrimary.type && promoSecondary.type ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
              onClick={() => {
                alert(JSON.stringify(finalData, null, 2));
                router.push("/trading-platform");
              }}>
              Продолжить
            </button>
            <span
              className={styles.cancelBtn}
              onClick={() => {
                confirm("Отменить создание объявления? Данные будут утеряны" && router.push("/trading-platform"));
              }}>
              Отменить
            </span>
          </div>
        ) : null}
      </div>
    </LayoutLoggedIn>
  );
}
