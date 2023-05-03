import React, { useEffect } from "react";
import styles from "./utilities.module.scss";

import EstateObject from "../../components/EstateObject";
import LayoutLoggedIn from "../../components/LayoutLoggedIn";

import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useState } from "react";

const validAccounts = [
  "08228414",
  "55235853",
  "76976621",
  "27268741",
  "68547438",
  "89222248",
  "73074474",
  "29382958",
  "87375518",
  "30194993",
  "84395952",
  "33567687",
];

export default function Utilities(props) {
  const [estateObjects, setEstateObjects] = useState([]);
  useEffect(() => {
    async function getEstateObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects/notifications`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        setEstateObjects(res.data);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getEstateObjects();
  }, []);

  return (
    <LayoutLoggedIn>
      {estateObjects.length ? (
        estateObjects.map((i, index) => <EstateObject data={i.estateObject} account={i.account} key={i.id} />)
      ) : (
        //
        <div style={{ marginTop: 30, marginLeft: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ textAlign: "center", marginBottom: 15 }}>
            Вы пока не зарегистрировали ни одного объекта недвижимости. Вы можете сделать это в личном кабинете.
          </span>
          <Link href='/personal'>
            <span className={styles.objPayBtn}>Перейти в личный кабинет</span>
          </Link>
        </div>
      )}
      {/* {estateObjects.length ? <EstateObject data={estateObjects[0].estateObject} account={"invalid"} /> : null} */}
    </LayoutLoggedIn>
  );
}
