import React, { useEffect, useState } from "react";

import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../components/LayoutWorker";
import { currentDatetime, getGeocode } from "../../service/functions";
import { toggle } from "../../store/notificationSlice";
import { updateRole } from "../../store/userSlice";
import styles from "./workers.module.scss";

export default function CompanyServices(props) {
  return (
    <LayoutWorker title='ЖКХ Консьерж - услуги компании' description='description' keywords='keywords'>
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Услуги компании</h1>
      </div>
    </LayoutWorker>
  );
}
