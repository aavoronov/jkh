import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./personal-sections.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import LayoutPersonal from "../../components/LayoutPersonal";
import { getGeocode } from "../../service/functions";
import { toggle } from "../../store/notificationSlice";

export default function createService({}) {
  const [categories, setCategories] = useState([]);
  const [block1, setBlock1] = useState(true);
  const [chosenCategory, setChosenCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [personalPhoto, setPersonalPhoto] = useState([]);
  const [passportPhoto1, setPassportPhoto1] = useState([]);
  const [passportPhoto2, setPassportPhoto2] = useState([]);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [brigade, setBrigade] = useState(false);
  const [contract, setContract] = useState(false);
  const [accommodation, setAccommodation] = useState(false);
  const [warranty, setWarranty] = useState(false);
  const [workDays, setWorkDays] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Частное лицо");

  const dispatch = useDispatch();

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });
        setCategories(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getCategories();
  }, []);

  const createService = async () => {
    try {
      function toggleWarning(text) {
        throw new Error(text);
      }
      if (!personalPhoto.length) toggleWarning("Добавьте фотографию");
      if (!passportPhoto1.length || !passportPhoto2.length) toggleWarning("Добавьте сканы паспорта");
      if (!address) toggleWarning("Заполните адрес");
      if (!name) toggleWarning(type === "Частное лицо" ? "Заполните имя" : "Заполните название организации");
      if (!workDays) toggleWarning("Заполните дни работы");
      if (!workLocation) toggleWarning("Заполните место работы");
      if (!workTime) toggleWarning("Заполните время работы");
      if (!price) toggleWarning("Заполните цену");
      if (!description) toggleWarning("Заполните описание");

      const { geocodedAddress, latitude, longitude, precision } = await getGeocode(address);
      if (precision !== "exact") toggleWarning("Введенный адрес не найден. Проверьте правильность введенного адреса");

      const data = new FormData();
      data.append("name", name);
      data.append("subcategory", selectedSubcategoryId);
      data.append("mainImage", personalPhoto[0]);
      data.append("passport", passportPhoto1[0]);
      data.append("passport", passportPhoto2[0]);
      data.append("isOrg", type === "Организация");
      portfolioFiles.forEach((item) => data.append("portfolio", item));
      data.append("address", geocodedAddress);
      data.append("latitude", latitude);
      data.append("longitude", longitude);
      data.append("brigade", brigade);
      data.append("contract", contract);
      data.append("accommodation", accommodation);
      data.append("warranty", warranty);
      data.append("workDays", workDays);
      data.append("workLocation", workLocation);
      data.append("workTime", workTime);
      data.append("price", price);
      data.append("description", description);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/services`, data, {
        // "Content-Type": "multipart/form-data",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: getCookie("jkh-token"),
        },
      });
      dispatch(toggle({ text: "Объявление успешно создано", type: "success" }));
    } catch (e) {
      // console.log(e);
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
    }
  };

  const router = useRouter();

  // useEffect(() => {
  //   profileData.photo && setFiles(profileData.photo);
  // }, []);

  const SubcategoryItem = ({ item }) => {
    const name = item.category;
    const subcategoryList = item.subcategory.map((item) => {
      return { id: item.id, subcategory: item.subcategory };
    });

    const [listIsShown, setListIsShown] = useState(false);

    const Subsubcategories = () => {
      return (
        <ul className={styles.subcategoryList}>
          {subcategoryList.map((item, idx) => (
            <li
              className={subcategories === item.subcategory ? styles.subsubcat + " " + styles.checked : styles.subsubcat}
              key={idx}
              // onClick={() => {
              //   subcategories.indexOf(item) > -1
              //     ? setSubcategories(
              //         subcategories
              //           .slice(0, subcategories.indexOf(item))
              //           .concat(subcategories.slice(subcategories.indexOf(item) + 1, subcategories.length))
              //       )
              //     : setSubcategories(subcategories.concat(item));
              // }}
              // onClick={() => setSubcategories(subcategories.concat(item.id))}
              onClick={() => {
                setSelectedSubcategoryId(item.id);
                setSubcategories(item.subcategory);
              }}
              // onClick={() => console.log(item.id)}
            >
              {item.subcategory}
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
      multiple: portfolio,
    });
    // const { getRootProps, getInputProps } = useDropzone({ maxFiles: 10, maxSize: 3000000, multiple: true, onDrop });

    const removeFile = (file) => {
      const newFiles = [...files];
      newFiles.splice(newFiles.indexOf(file), 1);
      setFiles(newFiles);
    };

    const removeAll = () => {
      setFiles([]);
    };

    const thumbs = files.map((file, index) => (
      <div
        className={styles.thumb}
        // key={file.name}
        key={index}>
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
          {/* <span className={styles.fileName}>{file.name}</span> */}
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
    <LayoutPersonal title='ЖКХ Консьерж - разместить объявление' description='description' keywords='keywords'>
      <h1 className={styles.pageHeading + " " + styles.profile}>Размещение объявления по услуге</h1>
      {block1 ? (
        <div className={styles.createServiceWrap}>
          <span className={styles.categoriesHeader}>Выберите категорию</span>
          <ul className={styles.subcategories}>
            {categories.map((item, index) => (
              <SubcategoryItem key={index} item={item} />
            ))}
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
            <span className={styles.createAdSubsectionHeader}>{chosenCategory + " / " + subcategories}</span>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='type' className={styles.fieldName} style={{ alignSelf: "start" }}>
                Тип исполнителя
              </label>
              <div>
                <div className={styles.form_radio}>
                  <input
                    id='type-1'
                    className={styles.radio}
                    type='radio'
                    name='type'
                    value={type}
                    onChange={() => setType("Частное лицо")}
                    checked={type === "Частное лицо"}
                  />
                  <label htmlFor='type-1'>Частное лицо</label>
                </div>

                <div className={styles.form_radio}>
                  <input
                    id='type-2'
                    className={styles.radio}
                    type='radio'
                    name='type'
                    value={type}
                    onChange={() => setType("Организация")}
                    checked={type === "Организация"}
                  />
                  <label htmlFor='type-2'>Организация</label>
                </div>
              </div>
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Адрес объекта
              </label>
              <input
                name='address'
                type='text'
                placeholder='населенный пункт, улица, дом'
                className={styles.field}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className={styles.createAdFieldWrap}>
              <label htmlFor='name' className={styles.fieldName}>
                {type === "Частное лицо" ? "Имя исполнителя" : "Название организации"}
              </label>
              <input
                name='name'
                type='text'
                placeholder=''
                className={styles.field}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.createAdFieldWrap}>
              <label htmlFor='brigade' className={styles.fieldName}>
                Бригада
              </label>
              {/* <input
                name='brigade'
                type='text'
                placeholder=''
                className={styles.field}
                value={brigade}
                onChange={(e) => setBrigade(e.target.value)}
              /> */}
              <div
                name='brigade'
                className={brigade ? styles.checkbox + " " + styles.checked : styles.checkbox}
                onClick={() => {
                  setBrigade(!brigade);
                }}></div>
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='contract' className={styles.fieldName}>
                Работа по договору
              </label>

              <div
                name='contract'
                className={contract ? styles.checkbox + " " + styles.checked : styles.checkbox}
                onClick={() => {
                  setContract(!contract);
                }}></div>
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='accommodation' className={styles.fieldName}>
                Проживание на объекте
              </label>

              <div
                name='accommodation'
                className={accommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
                onClick={() => {
                  setAccommodation(!accommodation);
                }}></div>
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='warranty' className={styles.fieldName}>
                Гарантия на работу
              </label>

              <div
                name='warranty'
                className={warranty ? styles.checkbox + " " + styles.checked : styles.checkbox}
                onClick={() => {
                  setWarranty(!warranty);
                }}></div>
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='workDays' className={styles.fieldName}>
                Дни работы
              </label>
              <input
                name='workDays'
                type='text'
                placeholder=''
                className={styles.field}
                value={workDays}
                onChange={(e) => setWorkDays(e.target.value)}
              />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='workLocation' className={styles.fieldName}>
                Место работы
              </label>
              <input
                name='workLocation'
                type='text'
                placeholder=''
                className={styles.field}
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
              />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='workTime' className={styles.fieldName}>
                Время работы
              </label>
              <input
                name='workTime'
                type='text'
                placeholder=''
                className={styles.field}
                value={workTime}
                onChange={(e) => setWorkTime(e.target.value)}
              />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='price' className={styles.fieldName}>
                Стоимость услуги, ₽
              </label>
              <input
                name='price'
                type='text'
                placeholder=''
                className={styles.field}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className={styles.createAdFieldWrap}>
              <label htmlFor='description' className={styles.fieldName}>
                Описание услуги
              </label>
              <textarea
                name='description'
                type='text'
                placeholder=''
                className={styles.field + " " + styles.textarea}
                value={description}
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
              />
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
                  // const data = {
                  //   category: chosenCategory,
                  //   subcategory: subcategories[0],
                  //   mainFile: personalPhoto[0],
                  //   passport1: passportPhoto1[0],
                  //   passport2: passportPhoto2[0],
                  //   photos: portfolioFiles,
                  //   address,
                  //   brigade,
                  //   contract,
                  //   accommodation,
                  //   warranty,
                  //   workDays,
                  //   workLocation,
                  //   workTime,
                  //   price,
                  //   description,
                  // };
                  // alert(JSON.stringify(data));
                  createService();
                  // router.push("/services");
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
