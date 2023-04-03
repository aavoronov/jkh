import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import AdItem from "../../components/AdItem";
import LayoutLoggedIn from "../../components/LayoutLoggedIn";
// import DropdownList from "../components/DropdownList";
import ProductCard from "../../components/ProductCard";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "./tradingplatform.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import Pagination from "../../components/Pagination";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import { loading } from "../../store/loaderSlice";
import { toggle } from "../../store/notificationSlice";
import { useRouter } from "next/router";

const SubcategoryItem = ({ name, selectedSubcategory, setSelectedSubcategory }) => {
  const [listIsShown, setListIsShown] = useState(false);
  return (
    <li className={styles.subcategoryWrap}>
      <span
        // className={listIsShown ? styles.subcategoryName + " " + styles.expanded : styles.subcategoryName}
        // onClick={() => setListIsShown(!listIsShown)}
        className={name === selectedSubcategory ? styles.subcategoryName + " " + styles.expanded : styles.subcategoryName}
        onClick={() => setSelectedSubcategory(name)}>
        {name}
      </span>
      {/* {listIsShown ? (
        <ul className={styles.subcategoryList}>
          <li className={styles.subsubcat}>Мобильные телефоны</li>
          <li className={styles.subsubcat}>Аксессуары</li>
          <li className={styles.subsubcat}>Рации</li>
          <li className={styles.subsubcat}>Стационарные</li>
        </ul>
      ) : null} */}
    </li>
  );
};

export class GetRequestParams {
  constructor() {}
  addParam(key, value) {
    this[key] = value;
  }
  serialize() {
    const params = new URLSearchParams(this);
    return params.toString();
  }
}

