import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Field, Form, Formik, ErrorMessage } from "formik";
import ProgressBar from "@ramonak/react-progress-bar";
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

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./polls.module.scss";
import { objectList } from "../../components/data";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { toggle } from "../../store/notificationSlice";
import { Types, createComplaint } from "../../service/functions";

const Poll = ({ item, setComplaintActive }) => {
  const PollOption = ({ item, votesTotal, isMultipleChoice, selected, setSelected, increment = false }) => {
    const votes = increment ? item.reply.length + 1 : item.reply.length;
    const percentage = votesTotal ? Math.trunc((100 * votes) / votesTotal) : 0;
    // console.log(selected);
    // console.log("item.id", item.id);

    const handleSelection = (value) => {
      if (isMultipleChoice) {
        if (selected.includes(value)) {
          const newArray = selected.filter((item) => item !== value);
          setSelected(newArray);
        } else {
          const newArray = [...selected, value];
          setSelected(newArray);
        }
        console.log("many");
      } else {
        setSelected([value]);
        console.log("one");
      }
    };

    return (
      <div className={isMultipleChoice ? styles.form_checkbox : styles.form_radio}>
        <div className={styles.labelWrap}>
          <input
            id={isMultipleChoice ? `checkbox-${item.id}` : `radio-${item.id}`}
            className={isMultipleChoice ? styles.checkbox : styles.radio}
            type={isMultipleChoice ? "checkbox" : "radio"}
            name='option'
            value={item.id}
            onChange={(e) => handleSelection(+e.target.value)}
            checked={selected.map((item) => +item).includes(item.id)}
          />

          <label
            htmlFor={isMultipleChoice ? `checkbox-${item.id}` : `radio-${item.id}`}
            className={isMultipleChoice ? styles.fieldName : ""}>
            {item.option}
          </label>
          {/* {isMultipleChoice && (
            <div
              name='brigade'
              className={true ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                // setBrigade(!brigade);
              }}></div>
          )} */}
          <span className={styles.percentage}>{percentage}%</span>
        </div>
        <ProgressBar
          completed={percentage}
          isLabelVisible={false}
          className={styles.progress}
          barContainerClassName={styles.progressContainer}
          completedClassName={styles.progressComplete}
          height='6px'
          bgColor='#ff8c00'
          borderRadius='10px'
          animateOnRender={true}
          transitionTimingFunction='ease-out'
        />
      </div>
    );
  };

  let votes = 0;
  item.options.forEach((e) => (votes += e.reply.length));

  // let votesTotal = 0;
  const [votesTotal, setVotesTotal] = useState(votes);
  const [increment, setIncrement] = useState([]);
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();

  async function submitReply() {
    try {
      if (!selected || !selected.length) {
        if (item.isMultipleChoice) {
          throw new Error("Выберите хотя бы один вариант ответа");
        } else {
          throw new Error("Выберите вариант ответа");
        }
      }
      console.log(selected);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/reply/`,
        { optionId: selected },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      console.log(res.data);
      // setPollsData(res.data);
      dispatch(toggle({ text: "Спасибо! Ваш ответ учтен", type: "success" }));
      selected.forEach((item) => {
        setVotesTotal((prev) => prev + 1);
      });
      setIncrement((prev) => [...prev, ...selected]);
      setSelected([]);
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
    }
  }

  return (
    <div className={styles.poll}>
      <div className={styles.pollHeader}>{item.question}</div>
      <div className={styles.threeDots}>
        <div className={styles.threeDotsBtnMenu}>
          <span
            className={styles.optionsItem}
            onClick={() => {
              setComplaintActive(item.id);
            }}>
            Пожаловаться
          </span>
        </div>
      </div>

      <Formik
        initialValues={{
          option: "",
        }}
        onSubmit={(values) => {
          // alert(JSON.stringify(values, null, 2));
          console.log(item.id);

          submitReply(selected);
        }}>
        {({ values }) => (
          <Form>
            {item.options.map((subitem, index) => (
              <PollOption
                increment={increment.includes(subitem.id)}
                item={subitem}
                isMultipleChoice={item.isMultipleChoice}
                index={index}
                key={index}
                votesTotal={votesTotal}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
            <div className={styles.fieldWrap}>
              <button type='submit' className={styles.submitBtn}>
                Проголосовать
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className={styles.votesTotal} onClick={() => console.log(selected)}>
        {votesTotal} голосов
      </div>

      {/* <div className={styles.option}>
            <ProgressBar
              completed={60}
              isLabelVisible={false}
              className={styles.progress}
              barContainerClassName={styles.progressContainer}
              completedClassName={styles.progressComplete}
              height={6}
              bgColor='#ff8c00'
              borderRadius='10px'
              animateOnRender={true}
              transitionTimingFunction='ease-out'
            />
          </div> */}
    </div>
  );
};

{
  /* <div className={styles.poll}>
  
      <div className={styles.pollHeader}>{item.question}</div>
      <div className={styles.threeDots}>
        <div className={styles.threeDotsBtnMenu}>
          <span
            className={styles.optionsItem}
            onClick={() => {
              setComplaintActive(true);
              console.log(complaintActive);
            }}>
            Пожаловаться
          </span>
        </div>
      </div>

      {item.options.map((item, index) => (
        <PollOption item={item} key={index} votesTotal={votesTotal} />
      ))}

      <div className={styles.votesTotal}>{votesTotal} голосов</div>
    </div> */
}

export default function Polls(props) {
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);

  const [dropdownValue, setDropdownValue] = useState(objectList[0]);
  const [complaintActive, setComplaintActive] = useState(false);
  const [complaintError, setComplaintError] = useState(false);

  const [objects, setObjects] = useState([]);
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [pollsData, setPollsData] = useState([]);

  const [scrollPosition, setScrollPosition] = useState(0);

  const dispatch = useDispatch();

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
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

  useEffect(() => {
    async function getObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        console.log(res.data);
        setFilterDropdownValue(res.data[0].estateObject.address);
        setObjects(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getObjects();
  }, []);

  useEffect(() => {
    // console.log(objects[0].estateObject.roomId);
    if (!!objects.length) {
      const chatId = objects.find((item) => item.estateObject.address === filterDropdownValue).estateObject.roomId;
      console.log(chatId);
      getMyPollsAsUserPerChat(chatId);
    }
  }, [objects, filterDropdownValue]);

  async function getMyPollsAsUserPerChat(chatId) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/polls/${chatId}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      console.log(res.data);
      setPollsData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

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

  return (
    <LayoutLoggedIn>
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
            <span className={styles.complaintHeading}>Пожаловаться на голосование</span>

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

                const data = {
                  type: Types.poll,
                  objectId: complaintActive,
                  reason: values.issue,
                  text: values.issue === "Другое" ? values.comment : undefined,
                };
                createComplaint(data);
                // alert(JSON.stringify(data, null, 2));
                dispatch(toggle({ type: "success", text: "Жалоба успешно отправлена" }));
                setComplaintError(false);
                setComplaintActive(false);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.form_radio}>
                    <Field id='complaint-1' className={styles.radio} type='radio' name='issue' value='Некорректный вопрос' />
                    <label htmlFor='complaint-1'>Некорректный вопрос</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-2' className={styles.radio} type='radio' name='issue' value='Неправильная информация' />
                    <label htmlFor='complaint-2'>Неправильная информация</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-3' className={styles.radio} type='radio' name='issue' value='Опрос не по нашему дому' />
                    <label htmlFor='complaint-3'>Опрос не по нашему дому</label>
                  </div>

                  <div className={styles.form_radio}>
                    <Field id='complaint-4' className={styles.radio} type='radio' name='issue' value='Другое' />
                    <label htmlFor='complaint-4'>Другое</label>
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
              )}
            </Formik>
          </div>
        </>
      ) : null}

      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Голосования</h1>
        <DropdownList
          objects={objects.map((item) => item.estateObject.address)}
          value={filterDropdownValue}
          setValue={setFilterDropdownValue}
        />
        <Swiper
          // spaceBetween={10}
          className={styles.slider}
          modules={[Navigation]}
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
            disabledClass: styles.disabled,
          }}
          onBeforeInit={(swiper) => {
            {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }
          }}
          rewind={true}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          // navigation={swiperNavigation}
        >
          {!!pollsData.length
            ? pollsData.map((e, i) => (
                <SwiperSlide className={styles.slide} key={i}>
                  <Poll item={e} setComplaintActive={setComplaintActive} />
                </SwiperSlide>
              ))
            : !!objects.length && <div style={{ marginTop: 20 }}>У этого объекта недвижимости еще нет опросов</div>}
          <span
            className={styles.arrowNext}
            // onClick={onClickHandler}
            ref={navigationNextRef}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "calc(50% - 10px)",
              cursor: "pointer",
              right: 20,
            }}></span>

          <span
            className={styles.arrowPrev}
            // onClick={onClickHandler}

            ref={navigationPrevRef}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "calc(50% - 10px)",
              cursor: "pointer",
              left: 20,
            }}></span>
        </Swiper>
      </div>
    </LayoutLoggedIn>
  );
}
