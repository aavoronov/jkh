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

export default function MyFavorites({}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const dispatch = useDispatch();

  const getMyFaves = async (page) => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/favorites?page=${page}`, {
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
  };

  useEffect(() => getMyFaves(page), []);

  return (
    <LayoutPersonal withProducts title='ЖКХ Консьерж - избранное' description='description' keywords='keywords'>
      <h1 className={styles.pageHeading + " " + styles.withProducts}>Избранное</h1>
      <div className={styles.productsWrap}>
        {products.length ? (
          products.map((item) => <ProductCard item={item} key={item.id} isOnMyFavesPage refreshFunction={() => getMyFaves(page)} />)
        ) : (
          <span className={styles.createAd}>
            У вас пока нет объявлений в избранном. Добавьте объявления в избранное в разделе объявлений.
          </span>
        )}
        {/* <ProductCard isPaidAd isOnMyFavesPage /> <ProductCard isVip isOnMyFavesPage /> <ProductCard isOnMyFavesPage />{" "}
        <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage />{" "}
        <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> <ProductCard isOnMyFavesPage /> */}
      </div>
      <div className={styles.bottomBtnWrap + " " + styles.withProducts}>
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
      </div>
      <div className={styles.bottomBtnWrap + " " + styles.withProducts}>
        <button className={styles.submitBtn}>Перейти к объявлениям</button>
      </div>
    </LayoutPersonal>
  );
}