export default function TradingPlatform(props) {
  const router = useRouter();

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  // const [category, setCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [categoryHorizontal, setCategoryHorizontal] = useState("Любая категория");
  const [location, setLocation] = useState("Москва и Московская область");
  const [withPhotos, setWithPhotos] = useState(false);
  const [buySellMode, setBuySellMode] = useState("Любая категория");
  const [condition, setCondition] = useState([]);
  const [pmin, setPmin] = useState("");
  const [pmax, setPmax] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [filterReset, setFilterReset] = useState(true);

  const [products, setProducts] = useState([]);
  // const [productNew, setProductNew] = useState(false);
  // const [productUsed, setProductUsed] = useState(false);

  const [categories, setCategories] = useState([]);

  const [scrollPosition, setScrollPosition] = useState(0);

  const dispatch = useDispatch();
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (categories.length) {
      if (router.query.category) {
        setSelectedCategory(router.query.category);
      }
      if (router.query.subcategory) {
        setSelectedCategory(router.query.category);
        setSelectedSubcategory(router.query.subcategory);
      }
    }
  }, [categories]);

  async function getProducts(page) {
    try {
      dispatch(loading({ visible: true }));
      const query = new GetRequestParams();
      query.addParam("page", page);
      if (!!selectedCategory) {
        const currentCategory = categories.filter((item) => item.category === selectedCategory)[0];
        const id = currentCategory.id;
        query.addParam("category", id);
        // console.log(id, subId);

        if (selectedSubcategory) {
          const subId = currentCategory.subcategory.filter((item) => item.subcategory === selectedSubcategory)[0].id;
          query.addParam("subcategoryId", subId);
        }
        buySellMode !== "Любая категория" && query.addParam("wts", buySellMode === "Куплю" ? 0 : 1);
        condition.length && query.addParam("condition", condition);
        pmin && query.addParam("pmin", pmin);
        pmax && query.addParam("pmax", pmax);
      } else {
        if (categoryHorizontal !== "Любая категория") {
          const currentCategoryId = categories.filter((item) => item.category === categoryHorizontal)[0].id;
          query.addParam("category", currentCategoryId);
        }

        query.addParam("wimgsonly", withPhotos ? 1 : 0);
        // location && query.addParam("location", location);
        searchQuery && query.addParam("searchQuery", searchQuery);
      }

      // console.log(query.serialize());
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform?${query.serialize()}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      setProducts(res.data.products);
      setPageCount(res.data.count);
    } catch (e) {
      console.log(e);
    }
    dispatch(loading({ visible: false }));
  }

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategoryHorizontal("Любая категория");
    setLocation("Москва и Московская область");
    setWithPhotos(false);
    setBuySellMode("Любая категория");
    setCondition([]);
    setPmin("");
    setPmax("");
    setSearchQuery("");
    setPage(1);
    setFilterReset((prev) => !prev);
  };

  useEffect(() => {
    getProducts(page);
  }, [filterReset]);

  const hasWindow = typeof window !== "undefined";

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trading-platform/categories`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });
        console.log(res.data);
        setCategories(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getCategories();
  }, []);

  // useEffect(() => {
  //   if (hasWindow) {
  //     const cat = window?.location.search.split("&")[0].slice(10);
  //     const subcat = window?.location.search.split("&")[1].slice(12);
  //     console.log(decodeURI(subcat).replace("+", " "));

  //     setSelectedCategory(decodeURI(cat).replace("+", " "));
  //     setSelectedSubcategory(decodeURI(subcat).replace("+", " "));
  //   }
  // }, [hasWindow]);

  useEffect(() => {
    getProducts(page);
  }, []);

  const DropdownList = ({ objects, value, setValue, className = "" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
      <div className={styles.dropdownWrap + " " + className}>
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

  useEffect(() => {
    if (width > 768) {
      setLeftMenuIsOpen(true);
    } else {
      setLeftMenuIsOpen(false);
    }
  }, [width]);

  return (
    <LayoutLoggedIn>
      {width <= 768 && leftMenuIsOpen && (
        <div
          id={styles.overlay}
          onClick={() => {
            setLeftMenuIsOpen(false);
          }}></div>
      )}
      <aside className={leftMenuIsOpen ? styles.leftMenu : styles.leftMenu + " " + styles.collapsed}>
        {!selectedCategory ? (
          <div className={styles.categories}>
            <span className={styles.categoriesHeader}>Категории</span>

            {categories.map((item, index) => {
              return (
                <div className={styles.form_radio} onClick={() => setSelectedCategory(item.category)} key={index}>
                  <input id={`category-${index}`} className={styles.radio} type='radio' name='category' value={item.category} />
                  <label htmlFor={`category-${index}`}>{item.category}</label>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <span className={styles.categoriesHeader}>{selectedCategory}</span>
            <ul className={styles.subcategories}>
              {/* <SubcategoryItem name='Телефоны' />
              <SubcategoryItem name='Аудио и видео' />
              <SubcategoryItem name='Товары для компьютера' />
              <SubcategoryItem name='Игры, приставки' />
              <SubcategoryItem name='Фототехника' />
              <SubcategoryItem name='Планшеты, ноутбуки' />
              <SubcategoryItem name='Оргтехника, расходники' /> */}
              {categories
                .filter((item) => item.category === selectedCategory)[0]
                .subcategory.map((item, index) => (
                  <SubcategoryItem
                    key={index}
                    name={item.subcategory}
                    selectedSubcategory={selectedSubcategory}
                    setSelectedSubcategory={setSelectedSubcategory}
                  />
                ))}
            </ul>
            <div className={styles.filterWrap}>
              <span className={styles.filterBlockName}>Состояние</span>

              {/* <div className={styles.form_radio} onClick={() => setCondition("any")}>
                <input id={`category-1`} className={styles.radio} type='radio' name='category' value={"any"} />
                <label htmlFor={`category-1`}>Любое</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("new")}>
                <input id={`category-2`} className={styles.radio} type='radio' name='category' value={"new"} />
                <label htmlFor={`category-2`}>Только новое</label>
              </div>

              <div className={styles.form_radio} onClick={() => setCondition("used")}>
                <input id={`category-3`} className={styles.radio} type='radio' name='category' value={"used"} />
                <label htmlFor={`category-3`}>Только б/у</label>
              </div> */}

              {[
                "Состояние нового",
                "Отличное состояние",
                "Хорошее состояние",
                "Удовлетворительное состояние",
                "Требуется ремонт",
                "На запчасти",
              ].map((item, index) => (
                <label htmlFor='condition' className={styles.fieldName + " " + styles.checkboxWrap} key={index}>
                  <div
                    name='condition'
                    className={condition.includes(index) ? styles.checkbox + " " + styles.checked : styles.checkbox}
                    onClick={() => {
                      setCondition((prev) => (condition.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
                    }}></div>
                  <span
                    className={styles.filterNameWithHeader}
                    onClick={() => {
                      setCondition((prev) => (condition.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
                    }}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <div className={styles.filterWrap}>
              <span className={styles.filterBlockName}>Цена, ₽</span>
              <div className={styles.priceRange}>
                <div className={styles.price}>
                  <span>от</span>
                  <input
                    value={pmin}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        setPmin(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className={styles.price}>
                  <span>до</span>
                  <input
                    value={pmax}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        setPmax(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldWrap}>
              <button
                className={styles.submitBtn}
                onClick={() => {
                  if (!!pmin && !!pmax && parseInt(pmin) > parseInt(pmax)) {
                    dispatch(toggle({ text: "Минимальная цена должна быть меньше максимальной", type: "error" }));
                  } else {
                    setPage(1);
                    getProducts(page);
                  }
                }}>
                Показать объявления
              </button>
              <span
                className={styles.cancelBtn}
                onClick={() => {
                  resetFilters();
                  // console.log(selectedCategory);
                  // console.log(selectedSubcategory);
                }}>
                Сбросить фильтр
              </span>
            </div>
          </div>
        )}
        <AdItem buttonText='подключить сервис' buttonLink='#' image={"/img/payAd.png"} width={245} height={342} />
      </aside>
      <div className={styles.container}>
        <Link href='/trading-platform/new'>
          <div className={styles.createAdBtn}>
            <span>+</span>
            <span>Разместить объявление</span>
          </div>
        </Link>
        {width < 768 ? (
          <>
            <button
              className={leftMenuIsOpen ? styles.collapseMenuBtn : styles.collapseMenuBtn + " " + styles.collapsed}
              onClick={() => {
                setLeftMenuIsOpen(!leftMenuIsOpen);
              }}>
              <Image src={arrowLeft} alt='' width={14} height={31} />
            </button>
          </>
        ) : null}
        {/* <div className={styles.breadcrumbs}>
          <span>Главная</span>
          <span>Торговая площадка </span>
          {selectedCategory ? (
            <>
              <span>{selectedCategory}</span>
              <span>Телефоны, смартфоны, рации в Москве</span>
            </>
          ) : null}
        </div> */}

        {selectedCategory ? (
          <DropdownList
            objects={["Любая категория", "Куплю", "Продам"]}
            value={buySellMode}
            setValue={setBuySellMode}
            className={styles.buySell}
          />
        ) : (
          <div className={scrollPosition < 80 ? styles.filtersFixed : styles.filtersFixed + " " + styles.offset}>
            <div className={styles.filters}>
              <DropdownList objects={categories.map((item) => item.category)} value={categoryHorizontal} setValue={setCategoryHorizontal} />

              <input
                className={styles.filtersInput}
                placeholder='Поиск по объявлениям'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DropdownList
                objects={["Москва и Московская область", "Ленинград и Ленинградская область", "Свердловск и Свердловская область"]}
                value={location}
                setValue={setLocation}
              />
              <button
                className={styles.findBtn}
                onClick={() => {
                  setPage(1);
                  getProducts(page);
                }}>
                Найти
              </button>
            </div>
            <div className={styles.filterOptions}>
              <label htmlFor='withPhotos' className={styles.fieldName + " " + styles.checkboxWrap}>
                <div
                  name='withPhotos'
                  className={withPhotos ? styles.checkbox + " " + styles.checked : styles.checkbox}
                  onClick={() => {
                    setWithPhotos(!withPhotos);
                  }}></div>
                <span className={styles.filterNameWithHeader}>Только с фото</span>
              </label>
            </div>
          </div>
        )}
        <div className={styles.productsBlock}>
          <div className={styles.productsHeader}>Рекомендуем для вас</div>
          {!products.length && (
            <span className={styles.createAd}>
              По заданным параметрам ничего не найдено. Пожалуйста, попробуйте изменить параметры поиска.
            </span>
          )}
          <div className={styles.productsWrap}>
            {products.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
          <Pagination
            // className='pagination-bar'
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            currentPage={page}
            totalCount={pageCount}
            pageSize={process.env.NEXT_PUBLIC_TP_PAGE_LIMIT}
            onPageChange={(page) => {
              setPage(page);
              getProducts(page);
            }}
          />
        </div>
      </div>
    </LayoutLoggedIn>
  );
}

// export async function getServerSideProps(context) {
//   console.log("params" + " " + context.params);

//   return {
//     props: {
//       category: context.params.category || null,
//       subcategory: context.params.subcategory || null,
//     },
//   };
// }
