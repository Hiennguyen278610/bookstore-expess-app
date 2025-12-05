import { baseUrl } from "@/constants";
import axios from "axios";

const publicApi = axios.create({
    baseURL : `${baseUrl}`
})

export default publicApi