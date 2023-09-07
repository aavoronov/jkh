import { ElementRef, useRef } from "react";
import { padding } from "../service/functions";
import { Project } from "../service/interfaces";
import CompanyInfoProfile from "./CompanyInfoProfile";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import useWindowDimensions from "./useWindowDimensionsSSR";
import styles from "./tender.module.scss";

const Tender = ({ tender }: { tender: Project }) => {
  const navigationPrevRef = useRef<ElementRef<"span">>(null);
  const navigationNextRef = useRef<ElementRef<"span">>(null);

  const { width } = useWindowDimensions();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: 20,
        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.10)",
        ...padding(20, 60, 40, 20),
        borderRadius: 9,
      }}>
      <CompanyInfoProfile style={{ width: 120 }} textStyle={{ color: "#1c1c1c" }} />
      <div style={{ marginBottom: 30, display: "flex", flexDirection: "column", flexGrow: 0, flexBasis: "auto" }}>
        <div style={{ color: "#254A63", fontSize: 18, fontWeight: 500, marginBottom: 5 }}>{tender.name}</div>
        <div style={{ color: "#1c1c1c", fontSize: 12, marginBottom: 7 }}>{tender.address}</div>
        <table style={{ width: "100%", marginLeft: -2, marginBottom: 8 }}>
          <colgroup style={{ flexShrink: 0 }}>
            <col span={1} style={{ width: "20%", minWidth: 100 }}></col>
            <col span={1} style={{ width: "80%" }}></col>
          </colgroup>
          <tbody>
            <tr>
              <td style={{ fontSize: 12, color: "#1c1c1c", fontWeight: 500 }}>Сроки работы:</td>
              <td style={{ fontSize: 12, color: "#254A63", fontWeight: 500 }}>{tender.term}</td>
            </tr>
            <tr>
              <td style={{ fontSize: 12, color: "#1c1c1c", fontWeight: 500 }}>Бюджет:</td>
              <td style={{ fontSize: 12, color: "#254A63", fontWeight: 500 }}>{tender.budget}</td>
            </tr>
          </tbody>
        </table>
        <span style={{ fontSize: 14, color: "#1c1c1c" }}>{tender.description}</span>
        {width >= 900 ? (
          <>
            <Swiper
              spaceBetween={10}
              className={styles.slider}
              modules={[Navigation]}
              // navigation
              breakpoints={{
                // when window width is >= 640px
                640: {
                  // width: 640,
                  slidesPerView: 2,
                },
                // when window width is >= 768px
                920: {
                  // width: 768,
                  slidesPerView: 3,
                },
                1100: {
                  slidesPerView: 4,
                },
                1280: {
                  slidesPerView: 5,
                },
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
                disabledClass: styles.disabled,
              }}
              //   onBeforeInit={(swiper) => {
              //     {
              //       swiper.params.navigation.prevEl = navigationPrevRef.current;
              //       swiper.params.navigation.nextEl = navigationNextRef.current;
              //     }
              //   }}
              rewind={true}
              slidesPerView={4}
              // onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) => console.log(swiper)}
              // navigation={swiperNavigation}
            >
              {tender.photos &&
                tender.photos.map((image, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <img
                      //   src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/services/${image}`}
                      src={image}
                      style={{ verticalAlign: "top", height: 100, objectFit: "cover" }}
                      className={styles.slideImage}
                    />
                  </SwiperSlide>
                ))}
              <span
                className={styles.arrowNext}
                // onClick={onClickHandler}
                ref={navigationNextRef}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  top: "calc(50% - 10px)",
                  cursor: "pointer",
                  right: 0,
                }}></span>

              <span
                className={styles.arrowPrev}
                // onClick={onClickHandler}

                ref={navigationPrevRef}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  top: "calc(50% - 10px)",
                  cursor: "pointer",
                  left: 0,
                }}></span>
              {/* <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide> */}
            </Swiper>
            <div className={styles.masterBtnsWrap}>
              {/* {data.user.phone && ( */}
              {/* <a href={`tel:${data.user.phone}`} className={styles.adCallBtn}>
                  Позвонить
                </a> */}
              {/* )} */}
              <button className={styles.adWriteBtn}>Написать в чате</button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Tender;
