import React, { useEffect, useState } from "react";
import styles from "./productcard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";

const ProductCard = ({ isPaidAd = false, isVip = false, isOnMyAdsPage = false, isOnMyFavesPage = false }) => {
  const [favorite, setFavorite] = useState(false);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (isOnMyFavesPage) {
      setFavorite(true);
    }
  }, []);

  return (
    <>
      {shown ? (
        <>
          {isOnMyFavesPage && !favorite ? null : (
            <div className={styles.productItem}>
              <div className={styles.border} style={{ borderColor: isVip ? "#F54019" : "#c4c6d6" }}>
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
                    }}>
                    <img src='/img/temp/broshurator.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 1854.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 18545.png' layout='fill' className={styles.slide} />
                    <img src='/img/temp/image 18546.png' layout='fill' className={styles.slide} />
                  </Carousel>

                  {isPaidAd ? <span className={styles.isPaidAd}>Реклама</span> : null}
                  {isVip ? <span className={styles.isVip}>VIP</span> : null}
                </div>
                <div className={styles.nameWrap}>
                  <Link href='/trading-platform/product' passHref>
                    <div className={styles.productName}>Брошюратор PrintOfice-2 раритет</div>
                  </Link>
                  {!isOnMyAdsPage ? (
                    <button className={styles.faveBtn} onClick={() => setFavorite(!favorite)}>
                      {favorite ? <img src='/img/Heart_filled.svg' /> : <img src='/img/Heart.svg' />}
                    </button>
                  ) : null}
                </div>
                <span className={styles.price}>18 000 ₽</span>
                <span className={styles.locationTime}>Королев</span>
                <span className={styles.locationTime}>Сегодня 12:45</span>
              </div>
              {isOnMyAdsPage ? (
                <div className={styles.myAdsBtnsWrap}>
                  <button className={styles.bumpBtn}>Поднять просмотры</button>
                  <div className={styles.myServicesBtnsWrap}>
                    <button className={styles.myServicesBtn + " " + styles.pencil}></button>
                    <button
                      className={styles.myServicesBtn + " " + styles.trash}
                      onClick={() => {
                        confirm("Вы уверены, что хотите навсегда удалить это объявление?") && setShown(false);
                      }}></button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default ProductCard;
