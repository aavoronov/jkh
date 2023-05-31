import React from "react";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWorker from "../../../components/LayoutWorker";
import { toggle } from "../../../store/notificationSlice";
import styles from "../workers.module.scss";

export default function WorkerPolls(props) {
  const router = useRouter();
  const [chatAds, setChatAds] = useState([]);
  const dispatch = useDispatch();

  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    if (role === "uk" || role === "upravdom") {
      router.replace("/workers");
    }
  }, [role]);

  async function getMyChatAds() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat-ads`, { headers: { Authorization: getCookie("jkh-token") } });
      setChatAds(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMyChatAds();
  }, []);

  async function deleteChatAd(id) {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/chat-ads/${id}`, {
        headers: { Authorization: getCookie("jkh-token") },
      });
      setChatAds((prev) => prev.filter((item) => item.id !== id));
      dispatch(toggle({ text: "Объявление успешно удалено", type: "success" }));
    } catch (e) {
      console.log(e);
    }
  }

  async function payForChatAd(id, sum) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-ads/pay`,
        { sum: sum, id: id },
        {
          headers: { Authorization: getCookie("jkh-token") },
        }
      );
      // setChatAds((prev) => prev.filter((item) => item.id !== id));
      dispatch(toggle({ text: "Объявление оплачено", type: "success" }));
      getMyChatAds();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <LayoutWorker title='ЖКХ Консьерж - рекламные объявления' description='description' keywords='keywords'>
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Рекламные объявления</h1>

        {/* <span className={styles.threeDotsBtn}>

          
        </span> */}
        {/* <span className={styles.timelapseFilterAds}>За весь период</span> */}
        {!!chatAds.length ? (
          <div className={styles.adsWrap}>
            {chatAds.map((item, i) => (
              <div className={styles.chatMessagePartner} key={i}>
                {/* <span className={styles.objectLetters}>ЛИ</span> */}

                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <div
                    className={styles.messageBubble}
                    style={item.isApproved && item.isPaid ? { opacity: 1, width: "100%" } : { opacity: 0.6, width: "100%" }}>
                    <div className={styles.chatPicWrap}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/chat/${item.image}`}
                        style={{ maxWidth: "100%", maxHeight: 500 }}
                        // height='100%'
                      />
                    </div>
                    <span className={styles.messageText}>{item.description}</span>
                    <div className={styles.partnerTimeWrap}>
                      <span className={styles.partnerInfo}>
                        {/* Это <span className={styles.hashtag}>#партнерский</span> пост.{" "} */}
                        Это партнерский пост.{" "}
                        {!!item.link && (
                          <a
                            href={item.link.includes("http") ? item.link : `https://${item.link}`}
                            className={styles.hashtag}
                            target='_blank'>
                            Перейдите по ссылке, чтобы узнать подробности.
                          </a>
                        )}
                      </span>
                      <span className={styles.messageTime}>{item.time.slice(0, -3)}</span>
                      {/* <span className={styles.messageTime}>{item.isApproved ? "approved" : "not approved"}</span> */}
                    </div>
                  </div>
                  {!item.isPaid && (
                    <button
                      type='submit'
                      style={item.isApproved ? { marginTop: 15 } : { marginTop: 15, opacity: 0.6, pointerEvents: "none" }}
                      className={styles.submitBtn + " " + styles.createAdBtn}
                      onClick={() => {
                        // router.push("/workers/ads/new");
                        alert(`К оплате ${item.sum} р`);
                        payForChatAd(item.id, item.sum);
                      }}>
                      Оплатить
                    </button>
                  )}
                  {!item.isApproved ? (
                    <span style={{ color: "white", textAlign: "center", width: "100%", display: "block" }}>
                      Объявление на модерации. Ожидайте одобрения
                    </span>
                  ) : item.isPaid ? (
                    <span style={{ color: "white", textAlign: "center", width: "100%", display: "block", marginTop: 15 }}>
                      Объявление оплачено и активно
                    </span>
                  ) : null}
                </div>

                <div className={styles.adOptionsWrap}>
                  <span className={styles.adOptionsBtn + " " + styles.trash} onClick={() => deleteChatAd(item.id)}></span>
                  <span className={styles.adOptionsBtn + " " + styles.refresh}></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "white", textAlign: "center", width: "100%", display: "block" }}>Объявлений чата пока нет</div>
        )}
        {/* <span className={styles.showMore}>Показать еще</span> */}
        <div className={styles.fieldWrap}>
          <button
            type='submit'
            className={styles.submitBtn + " " + styles.createAdBtn}
            onClick={() => {
              router.push("/workers/ads/new");
            }}>
            Разместить рекламный пост
          </button>
        </div>
      </div>
    </LayoutWorker>
  );
}
