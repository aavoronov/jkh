import ProgressBar from "@ramonak/react-progress-bar";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import LayoutWorker from "../../components/LayoutWorker";
import styles from "./workers.module.scss";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { toggle } from "../../store/notificationSlice";

const Poll = ({ item }) => {
  const PollOption = ({ item, votesTotal }) => {
    const votes = item.reply.length;
    const percentage = votesTotal ? Math.trunc((100 * votes) / votesTotal) : 0;
    return (
      <div className={styles.form_radio}>
        <div className={styles.labelWrap}>
          {/* <Field id='radio-1' className={styles.radio} type='radio' name='option' value='1' /> */}
          <label htmlFor='radio-1'>{item.option}</label>
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

  let votesTotal = 0;
  item.options.forEach((e) => (votesTotal += e.reply.length));

  return (
    <div className={styles.poll}>
      {/* <div className={styles.pollHeader} style={{ marginBottom: 10 }}>
        {item.chat.address}
      </div> */}
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
    </div>
  );
};

const DropdownList = ({ objects, value, setValue, style }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (value, setValue, item) => {
    const newArray = value;
    console.log(newArray);
    console.log(value);

    if (newArray.includes(item)) {
      newArray = newArray.filter((el) => el !== item);
      console.log(newArray);
    } else {
      newArray = [...newArray, item];
      console.log(newArray);
    }
    return newArray;
  };

  return (
    <div className={styles.dropdownWrap} style={style}>
      <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className={styles.dropdownField}>Выберите один или несколько</span>
        <span className={styles.dropdownBtn}></span>
      </div>
      {dropdownOpen ? (
        <ul className={styles.dropdownList}>
          {objects.map((item, index) => (
            <li
              style={{ position: "relative" }}
              key={index}
              className={styles.dropdownListItem}
              onClick={() => {
                setValue(handleChange(value, setValue, item));
                // setDropdownOpen(false);
              }}>
              {item}
              {value.includes(item) && (
                <img src='/img/greenCheck.png' style={{ position: "absolute", width: 30, height: 30, right: 0, top: 10 }} />
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const ObjectFilterDropdownList = ({ objects, value, setValue, className = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className={styles.dropdownWrap + " " + className}>
      <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)} style={{ backgroundColor: "white" }}>
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

export default function WorkerPolls(props) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const dispatch = useDispatch();

  const [createPoll, setCreatePoll] = useState(false);
  const [optionsCount, setOptionsCount] = useState(2);
  const [multipleChoice, setMultipleChoice] = useState(false);
  // const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [objects, setObjects] = useState([]);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [pollsData, setPollsData] = useState([]);

  const [pollCreateOptions, setPollCreateOptions] = useState([]);

  async function getMyPollsAsWorkerPerChat(chatId) {
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

  // async function getMyPollsAsWorker() {
  //   try {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/polls`, {
  //       headers: { Authorization: getCookie("jkh-token") },
  //     });
  //     console.log(res.data);
  //     setPollsData(res.data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

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
      getMyPollsAsWorkerPerChat(chatId);
    }
  }, [objects, filterDropdownValue]);

  const handleCreatePoll = async (question) => {
    try {
      const chats = dropdownValue.map((item) => objects.find((el) => el.estateObject.address === item).estateObject.roomId);
      console.log(chats);
      console.log("pollCreateOptions", pollCreateOptions);

      if (!question) {
        throw new Error("Заполните поле вопроса");
      }

      if (pollCreateOptions.length < 2) {
        throw new Error("Заполните хотя бы два варианта ответа");
      }

      if (!chats.length) {
        throw new Error("Выберите хотя бы один дом");
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/polls`,
        {
          question: question,
          chats: chats,
          multipleChoice,
          options: pollCreateOptions,
        },
        { headers: { Authorization: getCookie("jkh-token") } }
      );

      console.log(res.data);
      setCreatePoll(false);
      setPollCreateOptions([]);
      setOptionsCount(2);
      dispatch(toggle({ text: "Опрос успешно создан", type: "success" }));
    } catch (e) {
      console.log(e);
      dispatch(toggle({ text: e.response?.data?.message ?? e.message, type: "error" }));
    }
  };

  const PollOption = ({ idx }) => {
    const [visible, setVisible] = useState(true);
    const [value, setValue] = useState(pollCreateOptions[idx] ?? "");

    // useEffect(() =>{

    // }, [value])

    const handleChange = (value) => {
      setValue(value);
      const newArray = pollCreateOptions;
      console.log(value);
      newArray[idx] = value;
      console.log(newArray);
      setPollCreateOptions(newArray);
    };
    return visible ? (
      <div className={styles.optionFieldWrap}>
        <span
          className={styles.optionRemoveBtn}
          onClick={() => {
            setVisible(false);
            setOptionsCount(optionsCount - 1);
            console.log(optionsCount);
            setPollCreateOptions((prev) => prev.filter((item) => item !== value));
          }}></span>
        <input
          name='text'
          type='text'
          placeholder=''
          className={styles.field}
          key={idx}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    ) : null;
  };

  return (
    <LayoutWorker>
      {createPoll && (
        <>
          <div
            id={styles.overlay}
            onClick={() => {
              setCreatePoll(false);
              setPollCreateOptions([]);
              setOptionsCount(2);
              setDropdownValue([]);
            }}></div>
          <div
            className={styles.adPopup}
            // style={{ top: `calc(50vh - 250px - ${optionsCount * 18}px)` }}
          >
            <div
              className={styles.closeBtn}
              onClick={() => {
                setCreatePoll(false);
                setOptionsCount(2);
                // setComplaintError(false);
              }}></div>
            <span className={styles.adHeading}>Новый опрос</span>

            <Formik
              initialValues={{
                question: "",
              }}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2));
                // setComplaintError(false);
                handleCreatePoll(values.question);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.fieldWrap}>
                    <label htmlFor='question' className={styles.fieldName}>
                      Напишите свой вопрос
                    </label>
                    <Field name='question' type='text' placeholder='' className={styles.field} />
                  </div>

                  <div className={styles.pollOptionsWrap}>
                    <div className={styles.fieldWrap}>
                      <label htmlFor='email' className={styles.fieldName}>
                        Варианты ответа
                      </label>
                    </div>
                    <div className={styles.fieldWrap}>
                      <button
                        type='button'
                        className={styles.addOptionBtn}
                        onClick={() => {
                          optionsCount < 8 && setOptionsCount(optionsCount + 1);
                          console.log(optionsCount);
                        }}>
                        Добавить ответ
                      </button>
                    </div>
                    {[...Array(optionsCount)].map((el, idx) => {
                      return <PollOption key={idx} idx={idx} />;
                    })}
                  </div>

                  <div className={styles.fieldWrap}>
                    {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
                    <label htmlFor='multipleChoice' className={styles.fieldName + " " + styles.checkboxWrap}>
                      <div
                        name='multipleChoice'
                        id='multipleChoice'
                        type='multipleChoice'
                        className={multipleChoice ? styles.checkbox + " " + styles.checked : styles.checkbox}
                        onClick={() => {
                          setMultipleChoice(!multipleChoice);
                          console.log(multipleChoice);
                        }}></div>
                      Выбор нескольких ответов
                    </label>
                  </div>

                  <DropdownList
                    objects={objects.map((item) => item.estateObject.address)}
                    value={dropdownValue}
                    setValue={setDropdownValue}
                    style={{ marginBottom: 15 }}
                  />

                  <div className={styles.modalBtnsWrap}>
                    <button type='submit' className={styles.submitBtn} style={{ marginRight: 10 }}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        // setComplaintError(false);
                        setCreatePoll(false);
                        setPollCreateOptions([]);
                        setOptionsCount(2);
                        setDropdownValue([]);
                      }}>
                      Отменить
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Голосования, опросы</h1>
        {!!objects.length ? (
          <ObjectFilterDropdownList
            value={filterDropdownValue}
            setValue={setFilterDropdownValue}
            objects={objects.map((item) => item.estateObject.address)}
          />
        ) : (
          <div style={{ textAlign: "center", color: "white", marginTop: 20 }}>Вы не зарегистрировали ни одного дома под управлением</div>
        )}
        {/* <span className={styles.threeDotsBtn}> */}
        {/* <div className={styles.threeDotsBtnMenu}>
            <span className={styles.chatOptionsItem}>Редактировать</span>
            <span className={styles.chatOptionsItem}>Удалить аккаунт</span>
          </div> */}
        {/* </span> */}

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
                  <Poll item={e} />
                </SwiperSlide>
              ))
            : !!objects.length && (
                <div style={{ textAlign: "center", color: "white", marginTop: 20 }}>У этого объекта недвижимости еще нет опросов</div>
              )}
          <span
            className={styles.arrowNext}
            // onClick={onClickHandler}
            ref={navigationNextRef}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "calc(50% - 10px)",
              cursor: "pointer",
              right: 0,
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
              left: 0,
            }}></span>
          {/* <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide> */}
        </Swiper>

        <div className={styles.fieldWrap}>
          <button
            type='submit'
            className={styles.submitBtn}
            onClick={() => {
              setCreatePoll(true);
            }}>
            Создать новый опрос
          </button>
        </div>
      </div>
    </LayoutWorker>
  );
}
