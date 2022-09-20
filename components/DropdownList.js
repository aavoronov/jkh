import React, { useState } from "react";
import styles from "./dropdownList.module.scss";

const DropdownList = ({ objects, value, setValue, style }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className={styles.dropdownWrap} style={style}>
      <div className={styles.dropdownFieldWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className={styles.dropdownField}>{value}</span>
        <span className={styles.dropdownBtn}></span>
      </div>
      {dropdownOpen ? (
        <ul className={styles.dropdownList}>
          {objects.map((item, index) => (
            <li
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

export default DropdownList;
