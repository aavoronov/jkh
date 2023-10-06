import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import InputMask from "react-input-mask";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";

import AdItem from "../../components/AdItem";
import LayoutMap from "../../components/LayoutMap";
// import DropdownList from "../components/DropdownList";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";

import { GeolocationControl, Map, ObjectManager, Placemark, withYMaps, YMaps, ZoomControl } from "@pbe/react-yandex-maps";
import styles from "./map.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { createComplaint, Types } from "../../service/functions";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";
import allPlaces from "/public/img/allPlaces.png";
import arrowLeft from "/public/img/arrowLeft.png";

const zoomOptions = {
  position: { right: 30, top: 50 },
};

const geolocationOptions = {
  position: { right: 30, top: 280 },
};

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
    coordinates: [object.object.point.coordinates[1], object.object.point.coordinates[0]],
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

const dataConvert = (points) => {
  let features = [];
  points.length &&
    points.map((item, index) => {
      let tmpObj = {
        type: "Feature",
        id: item.id,
        category: item.category,
        // geometry: item.point,
        geometry: {
          crs: { type: "name", properties: { name: "EPSG:4326" } },
          type: "Point",
          coordinates: [item.point.coordinates[1], item.point.coordinates[0]],
        },
        // geometry: [item.point.coordinates[1], item.point.coordinates[0]],
        options: { iconLayout: "default#image", iconImageHref: `img/${item.category}Mark.png`, iconImageSize: [38, 50] },
      };
      // console.log(item.point);
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
  const [dropdownValue, setDropdownValue] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [createObject, setCreateObject] = useState(false);
  const [chosenCategory, setChosenCategory] = useState("Выберите категорию");
  const [draggableCoords, setDraggableCoords] = useState(null);
  const [sendToModerator, setSendToModerator] = useState(false);
  const [objectInfoActive, setObjectInfoActive] = useState(null);
  const [commentId, setCommentId] = useState(null);
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

  const router = useRouter();

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
      const routerObjectId = router.query.id;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        const prepareData = () => {
          let data = [];
          res.data.forEach((item) => {
            return data.push({
              id: item.id,
              address: item.estateObject.address.split(",").slice(-2).join().trim() + ", " + item.estateObject.apartment,
              // coordinates: [+item.estateObject.latitude, +item.estateObject.longitude],
              coordinates: [+item.estateObject.point.coordinates[1], +item.estateObject.point.coordinates[0]],
            });
          });
          return data;
        };
        res.data.length && setEstateObjects(prepareData());

        let mapStateCenter = [55.74977233765063, 37.629171261904766];
        let filterValue = null;

        if (res.data.length) {
          if (!!routerObjectId) {
            const object = res.data.find((item) => item.estateObject.id === +routerObjectId);
            if (!!object) {
              mapStateCenter = [object.estateObject.point.coordinates[1], object.estateObject.point.coordinates[0]];
              filterValue = object.estateObject.address.split(",").slice(-2).join().trim() + ", " + object.estateObject.apartment;
            }
          } else {
            mapStateCenter = [res.data[0].estateObject.point.coordinates[1], res.data[0].estateObject.point.coordinates[0]];
            filterValue = res.data[0].estateObject.address.split(",").slice(-2).join().trim() + ", " + res.data[0].estateObject.apartment;
          }
        }

        setDropdownValue(filterValue);

        setMapState({
          center: mapStateCenter,
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
      setObjectInfoActive(getObjectProperties(res.data));

      // dispatch(updateRole({ role: res.data.role }));
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  // useEffect(() => {
  //   const getObjects = async () => {
  //     try {
  //       dispatch(loading({ visible: true }));
  //       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/map-objects`, {
  //         headers: {
  //           Authorization: getCookie("jkh-token"),
  //         },
  //       });

  //       setPoints(res.data);
  //       // dispatch(updateRole({ role: res.data.role }));
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     dispatch(loading({ visible: false }));
  //   };
  //   getObjects();
  // }, []);

  const getObjectsWithinBounds = async (bounds) => {
    try {
      const lon0 = bounds[0][1];
      const lat0 = bounds[0][0];
      const lon1 = bounds[1][1];
      const lat1 = bounds[1][0];
      dispatch(loading({ visible: true }));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/map-objects/bounds?lon0=${lon0}&lat0=${lat0}&lon1=${lon1}&lat1=${lat1}`,
        {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        }
      );

      setPoints(res.data.data);
      if (res.data.status === "limit") {
        dispatch(toggle({ text: "Все объекты не могут быть показаны. Увеличьте масштаб карты", type: "info" }));
      }
      // dispatch(updateRole({ role: res.data.role }));
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  useEffect(() => {
    if (mapState && mapRef.current) {
      const bounds = mapRef?.current?.getBounds();

      getObjectsWithinBounds(bounds);
    }
  }, [mapState, mapRef]);

  const createReview = async (values) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/map-objects/reviews`, values, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
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

    const isSuccess = !!res.data.response.GeoObjectCollection.featureMember.length;
    if (!isSuccess) {
      throw new Error("Введенный адрес не найден. Проверьте правильность введенного адреса");
    }
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

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/map-objects`, object, {
        headers: {
          Authorization: getCookie("jkh-token"),
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(toggle({ text: "Спасибо! Объект отправлен на модерацию", type: "success" }));
      return true;
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response.data.message, type: "error" }));
    }
  };

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
          <div className={styles.reviewNameWrap} style={{ position: "relative" }}>
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
            <div className={styles.threeDotsBtn} style={{ position: "absolute", right: -20 }}>
              <div className={styles.threeDotsBtnMenu}>
                <span
                  className={styles.objectOptionsItem}
                  onClick={() => {
                    setComplaintActive("review");
                    setCommentId(item.id);
                  }}>
                  Пожаловаться
                </span>
              </div>
            </div>
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
                reply: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={async (values) => {
                values.reviewId = item.id;
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
                <div className={styles.threeDotsBtn} style={{ position: "absolute", right: 0 }}>
                  <div className={styles.threeDotsBtnMenu}>
                    <span
                      className={styles.objectOptionsItem}
                      onClick={() => {
                        setComplaintActive("reply");
                        setCommentId(reply.id);
                      }}>
                      Пожаловаться
                    </span>
                  </div>
                </div>
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

  const setMenuState = (value) => {
    setMenuIsOpen(value);
  };

  const getCenter = () => {
    if (mapRef.current) {
      // console.log(mapRef.current.getCenter());
      return mapRef.current.getCenter();
    }
  };

  // useEffect(() => {
  //   if (estateObjects.length && router.query.id && !!mapRef.current) {
  //     const object = estateObjects.find((item) => item.id === +router.query.id);
  //     console.log("estateObjects", estateObjects);
  //     console.log("object", object);
  //     mapRef.current.setCenter(object.coordinates);
  //     setDropdownValue(object.address);
  //   }
  // }, [estateObjects, router.query.id, mapRef.current]);

  useEffect(() => {
    if (estateObjects.length && router.query.id) {
      const object = estateObjects.find((item) => item.id === +router.query.id);
      setDropdownValue(object.address);
    }
  }, [estateObjects, router.query.id]);

  return (
    <LayoutMap
      menuIsCollapsible={true}
      menuIsOpen={menuIsOpen}
      setMenuIsOpen={setMenuIsOpen}
      title='ЖКХ Консьерж - интерактивная карта'
      description='description'
      keywords='keywords'>
      {complaintActive
        ? (() => {
            const isMap = complaintActive === "map";
            const isReview = complaintActive === "review";
            const isReply = complaintActive === "reply";

            return (
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
                  <span className={styles.complaintHeading}>{`Пожаловаться на ${isMap ? "объект" : "комментарий"}`}</span>
                  {isMap && (
                    <div className={styles.objectWrap}>
                      <div className={styles.imageWrap}>
                        <img
                          src={
                            objectInfoActive.photos[0] === "/img/no-image.jpg"
                              ? objectInfoActive.photos[0]
                              : `${process.env.NEXT_PUBLIC_API_URL}/uploads/map-objects/${objectInfoActive.photos[0]}`
                          }
                          width={90}
                          height={72}
                        />
                      </div>
                      <div className={styles.objectInfoWrap}>
                        <div className={styles.complaintCategory}>{objectInfoActive.humanFriendlyCategory}</div>
                        <div className={styles.complaintName}>{objectInfoActive.name}</div>
                      </div>
                    </div>
                  )}
                  <Formik
                    initialValues={{
                      issue: "",
                      comment: "",
                    }}
                    onSubmit={(values) => {
                      if (values.issue == "Другое" && !values.comment) {
                        setComplaintError(true);
                        return;
                      }
                      // values.objectId = objectInfoActive.id;
                      const type =
                        complaintActive === "map" ? Types.mapObject : complaintActive === "review" ? Types.mapReview : Types.mapReply;
                      const data = {
                        type: type,
                        objectId: isMap ? objectInfoActive.id : commentId,
                        reason: values.issue,
                        text: values.issue === "Другое" ? values.comment : undefined,
                      };
                      createComplaint(data);
                      // alert(JSON.stringify(data, null, 2));
                      dispatch(toggle({ type: "success", text: "Жалоба успешно отправлена" }));
                      setComplaintError(false);
                      setComplaintActive(false);
                    }}>
                    {({ values }) =>
                      isMap ? (
                        <Form>
                          <div className={styles.form_radio}>
                            <Field
                              id='radio-1'
                              className={styles.radio}
                              type='radio'
                              name='issue'
                              value='Объект отсутствует на указанном месте'
                            />
                            <label htmlFor='radio-1'>Объект отсутствует на указанном месте</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-2' className={styles.radio} type='radio' name='issue' value='Не соответствует описание' />
                            <label htmlFor='radio-2'>Не соответствует описание</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-3' className={styles.radio} type='radio' name='issue' value='Не соответствуют фото' />
                            <label htmlFor='radio-3'>Не соответствуют фото</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-4' className={styles.radio} type='radio' name='issue' value='Это реклама' />
                            <label htmlFor='radio-4'>Это реклама</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-5' className={styles.radio} type='radio' name='issue' value='Другое' />
                            <label htmlFor='radio-5'>Другое</label>
                          </div>

                          {values.issue == "Другое" ? (
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
                      ) : (
                        <Form>
                          <div className={styles.form_radio}>
                            <Field id='radio-1' className={styles.radio} type='radio' name='issue' value='Неизвестно, что здесь будет' />
                            <label htmlFor='radio-1'>Неизвестно, что здесь будет</label>
                          </div>

                          {/* <div className={styles.form_radio}>
                            <Field id='radio-2' className={styles.radio} type='radio' name='issue' value='Не соответствует описание' />
                            <label htmlFor='radio-2'>Не соответствует описание</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-3' className={styles.radio} type='radio' name='issue' value='Не соответствуют фото' />
                            <label htmlFor='radio-3'>Не соответствуют фото</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-4' className={styles.radio} type='radio' name='issue' value='Это реклама' />
                            <label htmlFor='radio-4'>Это реклама</label>
                          </div>

                          <div className={styles.form_radio}>
                            <Field id='radio-5' className={styles.radio} type='radio' name='issue' value='Другое' />
                            <label htmlFor='radio-5'>Другое</label>
                          </div> */}

                          {values.issue == "Другое" ? (
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
                      )
                    }
                  </Formik>
                </div>
              </>
            );
          })()
        : null}
      <button
        className={menuIsOpen ? styles.addObjectBtn : styles.addObjectBtn + " " + styles.toTheRight}
        onClick={() => {
          setCreateObject((prev) => !prev);
        }}>
        <span className={styles.addObjectHint}>Добавить объект на карту</span>
      </button>
      {/* <button className={menuIsOpen ? styles.mapOptionsBtn : styles.mapOptionsBtn + " " + styles.toTheRight}>
        <div className={styles.mapOptionsMenu}>
          <span className={styles.mapOptionsItem}>Показать установленные объекты</span>
          <span className={styles.mapOptionsItem}>Показать предложенные объекты</span>
        </div>
      </button> */}
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
          onBoundsChange={() => getObjectsWithinBounds(mapRef?.current?.getBounds())}
          modules={["multiRouter.MultiRoute", "util.bounds"]}
          instanceRef={(ref) => {
            if (ref) mapRef.current = ref;
          }}
          onDrag={(e) => console.log("texrrsdf")}
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
              onClick={(e) => {
                if (typeof e._sourceEvent._sourceEvent.originalEvent.objectId === "number")
                  getObjectById(e._sourceEvent._sourceEvent.originalEvent.objectId);
              }}
              filter={(object) => object.category === activeFilter || activeFilter === "all"}></ObjectManager>
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
              }}
            />
          ) : null}
          <GeolocationControl options={geolocationOptions} />

          <ZoomControl options={zoomOptions} />
          {routeDisplayed && <ThatMapThing />}
        </Map>
      </YMaps>
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        {!createObject ? (
          <>
            {!objectInfoActive ? (
              <>
                {!!estateObjects.length ? (
                  <DropdownList objects={estateObjects.map((item) => item.address)} value={dropdownValue} setValue={setDropdownValue} />
                ) : (
                  <div style={{ height: 20 }}></div>
                )}
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
                    <Rating
                      initialValue={Math.round(objectInfoActive.rating * 100) / 100}
                      readonly={true}
                      size={11}
                      fillColor='#FF8C00'
                      emptyColor='#D1D3DF'
                    />
                    <span className={styles.objectRating}>{objectInfoActive.rating}</span>
                    <span className={styles.objectVotes}>{objectInfoActive.votes} оценок</span>
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
                            setComplaintActive("map");
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
                        values.rating = rating / 20;
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
                name: Yup.string().required("Обязательное поле"),
                description: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={async (values) => {
                if (phoneStationary.includes("_") || phoneMobile.includes("_"))
                  dispatch(toggle({ text: "Поле телефона заполнено не полностью", type: "error" }));
                if (chosenCategory === "Выберите категорию") dispatch(toggle({ text: "Выберите категорию объекта", type: "error" }));
                if (!draggableCoords) dispatch(toggle({ text: "Укажите объект на карте", type: "error" }));
                else {
                  values.phoneStationary = phoneStationary;
                  values.phoneMobile = phoneMobile;
                  values.coordinates = draggableCoords;
                  values.category = getUglyCategory(chosenCategory);
                  values.files = files;
                  values.sendToModerator = sendToModerator;
                  values.address = await (await getGeocode([draggableCoords[1], draggableCoords[0]])).address;

                  await postObject(values);
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
                    Городской телефон
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
                {/* <div className={styles.fieldWrap}>
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
                </div> */}
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
