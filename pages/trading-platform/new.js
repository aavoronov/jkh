import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import { useDropzone } from "react-dropzone";
import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";

import styles from "./new.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";

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

const adTypes = ["Продаю", "Покупаю"];

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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [hasWhatsapp, setHasWhatsapp] = useState(false);
  const [hasTelegram, setHasTelegram] = useState(false);

  const [promoPrimary, setPromoPrimary] = useState({ type: "Без продвижения", price: 0 });
  const [promoSecondary, setPromoSecondary] = useState({ type: "Выделить лейблом VIP", price: 500 });

  const router = useRouter();
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  // console.log(router.query.id);
  const productId = router.query.id;

  useEffect(() => {
    async function getProductById() {
      try {
        dispatch(loading({ visible: true }));
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/${productId}`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        const { condition, description, hasTelegram, hasWhatsapp, images, location, name, phone, price, subcategory, wts } = res.data;

        setCondition(condition);
        setDescription(description);
        setHasTelegram(hasTelegram);
        setHasWhatsapp(hasWhatsapp);
        // setFiles(images === null ? [] : images);
        setFiles([]);
        setAddress(location);
        setAdName(name);
        setPhone(phone);
        setPrice(price);
        setSelectedCategory(subcategory.category.category);
        setSelectedSubcategory(subcategory.subcategory);
        setSelectedSubcategoryId(subcategory.id);
        setAdType(wts ? adTypes[0] : adTypes[1]);
      } catch (e) {
        console.log(e);
      }
      dispatch(loading({ visible: false }));
    }
    getProductById();
    if (!!productId) {
    }
  }, []);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/categories`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });
        setCategories(res.data);
      } catch (e) {}
    }
    getCategories();
  }, []);

  async function createProduct() {
    try {
      const product = new FormData();
      product.append("name", adName);
      product.append("subcategory", selectedSubcategoryId);
      product.append("condition", condition);
      product.append("wts", adType === "Продаю");
      product.append("description", description);
      if (!!files.length) files.map((item) => product.append("files", item));
      product.append("location", address);
      product.append("price", price);
      product.append("phone", phone);
      product.append("hasWhatsapp", hasWhatsapp);
      product.append("hasTelegram", hasTelegram);
      product.append("promoPrimary", promoPrimary.type === "На 7 дней" ? 7 : promoPrimary.type === "На 3 дня" ? 3 : 0);
      product.append("isVip", promoSecondary.type === "Выделить лейблом VIP" ? true : false);
      product.append("email", email);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform`, product, {
        headers: {
          Authorization: getCookie("jkh-token"),
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      router.push("/trading-platform");
      dispatch(toggle({ text: "Объявление успешно создано", type: "success" }));
    } catch (e) {
      console.log(e);
    }
  }

  async function updateProduct() {
    try {
      const product = new FormData();
      product.append("name", adName);
      product.append("subcategory", selectedSubcategoryId);
      product.append("condition", condition);
      product.append("wts", adType === "Продаю");
      product.append("description", description);
      if (!!files.length) {
        files.map(async (item) => {
          if (typeof item === "object") {
            product.append("files", item);
          } else {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`, {
              responseType: "arraybuffer",
            });
            function _arrayBufferToBase64(buffer) {
              var binary = "";
              var bytes = new Uint8Array(buffer);
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              return window.btoa(binary);
            }
            const base64 = "data:image/jpeg;base64," + _arrayBufferToBase64(response.data);
            // console.log(base64);

            // const buffer = Buffer.from(response.data, "utf-8");
            // const blob = new Blob([buffer], { type: `image/${item.slice(item.lastIndexOf(".") + 1)}` });
            // const file = new File([buffer], `${Math.random().toString()}.${item.slice(item.lastIndexOf(".") + 1)}`, {
            //   type: `image/${item.slice(item.lastIndexOf(".") + 1)}`,
            // });
            // Object.assign(file, {
            //   preview: URL.createObjectURL(file),
            // });
            // console.log(file);
            // product.append("files", file);

            // async function urltoFile(url, filename, mimeType) {
            //   return fetch(url)
            //     .then(function (res) {
            //       return res.arrayBuffer();
            //     })
            //     .then(function (buf) {
            //       return new File([buf], filename, { mimetype: mimeType });
            //     });
            // }

            // //Usage example:
            // urltoFile(`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`, "test123.jpg", "image/jpg").then(function (
            //   file
            // ) {
            //   console.log(file);
            //   product.append("files", file);
            // });

            const url = "data:image/png;base6....";
            async function dataUrlToFile(dataUrl, fileName) {
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              return new File([blob], fileName, { type: "image/jpg" });
            }
            const file = await dataUrlToFile(`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`, "test12345.jpg");
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
            product.append("files", file);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "test1234.jpg", { type: "image/jpg" });
                Object.assign(file, {
                  preview: URL.createObjectURL(file),
                });
                product.append("files", file);
              });
          }
        });
      }

      product.append("location", address);
      product.append("price", price);
      product.append("phone", phone);
      product.append("hasWhatsapp", hasWhatsapp);
      product.append("hasTelegram", hasTelegram);
      // product.append("promoPrimary", promoPrimary.type === "На 7 дней" ? 7 : promoPrimary.type === "На 3 дня" ? 3 : 0);
      // product.append("isVip", promoSecondary.type === "Выделить лейблом VIP" ? true : false);
      product.append("email", email);

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/${productId}`, product, {
        headers: {
          Authorization: getCookie("jkh-token"),
          // "Content-Type": "application/json",
          "Content-Type": "multipart/formdata",
        },
      });
      // router.push("/trading-platform");
      dispatch(toggle({ text: "Объявление успешно обновлено", type: "success" }));
    } catch (e) {
      console.log(e);
    }
  }

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
    };

    const removeAll = () => {
      setFiles([]);
    };

    const thumbs = files.map((file) => {
      console.log(file);
      return (
        <div
          className={styles.thumb}
          // key={file.name}
          key={Math.random().toString()}>
          <div className={styles.thumbInner}>
            <img
              src={file.preview ?? `${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${file}`}
              className={styles.img}
              // Revoke data uri after image is loaded
              // onLoad={() => {
              //   URL.revokeObjectURL(file.preview);
              // }}
            />
            <button
              className={styles.imageRemove}
              onClick={() => {
                removeFile(file);
              }}></button>
            <span className={styles.fileName}>{file.name}</span>
          </div>
        </div>
      );
    });

    // useEffect(() => {
    //   // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    //   return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // }, []);

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
    <LayoutLoggedIn title='ЖКХ Консьерж - разместить объявление' description='description' keywords='keywords'>
      <div className={styles.container}>
        {sectionToDisplay == "1" ? (
          <>
            <h1 className={styles.pageHeader}>{productId ? "Редактирование объявления" : "Размещение объявления"}</h1>
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

                {categories.map((item, index) => (
                  <div className={styles.form_radio} onClick={() => setSelectedCategory(item.category)}>
                    <input
                      id={`category-${index}`}
                      className={styles.radio}
                      type='radio'
                      name='category'
                      value='Транспорт'
                      checked={selectedCategory == item.category}
                    />
                    <label htmlFor={`category-${index}`}>{item.category}</label>
                  </div>
                ))}
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
                className={selectedCategory ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
                onClick={() => {
                  selectedCategory && setSectionToDisplay("2");
                  // console.log(
                  //   categories.filter((item) => item.category === selectedCategory)[0].subcategory.map((item) => item.subcategory)
                  // );
                }}>
                Продолжить
              </button>
            </div>
          </>
        ) : null}

        {sectionToDisplay == "2" ? (
          <div className={styles.section + " " + styles.section2}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>{selectedCategory}</span>
            <span className={styles.categoriesHeader}>Параметры</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='adName' className={styles.fieldName}>
                Название объявления*
              </label>
              <input
                name='adName'
                type='text'
                placeholder=''
                className={styles.field}
                value={adName}
                onChange={(e) => {
                  setAdName(e.target.value);
                }}
              />
            </div>
            {/* <div className={styles.fieldWrap}>
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
                }}
              />
            </div> */}
            <div className={styles.fieldWrap}>
              <label htmlFor='adName' className={styles.fieldName}>
                Категория*
              </label>
              <DropdownList
                objects={categories.filter((item) => item.category === selectedCategory)[0].subcategory.map((item) => item.subcategory)}
                value={selectedSubcategory}
                setValue={setSelectedSubcategory}
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
              className={selectedSubcategory && adName ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
              onClick={() => {
                const id = categories
                  .filter((item) => item.category === selectedCategory)[0]
                  .subcategory.filter((item) => selectedSubcategory === item.subcategory)[0].id;
                if (selectedSubcategory && adName) {
                  setSelectedSubcategoryId(id);
                  setSectionToDisplay("3");
                }
              }}>
              Продолжить
            </button>
          </div>
        ) : null}

        {sectionToDisplay == "3" ? (
          <div className={styles.section + " " + styles.section3}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>
              {selectedCategory} / {selectedSubcategory}
            </span>
            <span className={styles.categoriesHeader}>Параметры</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='adName' className={styles.fieldName}>
                Название объявления*
              </label>
              <input
                name='adName'
                type='text'
                placeholder=''
                className={styles.field}
                value={adName}
                onChange={(e) => {
                  setAdName(e.target.value);
                }}
              />
            </div>
            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Состояние*</span>

              {[
                "Состояние нового",
                "Отличное состояние",
                "Хорошее состояние",
                "Удовлетворительное состояние",
                "Требуется ремонт",
                "На запчасти",
              ].map((item, index) => (
                <div className={styles.form_radio} onClick={() => setCondition(index)}>
                  <input
                    id={`condition-${index}`}
                    className={styles.radio}
                    type='radio'
                    name='condition'
                    value={item}
                    checked={condition === index}
                  />
                  <label htmlFor={`condition-${index}`}>{item}</label>
                </div>
              ))}
            </div>
            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Вид объявления*</span>
              <DropdownList objects={adTypes} value={adType} setValue={setAdType} />
            </div>
            <span className={styles.categoriesHeader}>Подробности</span>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Описание*</span>
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
                }}
              />
            </div>

            <div className={styles.fieldWrap}>
              <span className={styles.fieldName}>Фотографии (не более 10)</span>
              <Dropzone />
            </div>

            {/* <div className={styles.fieldWrap}>
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
            </div> */}

            <span className={styles.categoriesHeader}>Место сделки</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='address' className={styles.fieldName}>
                Адрес*
              </label>
              <input
                name='address'
                type='text'
                placeholder='Укажите адрес сделки'
                className={styles.field}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>

            <span className={styles.categoriesHeader}>Условия сделки</span>

            <div className={styles.fieldWrap}>
              <label
                htmlFor='price'
                className={styles.fieldName}
                onClick={() => {
                  const re = /^[0-9\b]+$/;
                }}>
                Цена, ₽*
              </label>

              <input
                name='price'
                type='text'
                placeholder='Укажите цену'
                className={styles.field}
                value={price}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setPrice(e.target.value);
                  }
                }}
              />
            </div>

            <span className={styles.categoriesHeader}>Контакты</span>

            <div className={styles.fieldWrap}>
              <label htmlFor='phone' className={styles.fieldName}>
                Телефон*
              </label>
              <InputMask
                className={styles.field}
                mask='+7 (999) 999-99-99'
                value={phone}
                onChange={(event) => {
                  // setPhone(val);
                  setPhone(event.target.value);
                }}
              />
              {/* <input
                name='phone'
                type='text'
                placeholder='Укажите номер телефона'
                className={styles.field}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              /> */}
            </div>

            <div className={styles.fieldWrap}>
              <label htmlFor='messenger' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='messenger'
                  className={hasWhatsapp ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setHasWhatsapp((prev) => !prev);
                  }}></div>
                <span
                  className={styles.filterNameWithHeader}
                  onClick={() => {
                    setHasWhatsapp((prev) => !prev);
                  }}>
                  Можно связаться в WhatsApp
                </span>
              </label>

              <label htmlFor='messenger' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='messenger'
                  className={hasTelegram ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setHasTelegram((prev) => !prev);
                  }}></div>
                <span
                  className={styles.filterNameWithHeader}
                  onClick={() => {
                    setHasTelegram((prev) => !prev);
                  }}>
                  Можно связаться в Telegram
                </span>
              </label>
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
              className={adName && description && address && price && phone ? styles.submitBtn : styles.submitBtn + " " + styles.disabled}
              onClick={() => {
                if (adName && description && address && price && phone) {
                  productId ? updateProduct() : setSectionToDisplay("4");
                  // updateProduct()
                }
              }}>
              {productId ? "Сохранить" : "Продолжить"}
            </button>
          </div>
        ) : null}
        {sectionToDisplay == "4" ? (
          <div className={styles.section + " " + styles.section3}>
            <span className={styles.category}>Категория</span>
            <span className={styles.categoryValue}>
              {selectedCategory} / {selectedSubcategory}
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
                  promoPrimary.type == "На 3 дня"
                    ? styles.form_radio + " " + styles.promotionItem + " " + styles.checked
                    : styles.form_radio + " " + styles.promotionItem
                }
                onClick={() => {
                  setPromoPrimary({ type: "На 3 дня", price: 500 });
                }}>
                <input
                  id='promotion-2'
                  className={styles.radio}
                  type='radio'
                  name='promotion'
                  value='На 3 дня'
                  checked={promoPrimary.type == "На 3 дня"}
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
              {/* <div
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
              </div> */}
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
                alert(`К оплате ${promoPrimary.price + promoSecondary.price}`);
                // alert(JSON.stringify(finalData, null, 2));
                createProduct();
              }}>
              Продолжить
            </button>
            <span
              className={styles.cancelBtn}
              onClick={() => {
                confirm("Отменить создание объявления? Данные будут утеряны") && router.push("/trading-platform");
              }}>
              Отменить
            </span>
          </div>
        ) : null}
      </div>
    </LayoutLoggedIn>
  );
}
