import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { currentDatetime } from "../service/functions";
import { loading } from "../store/loaderSlice";
import { toggle } from "../store/notificationSlice";
import styles from "./productcard.module.scss";
import useWindowDimensions from "./useWindowDimensionsSSR";

const ProductCard = ({ item, isOnMyAdsPage = false, isOnMyFavesPage = false, isPaidAd = false, refreshFunction }) => {
  const [favorite, setFavorite] = useState(false);
  const [shown, setShown] = useState(true);
  const { height, width } = useWindowDimensions();

  const { id, images, isVip, ispaid, name, price, location, createdAt } = item;

  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   if (isOnMyFavesPage) {
  //     setFavorite(true);
  //   }
  // }, []);

  useEffect(() => {
    if (!isOnMyAdsPage && item.favorites.length) {
      setFavorite(true);
    }
  }, []);

  const toggleFavorite = async () => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/favorites/${id}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      setFavorite((prev) => !prev);
      isOnMyFavesPage && refreshFunction();
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  const deleteProduct = async () => {
    try {
      dispatch(loading({ visible: true }));
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/${id}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      setFavorite((prev) => !prev);
      dispatch(toggle({ text: "Объявление успешно удалено", type: "success" }));
      refreshFunction();
      // setShown(false);
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  };

  return (
    <>
      <>
        {isOnMyFavesPage && !favorite ? null : (
          <div className={styles.productItem}>
            <div
              className={styles.border}
              style={{
                borderColor: ispaid ? "#ff8c00" : isVip ? "#F54019" : "#c4c6d6",
                borderWidth: ispaid ? 2 : 1,
                height: "100%",
                width: "100%",
              }}>
              <div className={styles.imageWrap}>
                {/* <Image src='/img/temp/broshurator.png' layout='fill' /> */}
                <Carousel
                  className={styles.slider}
                  dynamicHeight={true}
                  infiniteLoop={true}
                  showArrows={false}
                  showStatus={false}
                  swipeable={true}
                  emulateTouch={true}
                  showThumbs={false}
                  renderIndicator={(onClickHandler, isSelected, index, label) => {
                    if (!!images?.length) {
                      if (isSelected) {
                        return (
                          <li
                            className={styles.indicator + " " + styles.selected}
                            // style={{ width: `calc(70% / 4  - 5px )` }}
                            // style={{ ...indicatorStyles, background: "#000" }}
                            aria-label={`Selected: ${label} ${index + 1}`}
                            title={`Selected: ${label} ${index + 1}`}
                          />
                        );
                      }
                      return (
                        <li
                          className={styles.indicator}
                          // style={{ width: `calc(70% / 4 - 5px)` }}
                          onClick={onClickHandler}
                          onKeyDown={onClickHandler}
                          value={index}
                          key={index}
                          role='button'
                          tabIndex={0}
                          title={`${label} ${index + 1}`}
                          // aria-label={`${label} ${index + 1}`}
                        />
                      );
                    }
                    return null;
                  }}>
                  {!!images?.length ? (
                    images.map((item, index) => (
                      <div style={{ maxHeight: "100%" }} key={index}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/trading-platform/${item}`}
                          style={{ objectFit: "cover", width: "100%" }}
                          className={styles.slide}
                          height={width > 1050 || width < 421 ? 177 : 120}
                        />
                      </div>
                    ))
                  ) : (
                    <img
                      src='/img/no-image.jpg'
                      style={{ objectFit: "cover", width: "100%" }}
                      className={styles.slide}
                      height={width > 1050 || width < 421 ? 177 : 120}
                    />
                  )}
                  {/* <img src='/img/temp/broshurator.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 1854.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 18545.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 18546.png' layout='fill' className={styles.slide} /> */}
                </Carousel>

                {isPaidAd ? <span className={styles.isPaidAd}>Реклама</span> : null}
                <div className={styles.statusContainer}>
                  {ispaid ? <span className={styles.ispaid}>TOP</span> : null}
                  {isVip ? <span className={styles.isVip}>VIP</span> : null}
                </div>
              </div>
              <div className={styles.nameWrap}>
                <Link href={{ pathname: "/trading-platform/product/[id]", query: { id: id } }} passHref>
                  <div className={styles.productName}>{name}</div>
                </Link>
                {!isOnMyAdsPage ? (
                  <button className={styles.faveBtn} onClick={() => toggleFavorite()}>
                    {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />}
                  </button>
                ) : null}
              </div>
              <span className={styles.price}>{price} ₽</span>
              <span className={styles.locationTime}>{location}</span>
              <span className={styles.locationTime}>{currentDatetime(item.createdAt)}</span>
            </div>
            {isOnMyAdsPage ? (
              <div className={styles.myAdsBtnsWrap}>
                <button className={styles.bumpBtn}>Поднять просмотры</button>
                <div className={styles.myServicesBtnsWrap}>
                  <button
                    className={styles.myServicesBtn + " " + styles.pencil}
                    onClick={
                      () => router.push({ pathname: "/trading-platform/new", query: { id: id } })
                      // , "/trading-platform/edit"
                    }></button>
                  <button
                    className={styles.myServicesBtn + " " + styles.trash}
                    onClick={() => {
                      confirm("Вы уверены, что хотите навсегда удалить это объявление?") && deleteProduct();
                    }}></button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </>
    </>
  );
};

export default ProductCard;
