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
      // router.push("/trading-platform");
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

            // const file = new File([`${base64}`], "test.jpg");
            // console.log(file);
            // product.append("files", file);
            // const testfile = new File(
            //   [
            //     "data:image/jpeg;base64,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",
            //   ],
            //   "test123.jpg"
            // );
            // product.append("files", testfile);
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

    const thumbs = files.map((file) => (
      <div
        className={styles.thumb}
        // key={file.name}
        key={Math.random().toString()}>
        <div className={styles.thumbInner}>
          <img
            src={file.preview ?? `${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${file}`}
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
