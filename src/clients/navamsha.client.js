import axios from "axios";
import { navamshaConfig } from "../config/base.js";

const { apiKey, apiUrl } = navamshaConfig;

const navGenerateBasicKundali = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/kundali/basic`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

const navGenerateCompleteKundali = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/kundali/complete`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    navGenerateBasicKundali,
    navGenerateCompleteKundali
}