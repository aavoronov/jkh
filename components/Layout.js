import Link from "next/link";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { updateRole } from "../store/userSlice";
import { toggle } from "../store/notificationSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  useEffect(() => {
    console.log(getCookie("jkh-token"));
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!!getCookie("jkh-token")) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/reauth`, {
            headers: {
              Authorization: getCookie("jkh-token"),
            },
          });
          console.log(res.data);
          dispatch(updateRole({ role: res.data.role }));
        } catch (e) {
          console.log(e.response.data);
          setCookie("jkh-token", "");
          router.push("/");
        }
      }
    };
    fetchData();
  }, []);

  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification.text) {
      switch (notification.type) {
        case "info":
          toast.info(notification.text);
          break;
        case "success":
          toast.success(notification.text);
          break;
        case "warning":
          toast.warning(notification.text);
          break;
        case "error":
          toast.error(notification.text);
          break;
        case "default":
          toast(notification.text);
          break;
        default:
          notification.text && toast(notification.text);
      }
    }
  }, [notification]);

  // useEffect(() => {
  //   toast.warning("test");
  // }, []);

  useEffect(() => {
    if (notification.text !== "") setTimeout(() => dispatch(toggle({ text: "", type: null })), 5000);
  }, [notification]);

  const role = useSelector((state) => state.user.role);
  const router = useRouter();
  useEffect(() => {
    if (role === "user") router.push("/trading-platform");
  }, [role]);

  return (
    <div className='container'>
      <ToastContainer
        position='top-left'
        // autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      {children}
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }
        .hidden {
          display: none;
        }
      `}</style>
      <style jsx global>{`
        html {
          overflow-x: hidden;
        }
        html,
        body {
          overflow-x: hidden;
          padding: 0;
          margin: 0;
          // background-color: red;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
          font-family: "Roboto";
          font-style: normal;
          font-size: 16px;
        }
        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
