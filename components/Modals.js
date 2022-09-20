import React, { useState, useEffect } from "react";
import styles from "./modals.module.scss";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input-rc-17";
import OTPInput from "./OTPInput";

const ModalsLayer = ({ modalToDisplay, setModalToDisplay }) => {
  //   const [modalActive, setModalActive] = useState(false);
  const [popupError, setPopupError] = useState(false);
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
                login: "",
                password: "",
              }}
              validationSchema={Yup.object({
                login: Yup.string().required("Введите e-mail"),
                password: Yup.string().required("Введите пароль"),
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
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='login' type='text' placeholder='Введите e-mail' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='login' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='password' type='text' placeholder='Введите пароль' className={styles.field} />
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
                        setModalToDisplay("signUpByPhone");
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
                passwordRepeat: "",
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
                setModalToDisplay("emailConfirmation");
                setCounter(60);
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
                    <Field name='passwordRepeat' type='password' placeholder='Повторите пароль' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='passwordRepeat' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
                      Получить код
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
                      Регистарция по телефону
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
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Подтвердите email
          </span>
          <div className={styles.popupFieldWrap}>
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
          </div>
        </div>
      </div>
    );
  };

  const PasswordReset1 = () => {
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
                email: "",
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
                setModalToDisplay("passwordReset2");
                setCounter(60);
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
            На указанный адрес отправлено письмо восстановления пароля
          </span>
          <div className={styles.popupFieldWrap}>
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
          </div>
          <div className={styles.popupFieldWrap}>
            <span
              onClick={() => {
                setModalToDisplay("passwordReset3");
              }}
              style={{ cursor: "pointer" }}>
              Имитация перехода с письма
            </span>
          </div>
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
                passwordRepeat: "",
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
                      name='passwordRepeat'
                      type={secure ? "password" : "text"}
                      placeholder='Повторите пароль'
                      className={styles.field}
                    />
                    <span className={styles.errorText}>
                      <ErrorMessage name='passwordRepeat' />
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

  return (
    <>
      <Overlay />
      {modalToDisplay == "authByLogin" ? <AuthByLogin /> : null}
      {modalToDisplay == "signUpByPhone" ? <SignUpByPhone /> : null}
      {modalToDisplay == "authByPhone" ? <AuthByPhone /> : null}
      {modalToDisplay == "signUpByEmail" ? <SignUpByEmail /> : null}
      {modalToDisplay == "emailConfirmation" ? <EmailConfirmation /> : null}
      {modalToDisplay == "confirmationPhone" ? <ConfirmationPhone /> : null}
      {modalToDisplay == "passwordReset1" ? <PasswordReset1 /> : null}
      {modalToDisplay == "passwordReset2" ? <PasswordReset2 /> : null}
      {modalToDisplay == "passwordReset3" ? <PasswordReset3 /> : null}
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
