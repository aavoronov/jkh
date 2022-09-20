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

import styles from "./add-chat.module.scss";
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

  const [activeObject, setActiveObject] = useState(objectList[0]);
  const [notify, setNotify] = useState(true);

  const router = useRouter();

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

  const data = objectList;

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
      maxFiles: 1,
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

    // return (
    //   <div {...getRootProps()} className={styles.dragndropWrap}>
    //     <div className={styles.dragndropField}>
    //       <input {...getInputProps()} />
    //       <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
    //       <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p>
    //     </div>
    //   </div>
    // );

    return (
      <section className={styles.dragndropWrap}>
        {!files.length ? (
          <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
            <input {...getInputProps()} />
            {/* <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
          <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p> */}
          </div>
        ) : null}
        {files.length ? <aside className={styles.thumbsContainer}>{thumbs}</aside> : null}
      </section>
    );
  };

  return (
    <LayoutLoggedIn>
      <div className={styles.container}>
        <div className={styles.entireThingWrap}>
          <h1 className={styles.pageHeader}>Регистрация в чате</h1>

          <Formik
            initialValues={{
              nickname: "",
            }}
            validationSchema={Yup.object({
              nickname: Yup.string().min(5, "Не короче пяти символов").required("Обязательное поле"),
            })}
            onSubmit={(values) => {
              values.object = activeObject;
              values.profilePic = files;
              values.notify = notify;
              // values.files = files;
              // values.sendToModerator = sendToModerator;
              alert(JSON.stringify(values, null, 2));
              router.push("/chat");
            }}>
            <Form className={styles.formWrap}>
              <div className={styles.fieldWrap}>
                <label htmlFor='category' className={styles.fieldName}>
                  Выберите адрес объекта
                </label>
                <DropdownList objects={data} value={activeObject} setValue={setActiveObject} />
              </div>
              <div className={styles.fieldWrap}>
                <label htmlFor='nickname' className={styles.fieldName}>
                  Укажите как вас отображать в чате
                </label>
                <Field name='nickname' type='text' placeholder='Введите имя / никнейм' className={styles.field} />
                <span className={styles.errorText}>
                  <ErrorMessage name='nickname' />
                </span>
              </div>

              <div className={styles.fieldWrap}>
                <label htmlFor='photos' className={styles.fieldName + " " + styles.center}>
                  Добавьте аватарку
                </label>
                <Dropzone />
              </div>
              <div className={styles.fieldWrap}>
                {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
                <label htmlFor='notify' className={styles.fieldName + " " + styles.checkboxWrap}>
                  <div
                    name='notify'
                    id='notify'
                    type='checkbox'
                    onClick={() => {
                      setNotify(!notify);
                    }}
                    className={notify ? styles.checkbox + " " + styles.checked : styles.checkbox}></div>
                  <span>Показывать уведомления</span>
                </label>
              </div>

              <div className={styles.fieldWrap}>
                <button type='submit' className={styles.submitBtn}>
                  Зарегистрироваться
                </button>
                <span
                  className={styles.cancelBtn}
                  onClick={() => {
                    router.push("/chat");
                  }}>
                  Отменить
                </span>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </LayoutLoggedIn>
  );
}
