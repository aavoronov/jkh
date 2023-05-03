import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./personal-sections.module.scss";
import LayoutPersonal from "../../components/LayoutPersonal";

import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import Pagination from "../../components/Pagination";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getCookie } from "cookies-next";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";

export default function MyServices({}) {
  const { height, width } = useWindowDimensions();

  const [page, setPage] = useState(1);
  const [services, setServices] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const dispatch = useDispatch();

  async function getMyServices(page) {
    try {
      dispatch(loading({ visible: true }));
      console.log(page);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/my?page=${page}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      setServices(res.data.services);
      setPageCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  }

  useEffect(() => getMyServices(page), []);

  const deleteService = async (id) => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      dispatch(toggle({ text: "Объявление успешно удалено", type: "success" }));
      getMyServices(page);
      // setShown(false);
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  return (
    <LayoutPersonal>
      <h1 className={styles.pageHeading}>Мои услуги</h1>

      {!services.length ? (
        <span className={styles.createAdServices}>
          У вас пока нет ни одного объявления по предоставлению услуги. Вы можете разместить объявление об услуге, которую вы оказываете.
          Объявление размещается на платной основе.
        </span>
      ) : null}

      {!!services &&
        services.map((item) => (
          <div className={styles.col}>
            <div className={styles.adWrap}>
              <div className={styles.adProfileWrap}>
                <div className={styles.picWrap}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${item.mainImage}`}
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className={styles.adInfoWrap}>
                <div className={styles.myServicesBtnsWrap}>
                  {/* <button className={styles.myServicesBtn + " " + styles.pencil}></button> */}
                  <button
                    className={styles.myServicesBtn + " " + styles.trash}
                    onClick={() => {
                      confirm("Вы уверены, что хотите навсегда удалить это объявление?") && deleteService(item.id);
                    }}></button>
                </div>
                <div className={styles.nameWrap}>
                  <Link href='/services/service-inner'>
                    <span className={styles.adName}>{item.name}</span>
                  </Link>
                </div>
                <span className={styles.adLocation}>{item.address}</span>
                <span className={styles.adPrice}>Цена на работы:</span>
                <span className={styles.adPriceValue}>{item.price}</span>
                <p className={styles.adDescription}>
                  {item.description.substring(0, 250).concat(item.description.length > 250 ? "..." : "")}
                </p>
              </div>
            </div>
          </div>
        ))}

      <div className={styles.bottomBtnWrap}>
        <Link href='/personal/create-service'>
          <button className={styles.submitBtn}>Разместить услугу</button>
        </Link>
      </div>
      <Pagination
        // className='pagination-bar'
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        currentPage={page}
        totalCount={pageCount}
        pageSize={process.env.NEXT_PUBLIC_SERVICES_PAGE_LIMIT}
        onPageChange={(page) => {
          setPage(page);
          getMyServices(page);
        }}
      />
    </LayoutPersonal>
  );
}
