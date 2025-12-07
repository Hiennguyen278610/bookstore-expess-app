import axios from "axios";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const getAllBooks = async () => {
    const response = await axios.get(`${apiUrl}/books`);
    return response.data;
}
