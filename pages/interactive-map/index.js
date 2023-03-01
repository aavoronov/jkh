import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "react-simple-star-rating";
import InputMask from "react-input-mask";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import LayoutMap from "../../components/LayoutMap";
import AdItem from "../../components/AdItem";
// import DropdownList from "../components/DropdownList";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";

import styles from "./map.module.scss";
import {
  YMaps,
  Map,
  Placemark,
  Button,
  ZoomControl,
  Clusterer,
  GeolocationControl,
  ObjectManager,
  withYMaps,
} from "@pbe/react-yandex-maps";

import arrowLeft from "/public/img/arrowLeft.png";
import allPlaces from "/public/img/allPlaces.png";
import objectPhoto from "/public/img/churchObjectCard.png";
import objectPhoto2 from "/public/img/churchObjectCard2.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCookie } from "cookies-next";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";

const myLoader = ({ src }) => {
  return `/_next/static/media/${src}`;
};

const zoomOptions = {
  position: { right: 30, top: 50 },
};

const geolocationOptions = {
  position: { right: 30, top: 280 },
};

const objectList = ["Москва, ул. Маяковского, д. 5, кв. 125", "Москва, ул. Другая, д. 5, кв. 125"];

// !const objectList = [
//   { address: "Москва, ул. Маяковского, д. 5, кв. 125", coordinates: [55.73, 37.55] },
//   { address: "Москва, ул. Другая, д. 5, кв. 125", coordinates: [56.296, 44.006] },
// ];

const filterList = [
  { name: "Кафе, рестораны", color: "#35BB4B", pic: "/img/food.png", key: "cafe", placemark: "img/cafeMark.png" },
  { name: "Салоны красоты", color: "#BB49CD", pic: "/img/beauty.png", key: "beauty" },
  { name: "Учебные заведения", color: "#A55114", pic: "/img/education.png", key: "education" },
  { name: "Музеи, выставки", color: "#1B6BB5", pic: "/img/museum.png", key: "museum" },
  { name: "Туалеты", color: "#09478F", pic: "/img/bathroom.png", key: "bathroom" },
  // { name: "Выгул собак", color: "#047510", pic: "/img/dog.png", key: "dog" },
  // { name: "Детские площадки", color: "#E01313", pic: "/img/horse.png", key: "horse" },
  { name: "Банки, банкоматы", color: "#254A63", pic: "/img/bank.png", key: "bank" },
  { name: "Магазины", color: "#1DAEEC", pic: "/img/shops.png", key: "shops" },
  { name: "Заправки", color: "#0E2E4B", pic: "/img/gas.png", key: "gas" },
  { name: "Храмы, церкви", color: "#1AA199", pic: "/img/church.png", key: "church" },
  // { name: "Еда", color: "#ECB21D", pic: "/img/food.png", key: "food" },
];

const getHumanFriendlyCategory = (category) => {
  return filterList.filter((item) => item.key === category)[0].name;
};

const getUglyCategory = (category) => {
  return filterList.filter((item) => item.name === category)[0].key;
};

const getObjectProperties = (item) => {
  const { object, reviews, rating, count } = item;
  return {
    // photos: [
    //   "/img/churchObjectCard.png",
    //   "/img/churchObjectCard2.png",
    //   "/img/churchObjectCard.png",
    //   "/img/churchObjectCard2.png",
    //   "/img/churchObjectCard.png",
    //   "/img/churchObjectCard2.png",
    // ],
    coordinates: object.object.point.coordinates,
    photos: object.images || ["/img/no-image.jpg"],
    id: object.objectId,
    name: object.name,
    category: object.object.category || "Категория",
    humanFriendlyCategory: getHumanFriendlyCategory(object.object.category) || "Человекочитаемая категория",
    rating: rating,
    votes: count,
    address: object.address,
    site: `http://${object.website}`,
    phoneStationary: object.phoneStationary,
    phoneMobile: object.phoneMobile,
    description: object.description || "Нет описания",
    reviews: reviews,
  };
};

const categories = filterList.map((item) => item.key);
const categoriesHumanFriendly = filterList.map((item) => item.name);

// let points = [];

// <Placemark geometry={[56.3, 38.67]} />
//           <Placemark geometry={[55.15, 36.47]} />
// const getRandomBetween = (min, max) => {
//   return Math.random() * (max - min) + min;
// };
// const getRandomInt = (max) => {
//   return Math.floor(Math.random() * max);
// };

// const seedPoints = (points) => {
//   for (let i = 0; i < 100; i++) {
//     let randomInt = getRandomInt(filterList.length);
//     let randomCategory = categories[randomInt];
//     let randomHumanFriendlyCategory = categoriesHumanFriendly[randomInt];
//     points[i] = {
//       id: i,
//       name: `Объект ${i}, ${randomCategory}`,
//       coordinates: [getRandomBetween(55.15, 56.3), getRandomBetween(36.47, 38.67)],
//       category: randomCategory,
//       humanFriendlyCategory: randomHumanFriendlyCategory,
//       address: `address ${i}`,
//     };
//     // console.log(points[i]);
//   }
// };

// seedPoints(points);

