import React, { useEffect, useState } from "react";

import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../components/LayoutWorker";
import { currentDatetime, getGeocode, padding } from "../../service/functions";
import { toggle } from "../../store/notificationSlice";
import { updateRole } from "../../store/userSlice";
import workerStyles from "./workers.module.scss";
import styles from "./company-info.module.scss";
import CompanyInfoProfile from "../../components/CompanyInfoProfile";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Project } from "../../service/interfaces";

const CompanyInfo = () => {
  return (
    <div className={styles.companyInfoWrap}>
      <div className={styles.companyPicWrap}>
        <CompanyInfoProfile style={{ marginBottom: 32 }} />
      </div>
      <table style={{ width: "100%" }}>
        <colgroup style={{ flexShrink: 0 }}>
          <col span={1} className={styles.colgroup1stcol}></col>
          <col span={1} className={styles.colgroup2ndcol}></col>
        </colgroup>
        <tbody>
          <tr>
            <td className={styles.firstcol}>Организация</td>
            <td className={styles.secondcol}>Компания Бизнес Альянс Компани</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Руководитель</td>
            <td className={styles.secondcol}>Власов Иван Иванович</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Телефон</td>
            <td className={styles.secondcol}>+7 999 999 99 99</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Сайт</td>
            <td className={styles.secondcol}>www.reg.ru</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Год основания</td>
            <td className={styles.secondcol}>2011</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Направление деятельности</td>
            <td className={styles.secondcol}>Строительство</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Штат</td>
            <td className={styles.secondcol}>15</td>
          </tr>
          <tr>
            <td className={styles.firstcol}>Оборот за прошлый год</td>
            <td className={styles.secondcol}>12 000 000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const CompanyServiceTags = () => {
  const tags = ["Электромонтаж", "Монтажные работы", "Замена труб", "Перекрытие крыши"];
  return (
    <div style={{ marginBottom: 31 }}>
      <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 500, lineHeight: "130%" }}>Услуги компании</h2>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {tags.map((item, index) => {
          return (
            <span
              key={index}
              style={{
                ...padding(7, 25),
                backgroundColor: "#FFFFFFB4",
                borderColor: "#C4C6D6B4",
                borderWidth: 1,
                borderRadius: 20,
                color: "#1C1C1C",
                fontSize: 14,
                fontWeight: 400,
                flexShrink: 0,
              }}>
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
};

interface ProjectProps {
  project: Project;
}

const CompanyProjects = () => {
  const projectsData = {
    name: "Монтажные работы",
    photos: ["/img/temp/project.png", "/img/temp/project.png", "/img/temp/project.png", "/img/temp/project.png", "/img/temp/project.png"],
    address: "Москва, ул. Ленина, д. 12",
    budget: "По договоренности",
    term: "от 5 месяцев",
    description:
      "Выполню любой спектр сантехнических услуг: отопление, водоотведение, канализация, установка сантехнического оборудования. ",
  };

  const Project = ({ project }: ProjectProps) => {
    return (
      <div style={{ backgroundColor: "#fff", ...padding(12), width: `max(30%, 230px)`, borderRadius: 9 }}>
        {/* <img src={"/img/temp/project.png"} style={{ objectFit: "contain", width: "100%", height: 150 }} /> */}
        <Carousel
          key={Date.now()}
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
                  style={{ width: `calc(70% / ${project.photos.length}  - 5px )` }}
                  // style={{ ...indicatorStyles, background: "#000" }}
                  aria-label={`Selected: ${label} ${index + 1}`}
                  title={`Selected: ${label} ${index + 1}`}
                />
              );
            }
            return (
              <li
                className={styles.indicator}
                style={{ width: `calc(70% / ${project.photos.length} - 5px)` }}
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
          {project &&
            project.photos.map((image, index) => (
              <div key={index}>
                <img
                  // src={image === "/img/no-image.jpg" ? image : `${process.env.NEXT_PUBLIC_API_URL}/uploads/map-objects/${image}`}
                  src={image}
                  style={{ userSelect: "none" }}
                />
              </div>
            ))}
        </Carousel>
        <div style={{ color: "#254A63", fontSize: 18, fontWeight: 500, marginBottom: 5 }}>{project.name}</div>
        <div style={{ color: "#1c1c1c", fontSize: 12, marginBottom: 7 }}>{project.address}</div>
        <table style={{ width: "100%", marginLeft: -2 }}>
          <colgroup style={{ flexShrink: 0 }}>
            <col span={1} style={{ width: "30%" }}></col>
            <col span={1} style={{ width: "70%" }}></col>
          </colgroup>
          <tbody>
            <tr>
              <td style={{ fontSize: 12, color: "#1c1c1c", fontWeight: 500 }}>Бюджет:</td>
              <td style={{ fontSize: 12, color: "#254A63", fontWeight: 500 }}>{project.budget}</td>
            </tr>
            <tr>
              <td style={{ fontSize: 12, color: "#1c1c1c", fontWeight: 500 }}>Срок:</td>
              <td style={{ fontSize: 12, color: "#254A63", fontWeight: 500 }}>{project.term}</td>
            </tr>
          </tbody>
        </table>

        <span style={{ fontSize: 14, color: "#1c1c1c" }}>{project.description}</span>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 500, lineHeight: "130%" }}>Выполненные проекты</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: 30,
          borderRadius: 9,
          flex: 3,
          flexWrap: "wrap",
          rowGap: 30,
          marginBottom: 27,
        }}>
        <Project project={projectsData} />
        <Project project={projectsData} />
        <Project project={projectsData} />
        <Project project={projectsData} />
        <Project project={projectsData} />
        <Project project={projectsData} />
      </div>
      <span
        className={styles.showMore}
        onClick={() => {
          // setTransactionsShown(transactionsShown + 1);
        }}>
        Показать еще
      </span>
    </div>
  );
};

export default function CompanyServices(props) {
  const [objects, setObjects] = useState(null);
  const [addObject, setAddObject] = useState(false);
  const [objectAddressField, setObjectAddressField] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [startReached, setStartReached] = useState(false);
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <LayoutWorker title='ЖКХ Консьерж - данные компании' description='description' keywords='keywords'>
      <div className={workerStyles.container}>
        <h1 className={workerStyles.pageHeader}>Данные компании</h1>
        <span className={workerStyles.threeDotsBtn}>
          <div className={workerStyles.threeDotsBtnMenu}>
            {/* <Link href='/workers/edit-profile'> */}
            <span className={workerStyles.chatOptionsItem}>Редактировать</span>
            {/* </Link> */}
            <span
              className={workerStyles.chatOptionsItem}
              onClick={() => {
                // confirm("Удалить профиль? Это действие необратимо.") && deleteProfile();
              }}>
              Удалить
            </span>
          </div>
        </span>

        <CompanyInfo />
        <CompanyServiceTags />
        <CompanyProjects />
      </div>
    </LayoutWorker>
  );
}
