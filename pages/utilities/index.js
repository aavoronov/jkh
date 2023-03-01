import React, { useEffect } from "react";
import styles from "./utilities.module.scss";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import EstateObject from "../../components/EstateObject";

import { objectsData } from "../../components/data";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";
import Link from "next/link";

export default function Utilities(props) {
  const [estateObjects, setEstateObjects] = useState([]);
  useEffect(() => {
    async function getEstateObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        // const prepareData = () => {
        //   let data = [];
        //   res.data.forEach((item) => {
        //     return data.push({
        //       address: item.estateObject.address.split(",").slice(-2).join().trim() + ", " + item.estateObject.apartment,
        //       coordinates: [+item.estateObject.latitude, +item.estateObject.longitude],
        //     });
        //   });
        //   return data;
        // };
        setEstateObjects(res.data);
        console.log(res.data);
        // setDropdownValue(res.data[0].estateObject.address.split(",").slice(-2).join().trim() + ", " + res.data[0].estateObject.apartment);
      } catch (e) {
        console.log(e);
      }
    }
    getEstateObjects();
  }, []);

  return (
    <LayoutLoggedIn>
      {estateObjects.length ? (
        estateObjects.map((i, index) => <EstateObject data={i.estateObject} key={i.id} />)
      ) : (
        <div style={{ marginTop: 30, marginLeft: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ textAlign: "center", marginBottom: 15 }}>
            Вы пока не зарегистрировали ни одного объекта недвижимости. Вы можете сделать это в личном кабинете.
          </span>
          <Link href='/personal'>
            <span className={styles.objPayBtn}>Перейти в личный кабинет</span>
          </Link>
        </div>
      )}
    </LayoutLoggedIn>
  );
}
