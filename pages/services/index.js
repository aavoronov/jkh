import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import LayoutLoggedIn from "../../components/LayoutLoggedIn";
import ServiceAd from "../../components/ServiceAd";
// import DropdownList from "../components/DropdownList";
import arrowLeft from "/public/img/arrowLeft.png";

import styles from "./services.module.scss";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import Pagination from "../../components/Pagination";
import useWindowDimensions from "../../components/useWindowDimensionsSSR";
import { loading } from "../../store/loaderSlice";
import { GetRequestParams } from "../trading-platform";

// SwiperCore.use([Navigation]);

export default function Services(props) {
  const [guarantee, setGuarantee] = useState(false);
  const [withAccommodation, setWithAccommodation] = useState(false);
  const [withoutAccommodation, setWithoutAccommodation] = useState(false);
  const [radius, setRadius] = useState(null);
  const [contract, setContract] = useState(false);
  const [examples, setExamples] = useState(false);
  const [privatePerson, setPrivatePerson] = useState(false);
  const [organization, setOrganization] = useState(false);
  const [jobNow, setJobNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [categories, setCategories] = useState(null);

  // const [categoryHorizontal, setCategoryHorizontal] = useState("Любая категория");
  // const [location, setLocation] = useState("Москва и Московская область");
  // const [withPhotos, setWithPhotos] = useState(false);
  // const [buySellMode, setBuySellMode] = useState("Любая категория");
  // const [condition, setCondition] = useState([]);
  // const [pmin, setPmin] = useState("");
  // const [pmax, setPmax] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [filterReset, setFilterReset] = useState(true);
  const [services, setServices] = useState([]);

  const [activeObject, setActiveObject] = useState(null);
  const [activeService, setActiveService] = useState("Все категории");

  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(null);
  const [estateObjects, setEstateObjects] = useState([]);

  useEffect(() => {
    async function getEstateObjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estate-objects`, {
          headers: { Authorization: getCookie("jkh-token") },
        });
        setEstateObjects(res.data);
        setActiveObject(res.data[0].estateObject.address + ", " + res.data[0].estateObject.apartment);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getEstateObjects();
  }, []);

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();

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

  async function getServices(page) {
    try {
      dispatch(loading({ visible: true }));
      const query = new GetRequestParams();
      query.addParam("page", page);
      !!guarantee && query.addParam("warranty", true);
      !!contract && query.addParam("contract", true);
      !!isChecked && query.addParam("isChecked", true);
      !!examples && query.addParam("withPortfolio", true);
      !!privatePerson && !organization && query.addParam("privatePerson", true);
      !!organization && !privatePerson && query.addParam("organization", true);
      !!withAccommodation && !withoutAccommodation && query.addParam("withAccommodation", true);
      !!withoutAccommodation && !withAccommodation && query.addParam("withoutAccommodation", true);

      activeService !== "Все категории" && query.addParam("category", categories.find((item) => item.category === activeService).id);
      //radius
      //address
      //city
      //estate object
      //job now?

      console.log(query.serialize());
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services?${query.serialize()}`, {
        headers: {
          Authorization: getCookie("jkh-token"),
        },
      });
      console.log(res.data);
      setServices(res.data.services);
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
    getServices(page);
  }, [filterReset]);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, {
          headers: {
            Authorization: getCookie("jkh-token"),
          },
        });
        setCategories(res.data);
        console.log(res.data);
        // console.log(["Все категории", ...res.data.map((item) => item.category)]);
      } catch (e) {
        console.log(e);
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    getServices(page);
  }, []);

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
        <div className={styles.filtersHeader}>Фильтр</div>
        <div className={styles.filterWrap}>
          <label htmlFor='guarantee' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='guarantee'
              className={guarantee ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setGuarantee((prev) => !prev);
                // changeStateWithDelay(setGuarantee, !guarantee);
              }}></div>
            <span className={styles.filterName}>С гарантией</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <span className={styles.filterBlockName}>Проживание на объекте</span>
          <label htmlFor='withAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='withAccommodation'
              className={withAccommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setWithAccommodation(!withAccommodation);
              }}></div>
            <span className={styles.filterNameWithHeader}>Да</span>
          </label>
          <label htmlFor='withoutAccommodation' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='withoutAccommodation'
              className={withoutAccommodation ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setWithoutAccommodation(!withoutAccommodation);
              }}></div>
            <span className={styles.filterNameWithHeader}>Нет</span>
          </label>
        </div>

        <div className={styles.filterWrap + " " + styles.fieldWithBtn}>
          <span className={styles.filterBlockName}>Место, город</span>
          <input name='name' type='text' placeholder='Выбрать город' className={styles.field} />
        </div>

        <div className={styles.filterWrap}>
          <div className={styles.form_radio} onClick={() => setRadius("5km")}>
            <span className={styles.filterBlockName}>Радиус поиска услуги</span>
            <input id='radio-1' className={styles.radio} type='radio' name='radius' value='1' />
            <label htmlFor='radio-1'>5 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("10km")}>
            <input id='radio-2' className={styles.radio} type='radio' name='radius' value='2' />
            <label htmlFor='radio-2'>10 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("15km")}>
            <input id='radio-3' className={styles.radio} type='radio' name='radius' value='3' />
            <label htmlFor='radio-3'>15 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("20km")}>
            <input id='radio-4' className={styles.radio} type='radio' name='radius' value='4' />
            <label htmlFor='radio-4'>20 км</label>
          </div>

          <div className={styles.form_radio} onClick={() => setRadius("any")}>
            <input id='radio-5' className={styles.radio} type='radio' name='radius' value='5' />
            <label htmlFor='radio-5'>Любое расстояние </label>
          </div>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='contract' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='contract'
              className={contract ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setContract(!contract);
              }}></div>
            <span className={styles.filterName}>Работа по договору</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='examples' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='examples'
              className={examples ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setExamples((prev) => !prev);
              }}></div>
            <span className={styles.filterName}>С примерами работ</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <span className={styles.filterBlockName}>Тип исполнителя</span>
          <label htmlFor='privatePerson' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='privatePerson'
              className={privatePerson ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setPrivatePerson(!privatePerson);
              }}></div>
            <span className={styles.filterNameWithHeader}>Частное лицо</span>
          </label>
          <label htmlFor='organization' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='organization'
              className={organization ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setOrganization(!organization);
              }}></div>
            <span className={styles.filterNameWithHeader}>Организация</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='passport' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='passport'
              className={isChecked ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setIsChecked((prev) => !prev);
              }}></div>
            <span className={styles.filterName}>С проверенным паспортом</span>
          </label>
        </div>

        <div className={styles.filterWrap}>
          <label htmlFor='jobNow' className={styles.fieldName + " " + styles.checkboxWrap}>
            <div
              name='jobNow'
              className={jobNow ? styles.checkbox + " " + styles.checked : styles.checkbox}
              onClick={() => {
                setJobNow(!jobNow);
              }}></div>
            <span className={styles.filterName}>Работа сейчас</span>
          </label>
        </div>
        <div className={styles.fieldWrap}>
          <button
            className={styles.submitBtn}
            onClick={() => {
              setPage(1);
              getServices(page);
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
      </aside>
      <div className={styles.container}>
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
        {/* {width < 768 ? <div id={styles.overlay} className={leftMenuIsOpen ? "" : styles.hidden}></div> : null} */}
        {isLoading ? (
          <div id={styles.overlay} className={styles.loader}>
            <div className={styles.loaderWrap}>
              <RotatingLines
                strokeColor='#FF8C00'
                strokeWidth='5'
                animationDuration='0.75'
                width='40'
                visible={true}
                className={styles.loader}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.mainInputWrap + " " + styles.fieldWithBtn}>
          <input name='name' type='text' placeholder='Я хочу найти...' className={styles.field} />
        </div>
        <div className={styles.dropdownsWrap}>
          <div className={styles.dropdownName}>
            <span className={styles.dropdownLabel}>Адрес объекта</span>
            <DropdownList
              objects={estateObjects.map((item) => item.estateObject.address + ", " + item.estateObject.apartment)}
              value={activeObject}
              setValue={setActiveObject}
              className={styles.dropdownServices}
            />
          </div>
          <div className={styles.dropdownName}>
            <span className={styles.dropdownLabel}>Виды услуг</span>
            {!!categories && (
              <DropdownList
                objects={["Все категории", ...categories.map((item) => item.category)]}
                value={activeService}
                setValue={setActiveService}
                className={styles.dropdownServices}
              />
            )}
            {/* <DropdownList objects={servicesList} value={activeService} setValue={setActiveService} /> */}
          </div>
        </div>
        <span className={styles.filterHeader}>{activeService}</span>
        {/* {mastersData.map((item, index) => (
          <ServiceAd data={item} key={index} />
        ))} */}
        {services.map((item, index) => (
          <ServiceAd data={item} key={index} />
        ))}
        {/* <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} />
        <ServiceAd sliderPhotos={portfolio} /> */}
        <Pagination
          // className='pagination-bar'
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
          currentPage={page}
          totalCount={pageCount}
          pageSize={process.env.NEXT_PUBLIC_SERVICES_PAGE_LIMIT}
          onPageChange={(page) => {
            setPage(page);
            getServices(page);
          }}
        />
      </div>
    </LayoutLoggedIn>
  );
}
