import React from "react";

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import EstateObject from "../../components/EstateObject";

import { objectsData } from "../../components/data";

export default function Utilities(props) {
  return (
    <LayoutLoggedIn>
      {objectsData.map((i, index) => (
        <EstateObject data={i} key={index} />
      ))}
    </LayoutLoggedIn>
  );
}
