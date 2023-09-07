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
import styles from "./tenders.module.scss";
import Tender from "../../components/Tender";

const DropdownList = ({ objects, value, setValue }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className={styles.dropdownWrap}>
      <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className={styles.dropdownField}>{value}</span>
        <span className={styles.dropdownBtn}></span>
      </div>
      {dropdownOpen ? (
        <ul className={styles.dropdownList}>
          {objects.map((item, index) => (
            <li
              // key={item.id}
              key={index}
              className={styles.dropdownListItem}
              onClick={() => {
                setValue(item);
                setDropdownOpen(false);
              }}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const cities = ["Москва", "Ленинград", "Свердловск", "Калинин"];
const tags = ["Электромонтаж", "Монтажные работы", "Замена труб", "Перекрытие крыши"];

const tender = {
  name: "Монтажные работы",
  photos: [
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
    "/img/temp/project.png",
  ],
  address: "Москва, ул. Ленина, д. 12",
  budget: "По договоренности",
  term: "от 5 месяцев",
  description: "Выполню любой спектр сантехнических услуг: отопление, водоотведение, канализация, установка сантехнического оборудования. ",
};

export default function Tenders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [workType, setWorkType] = useState(tags[0]);
  return (
    <LayoutWorker title='ЖКХ Консьерж - тендеры' description='description' keywords='keywords'>
      <div className={workerStyles.container}>
        <h1 className={workerStyles.pageHeader}>Тендеры</h1>
        <div style={{ backgroundColor: "#fff", borderRadius: 24, width: "100%", ...padding(30) }}>
          <div className={styles.mainInputWrap + " " + styles.fieldWithBtn}>
            <input
              name='name'
              type='text'
              placeholder='Я хочу найти...'
              className={styles.field}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "row", columnGap: 60, marginBottom: 28 }}>
            <div style={{ width: "50%" }}>
              <div style={{ fontSize: 12, color: "#1c1c1c", marginBottom: 8 }}>Город</div>
              <DropdownList objects={cities} value={city} setValue={setCity} />
            </div>
            <div style={{ width: "50%" }}>
              <div style={{ fontSize: 12, color: "#1c1c1c", marginBottom: 8 }}>Виды работ</div>
              <DropdownList objects={tags} value={workType} setValue={setWorkType} />
            </div>
          </div>

          <div>
            <span style={{ color: "#1c1c1c", fontSize: 16, fontWeight: 500, marginBottom: 18, display: "block" }}>{workType}</span>
          </div>
          <Tender tender={tender} />
        </div>
      </div>
    </LayoutWorker>
  );
}
