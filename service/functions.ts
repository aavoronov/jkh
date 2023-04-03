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
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
