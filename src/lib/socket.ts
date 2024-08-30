import { io } from "socket.io-client";
import envConfig from "../config";
import { getAccessTokenFromLocalStorage } from "./utils";

const socket = io(envConfig.NEXT_PUBLIC_API_URL, {
	auth: {
		Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
	},
});


export default socket;