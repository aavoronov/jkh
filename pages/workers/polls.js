import ProgressBar from "@ramonak/react-progress-bar";
import { Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import LayoutWorker from "../../components/LayoutWorker";
import styles from "./workers.module.scss";

export default function WorkerPolls(props) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const [createPoll, setCreatePoll] = useState(false);
  const [optionsCount, setOptionsCount] = useState(2);
  const [multipleChoice, setMultipleChoice] = useState(false);

  const PollOption = ({ idx }) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <div className={styles.optionFieldWrap}>
        <span
          className={styles.optionRemoveBtn}
          onClick={() => {
            setVisible(false);
            setOptionsCount(optionsCount - 1);
            console.log(optionsCount);
          }}></span>
        <input name='email' type='text' placeholder='' className={styles.field} key={idx} />
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
              setOptionsCount(2);
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
                name: "",
                phone: "",
                email: "",
              }}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
                // setComplaintError(false);
                setCreatePoll(false);
                setOptionsCount(2);
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
                      return <PollOption idx={idx} />;
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

                  <div className={styles.modalBtnsWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Отправить
                    </button>
                    <span
                      className={styles.cancelBtn}
                      onClick={() => {
                        // setComplaintError(false);
                        setCreatePoll(false);
                        setOptionsCount(2);
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
        <span className={styles.threeDotsBtn}>
          {/* <div className={styles.threeDotsBtnMenu}>
            <span className={styles.chatOptionsItem}>Редактировать</span>
            <span className={styles.chatOptionsItem}>Удалить аккаунт</span>
          </div> */}
        </span>

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
          {[...Array(3)].map((e, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <div className={styles.poll}>
                <div className={styles.pollHeader}>Планируется проведение собрания на 24.07.2022. Кто прийдет</div>
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

                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    {/* <Field id='radio-1' className={styles.radio} type='radio' name='option' value='1' /> */}
                    <label htmlFor='radio-1'>Смогу прийти</label>
                    <span className={styles.percentage}>60%</span>
                  </div>
                  <ProgressBar
                    completed={60}
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
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    {/* <Field id='radio-2' className={styles.radio} type='radio' name='option' value='2' /> */}
                    <label htmlFor='radio-2'>Смогу не прийти</label>
                    <span className={styles.percentage}>20%</span>
                  </div>
                  <ProgressBar
                    completed={20}
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
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    {/* <Field id='radio-3' className={styles.radio} type='radio' name='option' value='3' /> */}

                    <label htmlFor='radio-3'>Не смогу прийти</label>
                    <span className={styles.percentage}>15%</span>
                  </div>
                  <ProgressBar
                    completed={15}
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
                <div className={styles.form_radio}>
                  <div className={styles.labelWrap}>
                    {/* <Field id='radio-4' className={styles.radio} type='radio' name='option' value='4' /> */}
                    <label htmlFor='radio-4'>Не смогу не прийти</label>
                    <span className={styles.percentage}>5%</span>
                  </div>
                  <ProgressBar
                    completed={5}
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

                <div className={styles.votesTotal}>37 голосов</div>
              </div>
            </SwiperSlide>
          ))}
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
