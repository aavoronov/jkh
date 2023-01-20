import { useSelector } from "react-redux";
import io, { Manager } from "socket.io-client";

const pseudonym = useSelector((state) => state.user.pseudonym);

const manager = new Manager("http://localhost:5000/", {
  autoConnect: false,
  query: `pseudonym=${pseudonym}`,
});

export const socket = manager.socket("/chat"); // main namespace
socket.connect();
