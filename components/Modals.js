import React, { useState, useEffect } from "react";
import styles from "./modals.module.scss";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input-rc-17";
import OTPInput from "./OTPInput";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { updateRole } from "../store/userSlice";
import { toggle } from "../store/notificationSlice";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";

const ModalsLayer = ({ modalToDisplay, setModalToDisplay }) => {
  //   const [modalActive, setModalActive] = useState(false);
  const [popupError, setPopupError] = useState(false);
  const dispatch = useDispatch();
  // const [otp, setOtp] = useState("");
  // const [timer, setTimer] = useState(null);

  //   const [auth, setAuth] = useState(true);
  //   const [signUp, setSignUp] = useState(false);
  //   const [modalToDisplay, setModalToDisplay] = useState("authByLogin");

  const checkLength = (str) => {
    return str.length < 4;
  };

  const [counter, setCounter] = useState(10);
  const Timer = () => {
    useEffect(() => {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }, [counter]);

    return counter ? <span className={styles.resendIn}>через {counter} секунд</span> : null;
  };

  const Overlay = () => {
    return (
      <div
        id={styles.overlay}
        onClick={() => {
          setPopupError(false);
          setModalToDisplay(null);
        }}></div>
    );
  };

  const CloseBtn = () => {
    return (
      <div
        className={styles.closeBtn}
        onClick={() => {
          setPopupError(false);
          setModalToDisplay(null);
        }}></div>
    );
  };

  const AuthByLogin = () => {
    // const KeyboardEvent = (event) => event.key === "Enter" && signInHandler();
    const signInHandler = async (values) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, { ...values });
        dispatch(updateRole({ role: res.data.user.role }));
        setModalToDisplay("");
        setPopupError(false);

        setCookie("jkh-token", res.data.token, { maxAge: 3600 * 24 * 30 });
      } catch (e) {
        console.log(e);
        dispatch(toggle({ text: e.response.data.message, type: "error" }));
      }
    };
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Войти
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string().required("Введите e-mail"),
                password: Yup.string().required("Введите пароль"),
              })}
              onSubmit={(values) => {
                signInHandler(values);
                // alert(JSON.stringify(values, null, 2));
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='email' type='text' placeholder='Введите e-mail' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='email' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='password' type='password' placeholder='Введите пароль' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='password' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Войти
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("passwordReset1");
                      }}>
                      Не помню пароль
                    </button>
                  </div>
                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("signUpByEmail");
                      }}>
                      Зарегистрироваться
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <span className={styles.delimiter}>или</span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("authByPhone");
                      }}>
                      Продолжить по телефону
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const SignUpByPhone = () => {
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Регистрация
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                phone: "",
                // password: "",
              }}
              validationSchema={Yup.object({
                //   login: Yup.string().required("Введите логин"),
                //   password: Yup.string().required("Введите пароль"),
                // name: Yup.string()
                // .max(20, "Must be 20 characters or less")
                //   .required("Обязательное поле"),
                // description: Yup.string().required("Обязательное поле"),
                // phoneNumber: Yup.string()
                //   .matches(/\d{10}/, "10 цифр")
                //   .required("Обязательное поле"),
                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2));
                setModalToDisplay("confirmationPhone");
                setCounter(60);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='phone' type='text' placeholder='Телефон' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='phone' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Получить код
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <span className={styles.delimiter}>или</span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("signUpByEmail");
                      }}>
                      Продолжить по Email
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const AuthByPhone = () => {
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Войти
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                phone: "",
                // password: "",
              }}
              validationSchema={Yup.object({
                //   login: Yup.string().required("Введите логин"),
                //   password: Yup.string().required("Введите пароль"),
                // name: Yup.string()
                // .max(20, "Must be 20 characters or less")
                //   .required("Обязательное поле"),
                // description: Yup.string().required("Обязательное поле"),
                // phoneNumber: Yup.string()
                //   .matches(/\d{10}/, "10 цифр")
                //   .required("Обязательное поле"),
                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2));
                setModalToDisplay("confirmationPhone");
                setCounter(60);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='phone' type='text' placeholder='Телефон' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='phone' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Получить код
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("authByLogin");
                      }}>
                      Войти по e-mail и паролю
                    </button>
                  </div>

                  {/* <div className={styles.popupFieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div> */}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const SignUpByEmail = () => {
    const signUpHandler = async (values) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/`, { ...values });
        console.log(res.data);
        setModalToDisplay("emailConfirmation");
        setCounter(60);
      } catch (e) {
        dispatch(toggle({ text: e.response.data.message, type: "error" }));
      }
    };

    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Регистрация
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirmation: "",
              }}
              validationSchema={Yup.object({
                //   login: Yup.string().required("Введите логин"),
                //   password: Yup.string().required("Введите пароль"),
                // name: Yup.string()
                // .max(20, "Must be 20 characters or less")
                //   .required("Обязательное поле"),
                // description: Yup.string().required("Обязательное поле"),
                // phoneNumber: Yup.string()
                //   .matches(/\d{10}/, "10 цифр")
                //   .required("Обязательное поле"),
                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2));
                signUpHandler(values);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='email' type='text' placeholder='Введите Email' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='email' />
                    </span>
                  </div>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='password' type='password' placeholder='Введите пароль' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='password' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='passwordConfirmation' type='password' placeholder='Повторите пароль' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='passwordConfirmation' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Зарегистрироваться
                    </button>
                  </div>

                  {/* <div className={styles.popupFieldWrap}>
                    <span className={styles.delimiter}>или</span>
                  </div> */}

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={styles.secondaryOption}
                      onClick={() => {
                        setModalToDisplay("signUpByPhone");
                      }}>
                      Регистрация по телефону
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationPhone = () => {
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Введите код авторизации
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                phone: "",
                // password: "",
              }}
              validationSchema={Yup.object({
                //   login: Yup.string().required("Введите логин"),
                //   password: Yup.string().required("Введите пароль"),
                // name: Yup.string()
                // .max(20, "Must be 20 characters or less")
                //   .required("Обязательное поле"),
                // description: Yup.string().required("Обязательное поле"),
                // phoneNumber: Yup.string()
                //   .matches(/\d{10}/, "10 цифр")
                //   .required("Обязательное поле"),
                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2));

                // if (otp.length < 4) {
                //   setPopupError(true);
                //   console.log(otp.length);
                // } else console.log("ok");

                alert("Авторизовались");
                setModalToDisplay("");
                // setPopupError(false);
              }}>
              {({ values }) => (
                <Form>
                  {/* <OTPInput hasErrored={popupError} checkLength={checkLength} state={otp} setState={setOtp} /> */}
                  <OTPInput />

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Получить код
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='button'
                      className={counter ? styles.resendInactive : styles.resendActive}
                      onClick={() => {
                        counter ? null : setCounter(60);
                      }}>
                      Отправить еще раз
                      <br /> {Timer(60)}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const EmailConfirmation = () => {
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span className={styles.popupHeading}>Аккаунт создан</span>
          <span className={styles.popupText}>Перейдите по ссылке в отправленном вам письме, чтобы подтвердить аккаунт</span>

          {/* <div className={styles.popupFieldWrap}>
            <div className={styles.popupFieldWrap}>
              <button
                type='button'
                className={counter ? styles.resendInactive : styles.resendActive}
                onClick={() => {
                  counter ? null : setCounter(60);
                }}>
                Отправить еще раз
                <br /> {Timer(60)}
              </button>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  const PasswordReset1 = () => {
    const resetHandler = async (values) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/restore`, { ...values });
        console.log(res.data);
        setModalToDisplay("passwordReset2");
        setCounter(60);
      } catch (e) {
        dispatch(toggle({ text: e.response.data.message, type: "error" }));
      }
    };

    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span className={styles.popupHeading}>Сброс пароля</span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                email: "",
                // password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string().required("Введите почту"),
              })}
              onSubmit={(values) => {
                resetHandler(values);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='email' type='email' placeholder='Email' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='email' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Восстановить пароль
                    </button>
                  </div>

                  {/* <div className={styles.popupFieldWrap}>
                    <span className={styles.eulaText}>
                      Отправляя данную форму, вы принимаете условие <a className={styles.eulaLink}>пользовательского соглашения</a>
                    </span>
                  </div> */}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const PasswordReset2 = () => {
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Ваш пароль сброшен
          </span>
          <div className={styles.popupFieldWrap}>
            <div className={styles.popupFieldWrap}>
              {/* <button
                type='button'
                className={counter ? styles.resendInactive : styles.resendActive}
                onClick={() => {
                  // counter ? null : setCounter(60);

                }}>
                Отправить еще раз
                <br /> {Timer(60)}
              </button> */}
              <span style={{ textAlign: "center" }}>На указанный адрес отправлено письмо с новыми данными для входа</span>
            </div>
          </div>
          {/* <div className={styles.popupFieldWrap}>
            <span
              onClick={() => {
                setModalToDisplay("");
              }}
              style={{ cursor: "pointer" }}>
              Имитация перехода с письма
            </span>
          </div> */}
        </div>
      </div>
    );
  };

  const PasswordReset3 = () => {
    const [secure, setSecure] = useState(true);
    return (
      <div className={styles.popup}>
        <CloseBtn />
        <div className={styles.formWrap}>
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Сброс пароля
          </span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                password: "",
                passwordConfirmation: "",
              }}
              validationSchema={Yup.object({
                // login: Yup.string().required("Введите логин"),
                // password: Yup.string().required("Введите пароль"),
                // name: Yup.string()
                // .max(20, "Must be 20 characters or less")
                //   .required("Обязательное поле"),
                // description: Yup.string().required("Обязательное поле"),
                // phoneNumber: Yup.string()
                //   .matches(/\d{10}/, "10 цифр")
                //   .required("Обязательное поле"),
                // webPage: Yup.string().required("Обязательное поле"),
              })}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
                setPopupError(false);
                alert("Авторизовались");
                setModalToDisplay("");
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column + " " + styles.relative}>
                    <Field name='password' type={secure ? "password" : "text"} placeholder='Новый пароль' className={styles.field} />
                    <span
                      className={secure ? styles.withEyeSecure : styles.withEyeInsecure}
                      onClick={() => {
                        setSecure(!secure);
                      }}></span>
                    <span className={styles.errorText}>
                      <ErrorMessage name='password' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field
                      name='passwordConfirmation'
                      type={secure ? "password" : "text"}
                      placeholder='Повторите пароль'
                      className={styles.field}
                    />
                    <span className={styles.errorText}>
                      <ErrorMessage name='passwordConfirmation' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='submit'
                      className={styles.submitBtn}
                      onClick={() => {
                        setModalToDisplay("authByLogin");
                      }}>
                      Сохранить новый пароль
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const Partnership = () => {
    const [orgType, setOrgType] = useState("");
    const [stage, setStage] = useState(1);

    const [data, setData] = useState(null);

    const signUpAsWorker = async (data, type) => {
      try {
        const creds = new FormData();
        creds.append("name", data.name);
        creds.append("phone", data.phone);
        creds.append("email", data.email);
        creds.append("inn", data.inn);
        creds.append("contract", data.contract);
        creds.append("snils", data.snils);
        creds.append("type", type);
        creds.append("riasToken", data.riasToken);
        creds.append("latitude", data.latitude);
        creds.append("longitude", data.longitude);
        creds.append("address", data.address);

        async function getGeocode() {
          const res = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.NEXT_PUBLIC_YMAPS_KEY}&geocode=${address + " " + house}`
          );
          //  const {data.response.GeoObjectCollection} = res
          // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text);
          const fullAddress = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
          const coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
          const precision = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.precision;
          // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted);
          // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point);
          const longitude = coords.split(" ")[0];
          const latitude = coords.split(" ")[1];

          return { address: fullAddress, latitude, longitude, precision };
        }

        console.log(creds);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/worker`, creds, {
          "Content-Type": "multipart/form-data",
        });
        setStage((prev) => prev + 1);
        console.log(res.data);
      } catch (e) {
        dispatch(toggle({ text: e.response.data.message, type: "error" }));
      }
    };

    const Partnership2 = () => {
      const [name, setName] = useState("");
      const [phone, setPhone] = useState("");
      const [email, setEmail] = useState("");
      const [inn, setInn] = useState([]);
      const [contract, setContract] = useState([]);
      const [snils, setSnils] = useState([]);
      const [agree, setAgree] = useState(false);
      const [address, setAddress] = useState("");
      const [riasToken, setRiasToken] = useState("");

      async function getGeocode() {
        const res = await axios.get(
          `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.NEXT_PUBLIC_YMAPS_KEY}&geocode=${address}`
        );
        //  const {data.response.GeoObjectCollection} = res
        // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text);
        const fullAddress = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
        const coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        const precision = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.precision;
        // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted);
        // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point);
        const longitude = coords.split(" ")[0];
        const latitude = coords.split(" ")[1];

        return { fullAddress, latitude, longitude, precision };
      }

      const Dropzone = ({ files, setFiles, placeholder }) => {
        const [isDraggedOver, setIsDraggedOver] = useState(false);

        const { getRootProps, getInputProps } = useDropzone({
          accept: {
            "image/*": [],
            "application/pdf": [".pdf"],
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
          maxSize: 10000000,
          multiple: false,
        });
        // const { getRootProps, getInputProps } = useDropzone({ maxFiles: 10, maxSize: 3000000, multiple: true, onDrop });

        const removeAll = () => {
          setFiles([]);
        };

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

        // const fieldClassname = () => {
        //   if (isDraggedOver && files.length) {
        //     return styles.dragndropField + " " + styles.hoveredOver + " " + styles.filled;
        //   } else if (!isDraggedOver) {
        //     return styles.dragndropField + " " + styles.filled;
        //   } else if (!files.length) {
        //     return styles.dragndropField + " " + styles.hoveredOver;
        //   } else return styles.dragndropField;
        // };

        return (
          <>
            <div className={styles.dragndropWrap}>
              <div
                {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
                <input {...getInputProps()} />
                <span className={styles.dragndropPlaceholder}>{placeholder}</span>
                {files.length ? (
                  <span className={styles.dragndropFieldBtn + " " + styles.filled} onClick={removeAll}></span>
                ) : (
                  <span className={styles.dragndropFieldBtn}></span>
                )}
                {/* <p className={styles.dragndropText}>Перетащите сюда файлы или нажмите</p>
          <p className={styles.dragndropWarn}>(максимум 10 файлов по 3 Мб)</p> */}
              </div>
            </div>
            {/* {files.length ? <aside className={styles.thumbsContainer}>{thumbs}</aside> : null} */}
          </>
        );
      };

      return (
        <div className={styles.popup + " " + styles.partnership}>
          <CloseBtn />
          <div className={styles.formWrap}>
            {/* <span
              className={styles.popupHeading}
              onClick={() => {
                console.log(modalToDisplay);
              }}>
              Как вы хотите использовать сервис?
            </span> */}
            <span className={styles.partnershipFormHeader}>Регистрация</span>
            <span className={styles.partnershipFormText}>Пожалуйста, укажите все данные, что бы продолжить сотрудничество</span>
            <div className={styles.popupFieldWrap} style={{ display: "flex", flexDirection: "column" }}>
              <div className={styles.popupFieldWrap + " " + styles.column}>
                <input
                  name='name'
                  type='text'
                  placeholder='Название организации'
                  className={styles.field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.popupFieldWrap + " " + styles.column}>
                {/* <Field
                      name='phone'
                      type='text'
                      placeholder='Укажите телефон'
                      className={styles.field}
                      style={{ position: "absolute", opacity: 0.5 }}
                    /> */}
                <InputMask
                  className={styles.field}
                  mask='+7 (999) 999-99-99'
                  placeholder='Телефон'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.popupFieldWrap + " " + styles.column}>
                <input
                  name='email'
                  type='text'
                  placeholder='Email'
                  className={styles.field}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.popupFieldWrap + " " + styles.column}>
                <input
                  name='address'
                  type='text'
                  placeholder='Адрес организации'
                  className={styles.field}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className={styles.popupFieldWrap + " " + styles.column}>
                <input
                  name='riasToken'
                  type='text'
                  placeholder='Токен РИАС ЖКХ вашей организации'
                  className={styles.field}
                  value={riasToken}
                  onChange={(e) => setRiasToken(e.target.value)}
                />
              </div>

              <div className={styles.popupFieldWrap + " " + styles.column}>
                <Dropzone files={inn} setFiles={setInn} placeholder='ИНН' />
              </div>
              <div className={styles.popupFieldWrap + " " + styles.column}>
                <Dropzone files={contract} setFiles={setContract} placeholder='Договор' />
              </div>
              <div className={styles.popupFieldWrap + " " + styles.column}>
                <Dropzone files={snils} setFiles={setSnils} placeholder='СНИЛС' />
              </div>
              <span className={styles.fileSize} onClick={() => console.log(stage)}>
                Размер файла до 10 Мб, скан или pdf
              </span>

              <div className={styles.popupFieldWrap}>
                <button
                  type='submit'
                  className={styles.submitBtn}
                  onClick={async () => {
                    try {
                      const re = /^\S+@\S+\.\S+$/;
                      if (phone.includes("_")) {
                        throw new Error("Поле телефона заполнено не полностью");
                      }
                      if (!re.test(email)) {
                        throw new Error("Почта введена некорректно");
                      }
                      const { latitude, longitude, fullAddress } = await getGeocode(address);
                      const data = {
                        name: name,
                        phone: phone,
                        email: email,
                        inn: inn[0],
                        contract: contract[0],
                        snils: snils[0],
                        riasToken: riasToken,
                        latitude,
                        longitude,
                        address: fullAddress,
                      };
                      console.log(data);
                      return signUpAsWorker(data, orgType);
                    } catch (e) {
                      dispatch(toggle({ text: e.message, type: "error" }));
                    }
                    // setCounter(60);
                  }}
                  style={
                    name && phone && email && inn.length && contract.length && snils.length && agree
                      ? { pointerEvents: "all" }
                      : { pointerEvents: "none", opacity: 0.6 }
                  }>
                  Продолжить
                </button>
              </div>

              {/* <div className={styles.popupFieldWrap}>
                    <span className={styles.delimiter}>или</span>
                  </div> */}

              <div className={styles.popupFieldWrap}>
                {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
                <label htmlFor='agree' className={styles.fieldName + " " + styles.checkboxWrap}>
                  <div
                    name='agree'
                    id='agree'
                    type='agree'
                    className={agree ? styles.checkbox + " " + styles.checked : styles.checkbox}
                    onClick={() => {
                      setAgree(!agree);
                      console.log(agree);
                    }}></div>
                  <span className={styles.partnershipEulaText}>
                    Я принимаю <a className={styles.partnershipEulaLink}>условия использования</a> и{" "}
                    <a className={styles.partnershipEulaLink}>пользовательское соглашение</a>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const Partnership1 = () => {
      const orgTypes = [
        { name: "Для УК, ТСЖ", id: "uk", pic: "/img/uk.png" },
        { name: "Для Управляющего по дому", id: "upravdom", pic: "/img/upravdom.png" },
        { name: "Для рекламодателей", id: "admakers", pic: "/img/admakers.png" },
        { name: "Для магазинов", id: "stores", pic: "/img/stores.png" },
        { name: "Для представителей бизнеса", id: "business", pic: "/img/business.png" },
      ];

      const OrgTypeBtn = ({ name, id }) => (
        <div className={styles.popupFieldWrap + " " + styles.orgType}>
          <button
            type='button'
            className={orgType == name ? styles.orgTypeOption + " " + styles.selected : styles.orgTypeOption}
            onClick={() => {
              // console.log(e.target.innerText);
              setOrgType(name);
              // console.log(orgType);
            }}>
            <span className={styles.orgTypeText + " " + styles[`${id}`]}>{name}</span>
          </button>
        </div>
      );

      return (
        <div className={styles.popup + " " + styles.partnership2}>
          <CloseBtn />
          <div className={styles.formWrap}>
            <span
              className={styles.popupHeading}
              onClick={() => {
                console.log(modalToDisplay);
              }}>
              Как вы хотите использовать сервис?
            </span>
            <div className={styles.popupFieldWrap}>
              <Formik>
                <Form>
                  {orgTypes.map((item) => {
                    return <OrgTypeBtn name={item.name} id={item.id} key={item.id} />;
                  })}

                  <div className={styles.popupFieldWrap}>
                    <button
                      type='submit'
                      className={styles.submitBtn}
                      onClick={() => {
                        // setModalToDisplay("partnershipComplete");
                        setStage((prev) => prev + 1);
                      }}
                      style={orgType ? { pointerEvents: "all" } : { pointerEvents: "none", opacity: 0.6 }}>
                      Подтвердить
                    </button>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <span className={styles.writeAdminText} onClick={() => console.log(data)}>
                      Если вы не смогли определиться, к какому разделу относится ваше предложении о сотрудничестве, то напишите
                      администратору
                    </span>
                  </div>
                  <div className={styles.popupFieldWrap}>
                    <span className={styles.writeAdminBtn}>Написать администратору</span>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      );
    };

    const PartnershipComplete = () => {
      return (
        <div className={styles.popup}>
          <CloseBtn />
          <div className={styles.formWrap}>
            <div className={styles.popupFieldWrap}>
              <div className={styles.completeInfo}>
                <span className={styles.completeHeader}>Заявка оформлена</span>
                <span className={styles.completeText}>Ожидайте письмо на почту с данными для входа</span>
                <span className={styles.completeCheck}></span>
              </div>
            </div>
            <div className={styles.popupFieldWrap}>
              <span className={styles.completeContacts}>По возникшим вопросам обращайтесь</span>
            </div>
            <a className={styles.completeEmail} href='mailto:info@mail.ru'>
              info@mail.ru
            </a>
          </div>
        </div>
      );
    };

    if (stage === 1) return <Partnership1 />;
    if (stage === 2) return <Partnership2 />;
    if (stage === 3) return <PartnershipComplete />;
  };

  return (
    <>
      <Overlay />
      {modalToDisplay == "authByLogin" && <AuthByLogin />}
      {modalToDisplay == "signUpByPhone" && <SignUpByPhone />}
      {modalToDisplay == "authByPhone" && <AuthByPhone />}
      {modalToDisplay == "signUpByEmail" && <SignUpByEmail />}
      {modalToDisplay == "emailConfirmation" && <EmailConfirmation />}
      {modalToDisplay == "confirmationPhone" && <ConfirmationPhone />}
      {modalToDisplay == "passwordReset1" && <PasswordReset1 />}
      {modalToDisplay == "passwordReset2" && <PasswordReset2 />}
      {modalToDisplay == "passwordReset3" && <PasswordReset3 />}
      {modalToDisplay == "partnership" && <Partnership />}
    </>
  );
};

export default ModalsLayer;

// const AuthModal = () => {
//     return (
//       <div className={styles.popup}>
//         <div
//           className={styles.closeBtn}
//           onClick={() => {
//
//             setPopupError(false);
//  setModalToDisplay(null);
//           }}></div>
//         <span className={styles.popupHeading}>Войти</span>
//         <div className={styles.popupFieldWrap}>
//           <Formik
//             initialValues={{
//               comment: "",
//             }}
//             onSubmit={(values) => {
//               if (!values.comment) {
//                 setPopupError(true);
//                 console.log("error");
//                 return;
//               }
//               alert(JSON.stringify(values, null, 2));
//                setModalToDisplay(null);
//               setPopupError(false);
//             }}>
//             {({ values }) => (
//               <Form>
//                 <Field
//                   as='textarea'
//                   name='comment'
//                   maxLength={1500}
//                   rows={10}
//                   resize='none'
//                   type='text'
//                   placeholder='Напишите сообщение продавцу'
//                   className={styles.field + " " + styles.textarea + " " + styles.popupComment}
//                 />

//                 <div className={styles.warningWrap}>
//                   {popupError ? <span className={styles.errorText}>Обязательное поле</span> : null}
//                   <span className={styles.warning}>Не более 1500 символов</span>
//                 </div>

//                 {/* <div className={styles.fieldWrap}> */}
//                 <button type='submit' className={styles.submitBtn}>
//                   Отправить
//                 </button>
//                 {/* </div> */}
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     );
//   };
