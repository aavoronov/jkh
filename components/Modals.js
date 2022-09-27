import React, { useState, useEffect } from "react";
import styles from "./modals.module.scss";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input-rc-17";
import OTPInput from "./OTPInput";
import { useDropzone } from "react-dropzone";

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

  const Partnership = () => {
    const [inn, setInn] = useState([]);
    const [contract, setContract] = useState([]);
    const [snils, setSnils] = useState([]);

    const [agree, setAgree] = useState(false);

    const Dropzone = ({ files, setFiles, placeholder }) => {
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
        maxFiles: 1,
        maxSize: 10000000,
        multiple: false,
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
            <div {...getRootProps({ className: isDraggedOver ? styles.dragndropField + " " + styles.hoveredOver : styles.dragndropField })}>
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
          <span
            className={styles.popupHeading}
            onClick={() => {
              console.log(modalToDisplay);
            }}>
            Как вы хотите использовать сервис?
          </span>
          <span className={styles.partnershipFormHeader}>Регистрация</span>
          <span className={styles.partnershipFormText}>Пожалуйста, укажите все данные, что бы продолжить сотрудничество</span>
          <div className={styles.popupFieldWrap}>
            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
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
                setModalToDisplay("partnership2");
                setCounter(60);
              }}>
              {({ values }) => (
                <Form>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='name' type='text' placeholder='Название организации' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='name' />
                    </span>
                  </div>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='phone' type='password' placeholder='Укажите телефон' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='phone' />
                    </span>
                  </div>

                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Field name='email' type='password' placeholder='Email' className={styles.field} />
                    <span className={styles.errorText}>
                      <ErrorMessage name='email' />
                    </span>
                  </div>
                  <span className={styles.fileSize}>Размер файла до 10 Мб</span>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Dropzone files={inn} setFiles={setInn} placeholder='ИНН' />
                  </div>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Dropzone files={contract} setFiles={setContract} placeholder='Договор' />
                  </div>
                  <div className={styles.popupFieldWrap + " " + styles.column}>
                    <Dropzone files={snils} setFiles={setSnils} placeholder='СНИЛС' />
                  </div>

                  <div className={styles.popupFieldWrap}>
                    <button type='submit' className={styles.submitBtn}>
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
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  const Partnership2 = () => {
    const [orgType, setOrgType] = useState("");

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
              <Form>
                {orgTypes.map((item) => {
                  return <OrgTypeBtn name={item.name} id={item.id} key={item.id} />;
                })}

                <div className={styles.popupFieldWrap}>
                  <button
                    type='submit'
                    className={styles.submitBtn}
                    onClick={() => {
                      setModalToDisplay("partnershipComplete");
                    }}>
                    Подтвердить
                  </button>
                </div>

                <div className={styles.popupFieldWrap}>
                  <span className={styles.writeAdminText}>
                    Если вы не смогли определиться, к какому разделу относится ваше предложении о сотрудничестве, то напишите администратору
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
      {modalToDisplay == "partnership2" && <Partnership2 />}
      {modalToDisplay == "partnershipComplete" && <PartnershipComplete />}
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
