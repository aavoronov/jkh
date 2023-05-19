import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toggle } from "../store/notificationSlice";
import { updateRole } from "../store/userSlice";

export default function Layout({ children, title = "ЖКХ Консьерж", description = "description", keywords = "keywords" }) {
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

  useEffect(() => {
    if (notification.text !== "") setTimeout(() => dispatch(toggle({ text: "", type: null })), 5000);
  }, [notification]);

  const role = useSelector((state) => state.user.role);
  const router = useRouter();
  useEffect(() => {
    if (role === "user") router.push("/trading-platform");
    if (role === "uk" || role === "upravdom" || role === "admakers" || role === "stores" || role === "business") router.push("/workers");
  }, [role]);

  return (
    <div className='container'>
      <ToastContainer
        position='top-left'
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Head>
        <title>{title}</title>
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preload' as='font'></link>
        <meta charSet='utf-8' />
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
