import Link from "next/link";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import styles from "./personal-sections.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import LayoutPersonal from "../../components/LayoutPersonal";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import { loading } from "../../store/loaderSlice";

export default function MyAds({}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const dispatch = useDispatch();

  async function getMyProducts(page) {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/my?page=${page}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      setProducts(res.data.products);
      setPageCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  }

  useEffect(() => getMyProducts(page), []);

  return (
    <LayoutPersonal withProducts title='ЖКХ Консьерж - мои объявления' description='description' keywords='keywords'>
      <h1 className={styles.pageHeading + " " + styles.withProducts}>Мои объявления</h1>
      <div className={styles.productsWrap}>
        {products.length ? (
          products.map((item) => <ProductCard item={item} key={item.id} isOnMyAdsPage refreshFunction={() => getMyProducts(page)} />)
        ) : (
          <span className={styles.createAd}>У вас пока нет ни одного размещенного объявления. Разместите объявление прямо сейчас</span>
        )}
      </div>

      <div className={styles.bottomBtnWrap + " " + styles.withProducts}>
        <Link href='/trading-platform/new'>
          <button className={styles.submitBtn}>Разместить объявление</button>
        </Link>
      </div>

      <Pagination
        // className='pagination-bar'
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        currentPage={page}
        totalCount={pageCount}
        pageSize={process.env.NEXT_PUBLIC_TP_PAGE_LIMIT}
        onPageChange={(page) => {
          setPage(page);
          getMyProducts(page);
        }}
      />
    </LayoutPersonal>
  );
}
