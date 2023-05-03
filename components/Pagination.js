import React from "react";
import { usePagination, DOTS } from "./usePagination";
import styles from "./pagination.module.scss";
const Pagination = (props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className = "" } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    // <ul className={styles["pagination-container"] + " " + styles[className]}>
    <ul className={styles["pagination-container"]}>
      <li
        className={
          currentPage === 1
            ? styles["paginationArrow"] + " " + styles["left"] + " " + styles.disabled
            : styles["paginationArrow"] + " " + styles["left"]
        }
        onClick={onPrevious}></li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li className={styles["pagination-item"] + " " + styles.dots} key={pageNumber}>
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={pageNumber}
            className={currentPage === pageNumber ? styles["pagination-item"] + " " + styles.selected : styles["pagination-item"]}
            onClick={() => onPageChange(pageNumber)}>
            {pageNumber}
          </li>
        );
      })}
      <li
        className={currentPage === lastPage ? styles["paginationArrow"] + " " + styles.disabled : styles["paginationArrow"]}
        onClick={onNext}></li>
    </ul>
  );
};

export default Pagination;
