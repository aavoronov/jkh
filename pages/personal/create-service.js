import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import { useDropzone } from "react-dropzone";

import LayoutPersonal from "../../components/LayoutPersonal";

export default function Profile({}) {
  const profileData = {
    photo: "/img/temp/adProfilePic.png",
    nickname: "Александр Константинович",
  };

  const [block1, setBlock1] = useState(true);
  const [chosenCategory, setChosenCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  const router = useRouter();

  // useEffect(() => {
  //   profileData.photo && setFiles(profileData.photo);
  // }, []);

  const SubcategoryItem = ({ name }) => {
    const subcategoryList = [
      "Сантехнические работы",
      "Электромонтажные работы",
      "потолки",
      "изготовление окон",
      "водоотведение",
      "Отделка деревянных домов, бань, саун",
      "Мастер на час",
      "Строительство домов и коттеджей",
      "Ремонт квартир и домов",
      "Заборы и ограждения",
    ];

    const [listIsShown, setListIsShown] = useState(false);

    const Subsubcategories = () => {
      return (
        <ul className={styles.subcategoryList}>
          {subcategoryList.map((item, idx) => (
            <li
              className={subcategories.includes(item) ? styles.subsubcat + " " + styles.checked : styles.subsubcat}
              key={idx}
              onClick={() => {
                subcategories.indexOf(item) > -1
                  ? setSubcategories(
                      subcategories
                        .slice(0, subcategories.indexOf(item))
                        .concat(subcategories.slice(subcategories.indexOf(item) + 1, subcategories.length))
                    )
                  : setSubcategories(subcategories.concat(item));
              }}>
              {item}
            </li>
          ))}
        </ul>
      );
    };

    {
      return (
        (chosenCategory == name || !chosenCategory) && (
          <li className={styles.subcategoryWrap}>
            <span
              className={chosenCategory == name ? styles.subcategoryName + " " + styles.expanded : styles.subcategoryName}
              onClick={() => {
                // setListIsShown(!listIsShown);
                setChosenCategory(chosenCategory ? null : name);
                setSubcategories([]);
                console.log(listIsShown);
              }}>
              {name}
            </span>
            {chosenCategory == name ? <Subsubcategories /> : null}
            {/* <Subsubcategories /> */}
          </li>
        )
      );
    }
  };

  const [personalPhoto, setPersonalPhoto] = useState([]);
  const [passportPhoto1, setPassportPhoto1] = useState([]);
  const [passportPhoto2, setPassportPhoto2] = useState([]);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  const Dropzone = ({ files, setFiles, portfolio = false }) => {
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
      maxFiles: portfolio ? 10 : 1,
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

    return !portfolio ? (
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
    ) : (
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

  return (
    <LayoutPersonal>
      <h1 className={styles.pageHeading + " " + styles.profile}>Размещение объявления по услуге</h1>
      {block1 ? (
        <div className={styles.createServiceWrap}>
          <span className={styles.categoriesHeader}>Выберите категорию</span>
          <ul className={styles.subcategories}>
            <SubcategoryItem name='Ремонт и строительство' />
            <SubcategoryItem name='Ремонт и установка техники' />
            <SubcategoryItem name='Ремонт авто' />
            <SubcategoryItem name='Красота' />
            <SubcategoryItem name='Перевозки и курьеры' />
            <SubcategoryItem name='Аренда' />
            <SubcategoryItem name='Организация мероприятий' />
            <SubcategoryItem name='Артисты' />
            <SubcategoryItem name='Услуги для животных' />
            <SubcategoryItem name='Разное' />
          </ul>
          <div className={styles.fieldWrap}>
            <button
              type='button'
              className={
                subcategories.length
                  ? styles.submitBtn + " " + styles.saveBtn
                  : styles.submitBtn + " " + styles.saveBtn + " " + styles.disabled
              }
              onClick={() => {
                setBlock1(false);
              }}>
              Сохранить
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.personalSection}>
            <span className={styles.createAdSubsectionHeader}>Личные данные</span>
            <div className={styles.dropzonesWrap}>
              <div className={styles.oneDropzone}>
                <span className={styles.fieldName}>Добавьте фотографию</span>
                <Dropzone files={personalPhoto} setFiles={setPersonalPhoto} />
              </div>
              <div className={styles.multipleDropzonesWrap}>
                <span className={styles.fieldName}>Добавьте скан паспорта</span>
                <div className={styles.multipleDropzones}>
                  <Dropzone files={passportPhoto1} setFiles={setPassportPhoto1} />
                  <Dropzone files={passportPhoto2} setFiles={setPassportPhoto2} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.personalSection}>
            <span className={styles.createAdSubsectionHeader}>{chosenCategory}</span>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Адрес объекта
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Бригада
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Работа по договору
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Проживание на объекте
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Гарантия на работу
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Дни работы
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Место работы
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Время работы
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Стоимость услуги, ₽
              </label>
              <input name='address' type='text' placeholder='' className={styles.field} />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Описание услуги
              </label>
              <textarea name='address' type='text' placeholder='' className={styles.field + " " + styles.textarea} />
            </div>
            <span className={styles.warningWrap}>
              <span></span>
              <span className={styles.warning}>Не более 1000 символов</span>
            </span>
            <div className={styles.portfolioWrap}>
              <Dropzone files={portfolioFiles} setFiles={setPortfolioFiles} portfolio />
            </div>
            <div className={styles.fieldWrap}>
              <button
                type='button'
                className={
                  subcategories.length
                    ? styles.submitBtn + " " + styles.saveBtn
                    : styles.submitBtn + " " + styles.saveBtn + " " + styles.disabled
                }
                onClick={() => {
                  alert("Отправлено на модерацию");
                  router.push("/services");
                }}>
                Опубликовать
              </button>
            </div>
          </div>
        </>
      )}
    </LayoutPersonal>
  );
}
