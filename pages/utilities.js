import React from "react";

import LayoutLoggedIn from "../components/LayoutLoggedIn";
import EstateObject from "../components/EstateObject";

export default function Utilities(props) {
  let data = {
    estateObjects: [
      {
        name: "2-комнатная квартира",
        address: "Москва, ул. Маяковского, д.5, кв.125. Хотя скорее всего будет две строки или три даже",
        debtValue: 99875.89,
        notifications: {
          chat: 5,
          map: 10,
          general: 7,
        },
        buildingYear: 1147,
        overhaulYear: 1780,
        floorsNumber: 40,
        apartmentsNumber: 800,
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
      },
      {
        name: "Однушка 7 м в Капотне",
        address: "Москва, ул. Другая, д.5, кв.125. Хотя скорее всего будет две строки или три даже",
        debtValue: 0,
        notifications: {
          chat: 0,
          map: 11,
          general: 7,
        },
        buildingYear: 1347,
        overhaulYear: 1980,
        floorsNumber: 400,
        apartmentsNumber: 8000,
        payments: [
          {
            purpose: "ТСЖ № 63545-863456-99",
            plan: 100,
            fact: 150,
            receipt: "pretend this is an url",
            payLink: "pretend this is an URL too maybe?",
          },
          {
            purpose: "Электроэнергия № 45789342552-22",
            plan: 7,
            fact: 7,
            receipt: "pretend this is an url",
            payLink: "pretend this is an URL too maybe?",
          },
          {
            purpose: "МТС № 45782342341952-22",
            plan: 9,
            fact: 9,
            receipt: "pretend this is an url",
            payLink: "pretend this is an URL too maybe?",
          },
        ],
      },
    ],
  };

  return (
    <LayoutLoggedIn>
      {data.estateObjects.map((i, index) => (
        <EstateObject data={i} key={index} />
      ))}
    </LayoutLoggedIn>
  );
}
