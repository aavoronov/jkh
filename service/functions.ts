import axios from "axios";
import { getCookie } from "cookies-next";

export enum Types {
  mapObject = "map object",
  mapReview = "map review",
  mapReply = "map reply",
  tradingPlatform = "trading platform",
  service = "service",
  serviceReview = "service review",
  chatMessage = "chat message",
  poll = "poll",
}

interface IComplaintData {
  reason?: string;
  text: string;
  type: Types;
  id: number;
}

interface IResponse {
  text: string;
  status: number;
}

export const createComplaint = async (data: IComplaintData): Promise<void> => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/complaints`, data, {
      headers: { Authorization: getCookie("jkh-token") },
    });
    // return { text: "success", status: 201 };
  } catch (e) {
    console.log(e);
  }
};

export async function getGeocode(addressOrCoords: string | [number, number]) {
  const res = await axios.get(
    `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.NEXT_PUBLIC_YMAPS_KEY}&geocode=${addressOrCoords}`
  );

  const isSuccess = !!res.data.response.GeoObjectCollection.featureMember.length;
  if (!isSuccess) {
    throw new Error("Введенный адрес не найден. Проверьте правильность введенного адреса");
  }
  //  const {data.response.GeoObjectCollection} = res
  // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text);
  const fullAddress = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
  const coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
  const precision = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.precision;
  // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted);
  // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point);
  const longitude = coords.split(" ")[0];
  const latitude = coords.split(" ")[1];

  return { geocodedAddress: fullAddress, latitude, longitude, precision };
}

export const currentDatetime = (date: string | Date) => {
  const datetime = typeof date === "object" ? date : new Date(date);

  return (
    datetime.getDate().toString().padStart(2, "0") +
    "." +
    (datetime.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    datetime.getFullYear().toString().slice(2) +
    " " +
    datetime.getHours().toString().padStart(2, "0") +
    ":" +
    datetime.getMinutes().toString().padStart(2, "0")
  );
};

interface IQueryParameters {
  method?: "get" | "post" | "delete" | "patch";
  url: string;
  noAuth?: boolean;
  payload?: any;
}

export const axiosConfig = (params: IQueryParameters) => {
  return {
    url: params.url,
    data: params.payload,
    method: params.method || "get",
    headers: {
      Authorization: !params.noAuth ? getCookie("jkh-token") : void 0,
      "Content-Type": params.payload instanceof FormData ? "multipart/form-data" : "application/json",
    },
  };
};