const sliderPhotos = ["/img/churchObjectCard.png", "/img/churchObjectCard2.png", "/img/churchObjectCard.png", "/img/churchObjectCard2.png"];

const getPointData = (item, index) => {
  return {
    // iconLayout: "default#image",
    // iconImageHref: item.placemark,
    // iconImageSize: [300, 82],
    // iconImageOffset: [-5, -38],
    // balloonContentBody: "placemark <strong>balloon " + index + "</strong>",
    balloonContent: item.name,
    clusterCaption: "placemark <strong>" + index + "</strong>",
  };
};

const getPointOptions = (item, index) => {
  return {
    iconLayout: "default#image",
    iconImageHref: `img/${item.category}Mark.png`,
    iconImageSize: [38, 50],
    hasBalloon: false,
    balloonContentBody: "test",
  };
};

const dataConvert = (points) => {
  let features = [];
  points &&
    points.map((item, index) => {
      let tmpObj = {
        type: "Feature",
        id: item.id,
        category: item.category,
        geometry: item.point,
        options: { iconLayout: "default#image", iconImageHref: `img/${item.category}Mark.png`, iconImageSize: [38, 50] },
      };
      return features.push(tmpObj);
    });
  return features;
};

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

export default function InteractiveMap(props) {
  const [mapWidth, setMapWidth] = useState("calc(100vw - 263px)");
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(true);
  const [dropdownValue, setDropdownValue] = useState(objectList[0]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [createObject, setCreateObject] = useState(false);
  const [chosenCategory, setChosenCategory] = useState("Выберите категорию");
  const [draggableCoords, setDraggableCoords] = useState(null);
  const [sendToModerator, setSendToModerator] = useState(false);
  const [objectInfoActive, setObjectInfoActive] = useState(null);
  const [rating, setRating] = useState(0);
  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);
  const [estateObjects, setEstateObjects] = useState([]);
  const [mapState, setMapState] = useState(null);
  const [routeDisplayed, setRouteDisplayed] = useState(false);

  const [points, setPoints] = useState([]);

  const [phoneStationary, setPhoneStationary] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const mapRef = useRef(null);

  const ThatMapThing = () => {
    const RouteBuilder = React.useMemo(() => {
      return ({ ymaps, route }) => {
        // var loadingObjectManager = new ymaps.LoadingObjectManager("//server.com/tile?bbox=%b", {
        //   // Включаем кластеризацию.
        //   clusterize: true,
        //   // Зададим опции кластерам.
        //   // Опции кластеров задаются с префиксом cluster.
        //   clusterHasBalloon: false,
        //   // Опции объектов задаются с префиксом geoObject.
        //   geoObjectOpenBalloonOnClick: false,
        // });

        React.useEffect(() => {
          let canceled = false;
          let multiRoute = null;

          if (ymaps && !!objectInfoActive) {
            // ymaps.route(route).then((route) => {
            //   if (!canceled) {
            //     setRouteLength(route.getHumanLength().replace("&#160;", " "));
            //   }
            // });
            const pointA = estateObjects.filter((item) => item.address.trim() === dropdownValue)[0].coordinates;
            const pointB = [objectInfoActive.coordinates];

            multiRoute = new ymaps.multiRouter.MultiRoute(
              {
                referencePoints: [pointA, pointB],
                params: {
                  routingMode: "pedestrian",
                },
              },
              {
                boundsAutoApply: true,
              }
            );

            mapRef.current.geoObjects.add(multiRoute);
          }

          return () => mapRef.current.geoObjects.remove(multiRoute);
        }, [ymaps, objectInfoActive]);

        return null;
      };
    }, []);

    const ConnectedRouteBuilder = React.useMemo(() => {
      return withYMaps(RouteBuilder, true, ["route"]);
    }, [RouteBuilder]);

    return (
      // <YMaps query={{ lang: "en_RU", apikey: process.env.NEXT_PUBLIC_YMAPS_KEY }}>
      <ConnectedRouteBuilder />
      // {/* </YMaps> */}
    );
  };

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getEstateObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res);
        const prepareData = () => {
          let data = [];
          res.data.forEach((item) => {
            return data.push({
              address: item.estateObject.address.split(",").slice(-2).join().trim() + ", " + item.estateObject.apartment,
              coordinates: [+item.estateObject.latitude, +item.estateObject.longitude],
            });
          });
          return data;
        };
        setEstateObjects(prepareData());
        console.log(res.data);
        setDropdownValue(res.data[0].estateObject.address.split(",").slice(-2).join().trim() + ", " + res.data[0].estateObject.apartment);
        setMapState({
          center: [res.data[0].estateObject.latitude, res.data[0].estateObject.longitude],
          zoom: 15,
          behaviors: ["default", "scrollZoom"],
          style: { height: "calc(100vh - 59px)", width: { mapWidth }, position: "relative" },
          options: { autoFitToViewport: "always" },
        });
      } catch (e) {
        console.log(e);
      }
    }
    getEstateObjects();
  }, []);

  // const mapState = {
  //   center: estateObjects[0].coordinates,
  //   zoom: 15,
  //   behaviors: ["default", "scrollZoom"],
  //   style: { height: "calc(100vh - 59px)", width: { mapWidth }, position: "relative" },
  //   options: { autoFitToViewport: "always" },
  // };

  useEffect(() => {
    // console.log(estateObjects.filter((item) => item.address === dropdownValue)[0].coordinates);
    !!mapRef.current && mapRef.current.setCenter(estateObjects.filter((item) => item.address === dropdownValue)[0].coordinates);
  }, [dropdownValue]);

  const getObjectById = async (id) => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/map-objects/${id}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      // setPoints(res.data);
      console.log(res.data);
      setObjectInfoActive(getObjectProperties(res.data));

      // dispatch(updateRole({ role: res.data.role }));
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  useEffect(() => {
    const getObjects = async () => {
      try {
        dispatch(loading({ visible: true }));
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/map-objects`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });

        setPoints(res.data);

        // dispatch(updateRole({ role: res.data.role }));
      } catch (e) {
        console.log(e);
      }
      dispatch(loading({ visible: false }));
    };
    getObjects();
  }, []);

  const createReview = async (values) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/map-objects/reviews`, values, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      setRating(0);
      dispatch(toggle({ text: "Спасибо! Отзыв отправлен на модерацию", type: "success" }));
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  };

  const createReply = async (values) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/map-objects/replies`, values, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      dispatch(toggle({ text: "Спасибо! Комментарий отправлен на модерацию", type: "success" }));
      return true;
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  };

  async function getGeocode(coordinates) {
    const res = await axios.get(
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.NEXT_PUBLIC_YMAPS_KEY}&geocode=${coordinates}`
    );
    console.log(res.data);
    //  const {data.response.GeoObjectCollection} = res
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text);
    const fullAddress = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
    const coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    const precision = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.precision;
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted);
    // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point);
    const longitude = coords.split(" ")[0];
    const latitude = coords.split(" ")[1];

    return { address: fullAddress.split(",").slice(1).join().trim(), latitude, longitude, precision };
  }

  const postObject = async (values) => {
    try {
      const {
        name,
        description,
        webPage,
        phoneMobile,
        phoneStationary,
        coordinates,
        category,
        address,
        files,
        sendToModerator,
        modComment,
      } = values;
      const object = new FormData();
      object.append("name", name);
      object.append("description", description);
      object.append("category", category);
      if (phoneStationary) object.append("phoneStationary", phoneStationary);
      if (phoneMobile) object.append("phoneMobile", phoneMobile);
      if (webPage) object.append("website", webPage);
      object.append("latitude", coordinates[0]);
      object.append("longitude", coordinates[1]);
      object.append("address", address);
      if (!!files.length) files.map((item) => object.append("files", item));
      sendToModerator ? object.append("sendToModerator", true) : object.append("sendToModerator", false);
      modComment && object.append("modComment", modComment);

      alert(JSON.stringify(object, null, 2));
      console.log(object);
      // object.append

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/map-objects`, object, {
        headers: {
          Authorization: getCookie("jkh-token"),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      dispatch(toggle({ text: "Спасибо! Объект отправлен на модерацию", type: "success" }));
      return true;
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  };

  // useEffect(() => points.length && console.log(points), [points]);

  const FilterBlock = ({ filterList }) => {
    return (
      <div className={styles.filterContainer}>
        {filterList.map((item) => (
          <div
            key={item.key}
            className={styles.filterItem}
            onClick={() => {
              setActiveFilter(item.key);
            }}>
            <div
              className={item.key == activeFilter ? styles.filterPicWrap + " " + styles.active : styles.filterPicWrap}
              style={{ borderColor: item.color }}>
              <Image
                src={item.pic}
                width={28}
                height={28}
                className={styles.filterPic}

                // loader={myLoader}
              />
            </div>
            <span className={styles.filterItemName}>{item.name}</span>
          </div>
        ))}
        <div
          className={styles.filterItem}
          onClick={() => {
            setActiveFilter("all");
          }}>
          <div
            className={styles.filterPicWrap}
            style={activeFilter === "all" ? { borderWidth: 2, borderColor: "#aaa" } : { borderWidth: 0 }}>
            <Image
              src={allPlaces}
              width={28}
              height={28}
              className={styles.filterPic}

              // loader={myLoader}
            />
          </div>
          <span className={styles.filterItemName}>Все места</span>
        </div>
      </div>
    );
  };

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };

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
        <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
          <input {...getInputProps()} />
          <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
          <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p>
        </div>
        <aside className={styles.thumbsContainer}>{thumbs}</aside>
        {/* {files.length > 0 && <button onClick={removeAll}>Удалить все</button>} */}
      </section>
    );
  };

  const closeCurrentBalloon = () => {
    let close = document.querySelector('ymaps[class$="-balloon__close-button"]');
    if (close != null) {
      close.click();
    }
    if (complaintActive) {
      setComplaintActive(false);
      return;
    }
    setObjectInfoActive(null);
    setRouteDisplayed(false);
    setRating(0);
  };

  useEffect(() => {
    setRouteDisplayed(false);
  }, [objectInfoActive]);

  const ReviewThread = ({ item }) => {
    const [isReplyActive, setIsReplyActive] = useState(false);
    const date = new Date(item.createdAt);
    return (
      <div className={styles.reviewThread}>
        <div className={styles.review}>
          <div className={styles.reviewNameWrap}>
            {item.user.profile.profilePic ? (
              <img
                className={styles.reviewProfilePic}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${item.user.profile.profilePic}`}
                // height={35}
                // width={35}
              />
            ) : (
              <span className={styles.objectLetters} style={{ backgroundColor: item.user.profile.color }}>
                {item.user.profile.pseudonym.split(" ").length > 1
                  ? item.user.profile.pseudonym.split(" ")[0][0] + item.user.profile.pseudonym.split(" ")[1][0]
                  : item.user.profile.pseudonym.slice(0, 2)}
              </span>
            )}
            <span className={styles.reviewName}>{item.user.profile.pseudonym}</span>
          </div>
          <div className={styles.reviewMeta}>
            <Rating initialValue={item.rating} readonly={true} size={11} fillColor='#FF8C00' emptyColor='#D1D3DF'></Rating>
            <span className={styles.reviewDate}>
              {date.getDate().toString().padStart(2, "0") +
                "." +
                (date.getMonth() + 1).toString().padStart(2, "0") +
                "." +
                date.getFullYear().toString()}
            </span>
          </div>
          <p className={styles.reviewText}>{item.text}</p>
          <button
            className={styles.reviewReplyBtn}
            onClick={() => {
              setIsReplyActive(!isReplyActive);
            }}>
            – ответить
          </button>
          {isReplyActive ? (
            <Formik
              initialValues={{
                reply: "",
              }}
              validationSchema={Yup.object({
                // category: Yup.string().required("Required"),
                reply: Yup.string()
                  // .max(20, "Must be 20 characters or less")
                  .required("Обязательное поле"),
              })}
              onSubmit={async (values) => {
                values.reviewId = item.id;
                // alert(JSON.stringify(values, null, 2));
                const success = await createReply(values);
                if (success) setIsReplyActive(!isReplyActive);
              }}>
              <Form>
                <Field
                  as='textarea'
                  name='reply'
                  maxLength={1500}
                  rows={10}
                  resize='none'
                  type='text'
                  placeholder='Напишите ваш ответ'
                  className={styles.field + " " + styles.textarea + " " + styles.replyField}
                />
                <div className={styles.warningWrap}>
                  <span className={styles.errorText}>
                    <ErrorMessage name='reply' />
                  </span>
                  <div>
                    <span className={styles.warning}>Не более 1000 символов</span>
                    <span className={styles.warning}>
                      Внимание: ответ можно оставить только один раз и впоследствии нельзя будет изменить.
                    </span>
                  </div>
                </div>

                <button type='submit' className={styles.reviewSubmitBtn}>
                  Отправить
                </button>
              </Form>
            </Formik>
          ) : null}
        </div>
        {item.replies.map((reply) => {
          const date = new Date(reply.createdAt);
          return (
            <div className={styles.reviewReply} key={reply.id}>
              <div className={styles.reviewNameWrap}>
                {reply.user.profile.profilePic ? (
                  <img
                    className={styles.reviewProfilePic}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${reply.user.profile.profilePic}`}
                    height={35}
                    width={35}
                  />
                ) : (
                  <span className={styles.objectLetters} style={{ backgroundColor: reply.user.profile.color }}>
                    {reply.user.profile.pseudonym.split(" ").length > 1
                      ? reply.user.profile.pseudonym.split(" ")[0][0] + reply.user.profile.pseudonym.split(" ")[1][0]
                      : reply.user.profile.pseudonym.slice(0, 2)}
                  </span>
                )}
                <span className={styles.reviewName}>{reply.user.profile.pseudonym}</span>
              </div>
              <div className={styles.reviewMeta}>
                {/* <Rating initialValue={3} readonly={true} size={11} fillColor='#FF8C00' emptyColor='#D1D3DF'></Rating> */}
                <span className={styles.reviewDate}>
                  {date.getDate().toString().padStart(2, "0") +
                    "." +
                    (date.getMonth() + 1).toString().padStart(2, "0") +
                    "." +
                    date.getFullYear().toString()}
                </span>
              </div>
              <p className={styles.reviewText}>{reply.text}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // const hasWindow = typeof window !== "undefined";
  // let width = "";
  // let height = "";

  // const [expanded, setExpanded] = useState(false);
  // useEffect(() => {
  //   width = "100px";
  //   height = "100px";
  //   console.log("test");
  // }, [expanded]);

  //   myMap.events.add('click', function() {
  //     myMap.balloon.close();
  // });

  const setMenuState = (value) => {
    setMenuIsOpen(value);
  };

  const getCenter = () => {
    if (mapRef.current) {
      console.log(mapRef.current.getCenter());
      return mapRef.current.getCenter();
    }
  };

  return (
    <LayoutMap menuIsCollapsible={true} menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}>
      {complaintActive ? (
        <>
          <div
            id={styles.overlay}
            onClick={() => {
              setComplaintError(false);
              setComplaintActive(false);
            }}></div>
          <div className={styles.complaintPopup}>
            <div
              className={styles.closeBtn}
              onClick={() => {
                setComplaintActive(false);
                setComplaintError(false);
              }}></div>
            <span className={styles.complaintHeading}>Пожаловаться на объект</span>
            <div className={styles.objectWrap}>
              <div className={styles.imageWrap}>
                <Image src={objectInfoActive.photos[0]} width={90} height={72} />
              </div>
              <div className={styles.objectInfoWrap}>
                <div className={styles.complaintCategory}>{objectInfoActive.humanFriendlyCategory}</div>
                <div className={styles.complaintName}>{objectInfoActive.name}</div>
              </div>
            </div>
            <Formik
              initialValues={{
                issue: "",
                comment: "",
              }}
              onSubmit={(values) => {
                if (values.issue == 5 && !values.comment) {
                  setComplaintError(true);
                  console.log("error");
                  return;
                }
                values.objectId = objectInfoActive.id;
                alert(JSON.stringify(values, null, 2));
                setComplaintError(false);
                setComplaintActive(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.form_radio}>
                    <Field id='radio-1' className={styles.radio} type='radio' name='issue' value='1' />
                    <label htmlFor='radio-1'>Объект отсутствует на указанном месте</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='radio-2' className={styles.radio} type='radio' name='issue' value='2' />
                    <label htmlFor='radio-2'>Не соответствует описание</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='radio-3' className={styles.radio} type='radio' name='issue' value='3' />
                    <label htmlFor='radio-3'>Не соответствуют фото</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='radio-4' className={styles.radio} type='radio' name='issue' value='4' />
                    <label htmlFor='radio-4'>Это реклама</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='radio-5' className={styles.radio} type='radio' name='issue' value='5' />
                    <label htmlFor='radio-5'>Другое</label>
                  </div>

                  {values.issue == 5 ? (
                    <div className={styles.complaintFieldWrap}>
                      <Field
                        as='textarea'
                        name='comment'
                        maxLength={1500}
                        rows={10}
                        resize='none'
                        type='text'
                        placeholder='Напишите ваш отзыв'
                        className={styles.field + " " + styles.textarea + " " + styles.complaintComment}
                      />
                      <div className={styles.warningWrap}>
                        {complaintError ? <span className={styles.errorText}>Обязательное поле</span> : null}
                        <span className={styles.warning}>Не более 1500 символов</span>
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.fieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        setComplaintError(false);
                        setComplaintActive(false);
                      }}>
                      Отменить
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : null}
      <button
        className={menuIsOpen ? styles.addObjectBtn : styles.addObjectBtn + " " + styles.toTheRight}
        onClick={() => {
          setCreateObject((prev) => !prev);
        }}>
        <span className={styles.addObjectHint}>Добавить объект на карту</span>
      </button>
      <button className={menuIsOpen ? styles.mapOptionsBtn : styles.mapOptionsBtn + " " + styles.toTheRight}>
        <div className={styles.mapOptionsMenu}>
          <span className={styles.mapOptionsItem}>Показать установленные объекты</span>
          <span className={styles.mapOptionsItem}>Показать предложенные объекты</span>
        </div>
      </button>
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YMAPS_KEY }}>
        {width < 769 ? (
          <button
            className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
            onClick={() => {
              setLeftMenuIsOpen(!leftMenuIsOpen);
            }}>
            <Image src={arrowLeft} alt='' width={14} height={31} />
          </button>
        ) : null}
        <Map
          modules={["multiRouter.MultiRoute"]}
          instanceRef={(ref) => {
            if (ref) mapRef.current = ref;
          }}
          // onLoad={addRoute}
          defaultState={mapState}
          style={{ height: "calc(100vh - 59px)", width: { mapWidth }, position: "relative" }}
          className={styles.mapInstance}
          options={{ autoFitToViewport: "always" }}
          onClick={() => closeCurrentBalloon()}>
          {/* https://codesandbox.io/s/xvmy7qyy5q?file=/src/index.js */}
          {!createObject && (
            <ObjectManager
              options={{
                clusterize: true,
                gridSize: 100,
              }}
              clusters={{
                preset: "islands#orangeClusterIcons",
              }}
              features={dataConvert(points)}
              // instanceRef={(ref) =>
              //   // console.log(myMap)
              //   ref?.objects.events.add("click", (e) => {
              //     // Используем айдишник для того, чтобы далее получить инфу по метке
              //     const objectId = e.get("objectId");
              //     // console.log(ref.objects.getById(objectId));
              //     getObjectById(ref.objects.getById(objectId).id);
              //     ref?.objects.events.remove("click");
              //     // console.log(ref.objects.getById(objectId).id);

              //     // console.log(e);
              //   })
              // }
              onClick={(e) => {
                console.log(e._sourceEvent._sourceEvent.originalEvent.objectId);
                if (typeof e._sourceEvent._sourceEvent.originalEvent.objectId === "number")
                  getObjectById(e._sourceEvent._sourceEvent.originalEvent.objectId);
              }}
              // options={{
              //   preset: "islands#orangeClusterIcons",
              //   // color: "#FF8C00",
              //   hasBalloon: false,
              //   groupByCoordinates: false,
              //   clusterDisableClickZoom: false,
              //   clusterHideIconOnBalloonOpen: false,
              //   geoObjectHideIconOnBalloonOpen: false,
              // }}
              filter={(object) => object.category === activeFilter || activeFilter === "all"}>
              {/* {!createObject
              ? points.map((item, index) =>
                  item.category == activeFilter || activeFilter == "all" ? (
                    <Placemark
                      onClick={() => {
                        console.log(getObjectProperties(item));
                        // setObjectInfoActive(objectInfoActive == item.id ? null : item.id);
                        setObjectInfoActive(getObjectProperties(item));
                        setLeftMenuIsOpen(true);
                        // console.log(objectInfoActive.name);
                      }}
                      // onMouseEnter={() => {
                      //   console.log(getObjectProperties(item));
                      //   setObjectInfoActive(item.id);
                      //   console.log(item.id);
                      //   console.log(objectInfoActive);
                      // }}
                      // onMouseLeave={() => {
                      //   setObjectInfoActive(null);
                      //   console.log(objectInfoActive);
                      // }}
                      modules={["geoObject.addon.balloon"]}
                      geometry={[item.latitude, item.longitude]}
                      key={item.id}
                      defaultProperties={getPointData(item, index)}
                      defaultOptions={getPointOptions(item, index)}>
                      <div className='test'></div>
                    </Placemark>
                  ) : null
                )
              : null} */}
            </ObjectManager>
          )}
          {createObject ? (
            <Placemark
              modules={["geoObject.addon.balloon"]}
              properties={{ balloonContent: "test" }}
              options={{
                iconLayout: "default#image",
                iconImageHref: `img/draggable.png`,
                iconImageSize: [56, 76],
                hasBalloon: false,
                iconImageOffset: [-28, -70],
                draggable: true,
              }}
              defaultGeometry={getCenter()}
              defaultOptions={{ draggable: true }}
              onDragEnd={(event) => {
                const coordinates = event.originalEvent.target.geometry.getCoordinates();
                setDraggableCoords(coordinates);
                console.log(coordinates);
              }}
            />
          ) : null}
          <GeolocationControl options={geolocationOptions} />

          {/* <Button
            options={addObjectBtnOptions}
            data={addObjectBtnData}
            onClick={() => {
              setCreateObject(!createObject);
              console.log(createObject);
            }}></Button> */}
          <ZoomControl options={zoomOptions} />
          {routeDisplayed && <ThatMapThing />}
        </Map>
      </YMaps>
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        {!createObject ? (
          <>
            {!objectInfoActive ? (
              <>
                <DropdownList objects={estateObjects.map((item) => item.address)} value={dropdownValue} setValue={setDropdownValue} />
                <FilterBlock filterList={filterList} />
              </>
            ) : (
              <>
                <div className={styles.createObjectHeading}>
                  <span
                    className={styles.backBtn}
                    onClick={() => {
                      setObjectInfoActive(null);
                      setRouteDisplayed(false);
                    }}></span>
                  <span className={styles.createObjectHeader}>Назад к фильтрам</span>
                </div>
                <Carousel
                  key={objectInfoActive.id}
                  className={styles.slider}
                  dynamicHeight={true}
                  infiniteLoop={true}
                  showArrows={false}
                  showStatus={false}
                  swipeable={true}
                  emulateTouch={true}
                  showThumbs={false}
                  renderIndicator={(onClickHandler, isSelected, index, label) => {
                    if (isSelected) {
                      return (
                        <li
                          className={styles.indicator + " " + styles.selected}
                          style={{ width: `calc(70% / ${objectInfoActive.photos.length}  - 5px )` }}
                          // style={{ ...indicatorStyles, background: "#000" }}
                          aria-label={`Selected: ${label} ${index + 1}`}
                          title={`Selected: ${label} ${index + 1}`}
                        />
                      );
                    }
                    return (
                      <li
                        className={styles.indicator}
                        style={{ width: `calc(70% / ${objectInfoActive.photos.length} - 5px)` }}
                        onClick={onClickHandler}
                        onKeyDown={onClickHandler}
                        value={index}
                        key={index}
                        role='button'
                        tabIndex={0}
                        title={`${label} ${index + 1}`}
                        // aria-label={`${label} ${index + 1}`}
                      />
                    );
                  }}>
                  {objectInfoActive &&
                    objectInfoActive.photos.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image === "/img/no-image.jpg" ? image : `${process.env.NEXT_PUBLIC_API_URL}/uploads/map-objects/${image}`}
                          style={{ userSelect: "none" }}
                        />
                      </div>
                    ))}
                </Carousel>
                <div className={styles.objectPropertiesContainer}>
                  <div className={styles.objectName}>{objectInfoActive.name}</div>
                  <div className={styles.objectCategory}>{objectInfoActive.humanFriendlyCategory}</div>
                  <div className={styles.ratingWrap}>
                    <Rating initialValue={objectInfoActive.rating} readonly={true} size={11} fillColor='#FF8C00' emptyColor='#D1D3DF' />
                    <span className={styles.objectRating}>{objectInfoActive.rating}</span>
                    <span className={styles.objectVotes} onClick={() => console.log(dropdownValue)}>
                      {objectInfoActive.votes} оценок
                    </span>
                  </div>
                  <div className={styles.objectBtnsWrap}>
                    <div
                      className={styles.pathBtn}
                      onClick={() => setRouteDisplayed((prev) => !prev)}
                      style={routeDisplayed ? { fontSize: 10 } : { fontSize: 16 }}>
                      {routeDisplayed ? "Скрыть маршрут" : "Маршрут"}
                    </div>
                    {objectInfoActive.website && <a href={`${objectInfoActive.site}`} className={styles.webBtn} target='_blank'></a>}
                    {objectInfoActive.phoneStationary && (
                      <a href={`tel:${objectInfoActive.phoneStationary}`} className={styles.phoneBtn}></a>
                    )}
                    {objectInfoActive.phoneMobile && (
                      <a href={`tel:${objectInfoActive.phoneMobile}`} className={styles.phoneBtn + " " + styles.mobile}></a>
                    )}
                    <div className={styles.threeDotsBtn}>
                      <div className={styles.threeDotsBtnMenu}>
                        <span className={styles.objectOptionsItem}>Поделиться</span>
                        <span
                          className={styles.objectOptionsItem}
                          onClick={() => {
                            setComplaintActive(true);
                          }}>
                          Пожаловаться
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.objectAddress}>{objectInfoActive.address}</div>
                  <div className={styles.objectBlockHeading}>Описание</div>
                  <p className={styles.objectDescText}>{objectInfoActive.description}</p>
                  <div className={styles.rateObject}>
                    <span className={styles.rateObjectPrompt}>Оцените это место</span>
                    <Rating
                      style={{ width: "100%" }}
                      initialValue={0}
                      ratingValue={rating}
                      onClick={(rate) => {
                        setRating(rate);
                        // console.log(rating);
                      }}
                      size={25}
                      fillColor='#FF8C00'
                      emptyColor='#D1D3DF'></Rating>
                  </div>
                  {rating ? (
                    <Formik
                      initialValues={{
                        review: "",
                      }}
                      onSubmit={(values) => {
                        values.objectId = objectInfoActive.id;
                        // console.log(objectInfoActive.id);
                        values.rating = rating / 20;
                        // alert(JSON.stringify(values, null, 2));
                        createReview(values);
                      }}>
                      <Form>
                        <label htmlFor='review' className={styles.fieldName}>
                          Отзыв
                        </label>
                        <Field
                          as='textarea'
                          name='review'
                          maxLength={1500}
                          rows={10}
                          resize='none'
                          type='text'
                          placeholder='Напишите ваш отзыв'
                          className={styles.field + " " + styles.textarea}
                        />

                        <span className={styles.warning}>Не более 1500 символов</span>
                        <span className={styles.warning} style={{ marginBottom: 10 }}>
                          Внимание: отзыв можно оставить только один раз и впоследствии нельзя будет изменить.
                        </span>
                        <button type='submit' className={styles.reviewSubmitBtn}>
                          Отправить
                        </button>
                      </Form>
                    </Formik>
                  ) : null}
                  <div className={styles.objectBlockHeading}>Отзывы</div>
                  {objectInfoActive.reviews.length ? (
                    objectInfoActive.reviews.map((item, index) => <ReviewThread key={item.id} item={item} />)
                  ) : (
                    <p className={styles.objectDescText}>Нет отзывов. Оставьте первый отзыв!</p>
                  )}
                </div>
              </>
            )}
            <AdItem appButtons={true} image={"/img/appAd.png"} width={236} height={303} />
          </>
        ) : (
          <>
            <div className={styles.createObjectHeading}>
              <span
                className={styles.backBtn}
                onClick={() => {
                  confirm("Отменить создание объекта? Данные не будут сохранены.") ? setCreateObject(false) : null;
                }}></span>
              <span className={styles.createObjectHeader}>Предложить объект на карту</span>
            </div>
            <Formik
              initialValues={{
                name: "",
                description: "",
                // phoneNumber: "",
                webPage: "",
                modComment: "",
              }}
              validationSchema={Yup.object({
                // category: Yup.string().required("Required"),
                name: Yup.string()
                  // .max(20, "Must be 20 characters or less")
                  .required("Обязательное поле"),
                description: Yup.string().required("Обязательное поле"),

                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={async (values) => {
                if (phoneStationary.includes("_") || phoneMobile.includes("_"))
                  dispatch(toggle({ text: "Поле телефона заполнено не полностью", type: "error" }));
                if (chosenCategory === "Выберите категорию") dispatch(toggle({ text: "Выберите категорию объекта", type: "error" }));
                if (!draggableCoords) dispatch(toggle({ text: "Укажите объект на карте", type: "error" }));
                else {
                  console.log("test");
                  values.phoneStationary = phoneStationary;
                  values.phoneMobile = phoneMobile;
                  values.coordinates = draggableCoords;
                  values.category = getUglyCategory(chosenCategory);
                  values.files = files;
                  values.sendToModerator = sendToModerator;
                  values.address = await (await getGeocode([draggableCoords[1], draggableCoords[0]])).address;

                  await postObject(values);
                  // setCreateObject(false);
                }
              }}>
              <Form>
                <div className={styles.fieldWrap}>
                  <label htmlFor='category' className={styles.fieldName}>
                    Категория объекта*
                  </label>
                  <DropdownList
                    className={styles.createObjectDropdown}
                    objects={filterList.map((item) => item.name)}
                    value={chosenCategory}
                    setValue={setChosenCategory}
                    style={{ width: 200 }}
                  />
                </div>
                <div className={styles.fieldWrap}>
                  <label htmlFor='name' className={styles.fieldName}>
                    Название объекта*
                  </label>
                  <Field name='name' type='text' placeholder='Введите название' className={styles.field} />
                  <span className={styles.errorText}>
                    <ErrorMessage name='name' />
                  </span>
                </div>
                <div className={styles.fieldWrap}>
                  <label htmlFor='description' className={styles.fieldName}>
                    Описание объекта*
                  </label>
                  <Field
                    as='textarea'
                    name='description'
                    maxLength={1000}
                    rows={10}
                    resize='none'
                    type='text'
                    placeholder='Поделитесь подробностями об объекте'
                    className={styles.field + " " + styles.textarea}
                  />
                  <div className={styles.warningWrap}>
                    <span className={styles.errorText}>
                      <ErrorMessage name='description' />
                    </span>
                    <span className={styles.warning}>Не более 1000 символов</span>
                  </div>
                </div>
                <div className={styles.fieldWrap}>
                  <label htmlFor='phoneNumber' className={styles.fieldName}>
                    Стационарный телефон
                  </label>
                  <div className={styles.phoneFieldWrap}>
                    <InputMask
                      className={styles.field}
                      mask='+7 (999) 999-99-99'
                      value={phoneStationary}
                      onChange={(event) => {
                        // setPhone(val);
                        setPhoneStationary(event.target.value);
                      }}
                      onClick={() => {
                        // console.log(phone.includes("_"));
                        console.log(phoneError);
                      }}
                    />
                  </div>

                  {phoneError ? <span className={styles.errorText}>Введите телефон</span> : null}
                </div>

                <div className={styles.fieldWrap}>
                  <label htmlFor='phoneNumber' className={styles.fieldName}>
                    Мобильный телефон
                  </label>
                  <div className={styles.phoneFieldWrap}>
                    <InputMask
                      className={styles.field}
                      mask='+7 (999) 999-99-99'
                      value={phoneMobile}
                      onChange={(event) => {
                        // setPhone(val);
                        setPhoneMobile(event.target.value);
                      }}
                      onClick={() => {
                        // console.log(phone.includes("_"));
                        console.log(phoneError);
                      }}
                    />
                  </div>
                  {phoneError ? <span className={styles.errorText}>Введите телефон</span> : null}
                </div>
                <div className={styles.fieldWrap}>
                  <label htmlFor='webPage' className={styles.fieldName}>
                    Ссылка объекта
                  </label>
                  <Field name='webPage' type='text' placeholder='Укажите сайт объекта' className={styles.field} />
                  <span className={styles.errorText}>
                    <ErrorMessage name='webPage' />
                  </span>
                </div>
                <div className={styles.fieldWrap}>
                  <label htmlFor='photos' className={styles.fieldName}>
                    Фотографии
                  </label>
                  <Dropzone />
                </div>
                <div className={styles.fieldWrap}>
                  {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
                  <label htmlFor='sendToModerator' className={styles.fieldName + " " + styles.checkboxWrap}>
                    <div
                      name='sendToModerator'
                      id='sendToModerator'
                      type='sendToModerator'
                      className={sendToModerator ? styles.checkbox + " " + styles.checked : styles.checkbox}
                      onClick={() => {
                        setSendToModerator(!sendToModerator);
                      }}></div>
                    <span>Отправить модератору</span>
                    <span className={styles.infoBtn}>
                      <span>
                        Равным образом реализация намеченных плановых заданий требуют определения и уточнения существенных финансовых и
                        административных условий. Разнообразный и богатый опыт укрепление и развитие структуры способствует подготовки и
                        реализации направлений прогрессивного развития.
                      </span>
                    </span>
                  </label>
                </div>
                {sendToModerator ? (
                  <div className={styles.fieldWrap}>
                    <Field
                      as='textarea'
                      name='modComment'
                      maxLength={1000}
                      rows={10}
                      resize='none'
                      type='text'
                      placeholder='Напишите комментарий модератору'
                      className={styles.field + " " + styles.textarea}
                    />
                    <div className={styles.warningWrap}>
                      <span className={styles.errorText}>
                        <ErrorMessage name='modComment' />
                      </span>
                      <span className={styles.warning}>Не более 1000 символов</span>
                    </div>
                  </div>
                ) : null}
                <div className={styles.fieldWrap}>
                  <button type='submit' className={styles.submitBtn}>
                    Отправить
                  </button>
                  <span
                    className={styles.cancelBtn}
                    onClick={() => {
                      confirm("Отменить создание объекта? Данные не будут сохранены.") ? setCreateObject(false) : null;
                    }}>
                    Отменить
                  </span>
                </div>
              </Form>
            </Formik>
          </>
        )}
        {width > 768 ? (
          <button
            className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
            onClick={() => {
              setLeftMenuIsOpen(!leftMenuIsOpen);
            }}>
            <Image src={arrowLeft} alt='' width={14} height={31} />
          </button>
        ) : null}
      </aside>
    </LayoutMap>
  );
}
