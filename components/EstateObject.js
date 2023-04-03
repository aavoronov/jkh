import React, { useEffect, useState } from "react";
import styles from "./estateobject.module.scss";
import Image from "next/image";
import Link from "next/link";

import chatBtnIcon from "../public/img/chatBtnIcon.png";
import mapBtnIcon from "../public/img/mapBtnIcon.png";
import bellBtnIcon from "../public/img/bellBtnIcon.png";
import workerBtnIcon from "../public/img/workerBtnIcon.png";
import objectIcon from "../public/img/objectIcon.png";
import estateInfoIcon from "../public/img/estateInfoIcon.png";
import servicesBlockIcon from "../public/img/servicesBlockIcon.png";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function EstateObject({ data, account }) {
  console.log(data);
  console.log(account);

  const [objectData, setObjectData] = useState(null);
  const [debtValue, setDebtValue] = useState(0);
  const [error, setError] = useState(null);
  // const data = props.data;

  useEffect(() => {
    async function getData() {
      try {
        // const acct = await axios.get(
        //   `${process.env.NEXT_PUBLIC_RIAS_URL}accounts?number=${account}&fields=id,number&access-token=d53edeb9a638915b534e`,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       // Accept: "application/json",
        //       // "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
        //     },
        //   }
        // );
        // console.log(acct.data);
        // const res = await axios.get(
        //   `${process.env.NEXT_PUBLIC_RIAS_URL}payment-documents?access-token=${process.env.NEXT_PUBLIC_RIAS_TOKEN}&account_id=${acct.data.id}&fields=total_payable_by_pd_with_debt_and_advance,account_id,sync_date,period_year,period_month`,
        //   // "http://api.sit2.rucode.org/v2.0/payment-documents?access-token=d53edeb9a638915b534e&fields=total_payable_by_pd_with_debt_and_advance,account_id,sync_date,period_year,period_month",
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     // Accept: "application/json",
        //     // "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
        //   },
        // }
        // );
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/utilities/${account}`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });
        console.log(res.data);
        setObjectData(res.data);
        // setDebtValue(res.debt);
      } catch (e) {
        console.log(e);
        setError({ type: e.response.data.type, text: "Данные не получены: " + e.response.data.text });
      }
    }
    getData();
  }, []);

  const info = {
    debtValue: 10000,
    payments: [
      {
        purpose: "ТСЖ № 63545-86-99",
        plan: 100,
        fact: 100,
        receipt: "pretend this is an url",
        payLink: "pretend this is an URL too maybe?",
      },
      {
        purpose: "Электроэнергия № 4578952-22",
        plan: 10,
        fact: 10,
        receipt: "pretend this is an url",
        payLink: "pretend this is an URL too maybe?",
      },
      {
        purpose: "МТС № 4578952-22",
        plan: 5,
        fact: 5,
        receipt: "pretend this is an url",
        payLink: "pretend this is an URL too maybe?",
      },
    ],
    notifications: {
      chat: 3,
      map: 11,
      general: 7,
    },
    buildingYear: 1347,
    overhaulYear: 1980,
    floorsNumber: 400,
    apartmentsNumber: 8000,
  };

  // let rawValue = data.debtValue;
  const result = debtValue.toLocaleString(); // large number kerning

  let planOverall = 0;
  info.payments.forEach((item) => (planOverall += item.plan));
  let factOverall = 0;
  info.payments.forEach((item) => (factOverall += item.fact));

  const [objectIsExpanded, setObjectIsExpanded] = useState(false);
  const [objectIsRefreshing, setObjectIsRefreshing] = useState(false);

  const imitateObjectRefresh = () => {
    setObjectIsRefreshing(true);
    setTimeout(() => {
      setObjectIsRefreshing(false);
    }, 3000);
  };
  const [activeTab, setActiveTab] = useState(1);
  const [activeTimelapseTab, setActiveTimelapseTab] = useState("month");

  const addressSplit = data.address.split(",");
  const name = addressSplit.slice(-2).join().trim();
  const address = addressSplit.slice(0, addressSplit.length - 2).join();
  console.log(name);
  console.log(address);

  const TabBlock = () => {
    return (
      <div className={styles.functionalTabsWrap}>
        <span className={activeTab == 1 ? styles.tabItem + " " + styles.active : styles.tabItem} onClick={() => setActiveTab(1)}>
          Детализация платежей
        </span>
        <span className={activeTab == 2 ? styles.tabItem + " " + styles.active : styles.tabItem} onClick={() => setActiveTab(2)}>
          Передача показаний
        </span>
        <span className={activeTab == 3 ? styles.tabItem + " " + styles.active : styles.tabItem} onClick={() => setActiveTab(3)}>
          История платежей
        </span>
      </div>
    );
  };

  const TimelapseTabBlock = () => {
    return (
      <div className={styles.timelapseTabBlock}>
        <span
          className={activeTimelapseTab == "month" ? styles.timelapseTabItem + " " + styles.active : styles.timelapseTabItem}
          onClick={() => setActiveTimelapseTab("month")}>
          Месяц
        </span>
        <span
          className={activeTimelapseTab == "quarter" ? styles.timelapseTabItem + " " + styles.active : styles.timelapseTabItem}
          onClick={() => setActiveTimelapseTab("quarter")}>
          Квартал
        </span>
        <span
          className={activeTimelapseTab == "year" ? styles.timelapseTabItem + " " + styles.active : styles.timelapseTabItem}
          onClick={() => setActiveTimelapseTab("year")}>
          Год
        </span>
      </div>
    );
  };

  return (
    <div className={styles.objectItem}>
      <div className={styles.objectFirstHalf}>
        <div className={styles.objectManage}>
          <div className={styles.objectProperties}>
            <div className={styles.iconWrap}>
              <Image src={objectIcon} alt='' />
            </div>
            <div className={styles.objectInfo}>
              <div className={styles.objName}>
                <span className={styles.objectTitle}>{name + ", " + data.apartment}</span>
                <span className={styles.objectAddress}>{address}</span>
                {error && <span style={{ marginTop: 10 }}>{error.text}</span>}
                {!error && !!objectData?.sum && (
                  <div className={styles.objectMonetaryStuff}>
                    <span className={styles.objectDebtBtn} onClick={() => console.log(objectData)}>
                      {objectData?.sum < 0 ? "Переплата" : objectData?.sum > 0 ? "К оплате" : "Задолженности нет"}
                    </span>
                    <button className={styles.debtBtnIcon}></button>
                    <span className={objectData.sum <= 0 ? styles.objectValue + " " + styles.isZero : styles.objectValue}>
                      {objectData.sum} &#x20bd;
                    </span>
                    <button
                      className={objectIsRefreshing ? styles.refreshBtn + " " + styles.rotating : styles.refreshBtn}
                      onClick={imitateObjectRefresh}></button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {error === null && !!objectData?.sum && (
            <span className={objectData.sum <= 0 ? styles.objPayBtn + " " + styles.inactive : styles.objPayBtn}>Оплатить</span>
          )}
        </div>
        <div className={styles.firstHalfBtnsWrap}>
          <Link href='/chat'>
            <div className={styles.objectBtn}>
              <div className={styles.BtnIconRegular}>
                <Image src={chatBtnIcon} alt='' height={55} width={55} />
                <span className={styles.notificationsNumber}>{info.notifications.chat > 99 ? "99+" : info.notifications.chat}</span>
              </div>
              <span>
                Внутридомовой
                <br />
                чат
              </span>
            </div>
          </Link>
          <Link href='/interactive-map'>
            <div className={styles.objectBtn}>
              <div className={styles.BtnIconRegular}>
                <Image src={mapBtnIcon} alt='' height={55} width={55} />
                {/* <span className={styles.notificationsNumber}>{data.notifications.map}</span> */}
              </div>
              <span>
                Интерактивная
                <br />
                карта
              </span>
            </div>
          </Link>
          <div className={styles.objectBtn + " " + styles.standaloneBtns}>
            <Link href='/notifications'>
              <div className={styles.btnWrap}>
                <div className={styles.iconLarge}>
                  <Image src={bellBtnIcon} alt='' height={55} width={55} />
                  <span className={styles.notificationsNumber}>{info.notifications.general}</span>
                </div>
                <span>Уведомления</span>
              </div>
            </Link>
            <button className={styles.btnHorizontalExpand}></button>
          </div>

          <div className={styles.objectBtn + " " + styles.standaloneBtns}>
            <Link href='/services'>
              <div className={styles.btnWrap}>
                <div className={styles.iconSmall}>
                  <Image src={workerBtnIcon} alt='' height={36} width={36} />
                </div>
                <div className={styles.iconLarge}>
                  <Image src={workerBtnIcon} alt='' height={55} width={55} />
                </div>
                <span>Услуги мастеров</span>
              </div>
            </Link>
            <button className={styles.btnHorizontalExpand}></button>
          </div>
          <div className={styles.btnsHorWrap}>
            <div className={styles.objectBtnHorizontal}>
              <Link href='/notifications'>
                <div className={styles.btnWrap}>
                  <div className={styles.iconSmall}>
                    <Image src={bellBtnIcon} alt='' height={36} width={36} />
                  </div>
                  <div className={styles.iconLarge}>
                    <Image src={bellBtnIcon} alt='' height={55} width={55} />
                  </div>
                  <span>Уведомления</span>
                  <span className={styles.notificationsNumber + " " + styles.inline}>15</span>
                </div>
              </Link>
              <button className={styles.btnHorizontalExpand}></button>
            </div>

            <div className={styles.objectBtnHorizontal}>
              <Link href='/services'>
                <div className={styles.btnWrap}>
                  <div className={styles.iconSmall}>
                    <Image src={workerBtnIcon} alt='' height={36} width={36} />
                  </div>
                  <div className={styles.iconLarge}>
                    <Image src={workerBtnIcon} alt='' height={55} width={55} />
                  </div>
                  <span>Услуги мастеров</span>
                </div>
              </Link>
              <button className={styles.btnHorizontalExpand}></button>
            </div>
          </div>
        </div>
        {(!error?.type || error.type === "warn") && (
          <div className={styles.objectOptionsWrap}>
            {/* <div className={styles.objectOptionsBtn + " " + styles.threeDotsBtn}></div> */}
            <div
              className={
                objectIsExpanded
                  ? styles.upsideDown + " " + styles.objectOptionsBtn + " " + styles.expandBtn
                  : styles.objectOptionsBtn + " " + styles.expandBtn
              }
              onClick={() => {
                setObjectIsExpanded(!objectIsExpanded);
              }}></div>
          </div>
        )}
      </div>

      <div className={objectIsExpanded ? styles.objectSecondHalf : styles.objectSecondHalf + " " + styles.hidden}>
        <div className={styles.leftColumn}>
          <div className={styles.secondHalfBlock + " " + styles.estateInfo}>
            <div className={styles.iconWrap}>
              <Image src={estateInfoIcon} alt='' height={27} width={27} />
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.propertyTable}>
                <caption className={styles.blockSubtitle}>Общая информация об объекте:</caption>
                <colgroup style={{ width: "100%" }}>
                  <col span='1' style={{ width: "80%" }} />
                  <col span='1' style={{ width: "20%" }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>Год постройки</td>
                    <td>{info.buildingYear}</td>
                  </tr>
                  <tr>
                    <td>Год кап. ремонта</td>
                    <td>{info.overhaulYear}</td>
                  </tr>
                  <tr>
                    <td>Количество этажей</td>
                    <td>{info.floorsNumber}</td>
                  </tr>
                  <tr>
                    <td>Количество квартир</td>
                    <td>{info.apartmentsNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.secondHalfBlock + " " + styles.suggestedServices}>
            <div className={styles.servicesWrap}>
              <div className={styles.iconWrap}>
                <Image src={servicesBlockIcon} alt='' height={27} width={27} />
              </div>
              <div>
                <span className={styles.blockSubtitle}>Предлагаемые услуги:</span>
                <ul className={styles.servicesList}>
                  <li>Электромонтажники</li>
                  <li>Грузоперевозка</li>
                  <li>Сантехники</li>
                  <li>Еще что-то</li>
                </ul>
              </div>
            </div>
            <Link href='/services'>
              <span className={styles.allServicesBtn}>Все услуги</span>
            </Link>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <TabBlock />
          {activeTab == 1 ? (
            <>
              <TimelapseTabBlock />
              <div className={styles.secondHalfBlock}>
                <table className={styles.paymentTable}>
                  <colgroup>
                    <col span='1' className={styles.firstCol} />
                    <col span='1' className={styles.secondCol} />
                    <col span='1' className={styles.thirdCol} />
                    <col span='1' className={styles.fourthCol} />
                    <col span='1' className={styles.fifthCol} />
                  </colgroup>
                  <caption className={styles.paymentTableCaption}>
                    <div className={styles.iconWrap}>{/* <Image src={paymentHistoryIcon} alt='' height={27} width={27} /> */}</div>
                    <span className={styles.timelapseTitle}>Март-Апрель-Май 2022</span>
                  </caption>
                  <thead>
                    <tr>
                      <td>Счета</td>
                      <td>План</td>
                      <td>Факт</td>
                      <td>Платежка</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {info.payments.map((item) => (
                      <tr>
                        <td>{item.purpose}</td>
                        <td>{item.plan}</td>
                        <td>{item.fact}</td>
                        <td className={styles.receiptBtn}>Скачать{/* {item.receipt} */}</td>
                        <td className={styles.payBtn}>Оплатить{/* {item.payLink} */}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>ИТОГО</td>
                      <td>{planOverall}</td>
                      <td>{factOverall}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <span>здесь какая-то логика в зависимости от выбранного временного отрезка: это {activeTimelapseTab}</span>
            </>
          ) : activeTab == 2 ? (
            <div>Передача показаний</div>
          ) : (
            <div>История платежей</div>
          )}
        </div>
      </div>
    </div>
  );
}
