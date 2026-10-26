import axios from "axios";
import { navamshaConfig } from "../config/base.js";

const { apiKey, apiUrl } = navamshaConfig;

// const generateBasicKundali = async (body) => {
//     try {
//         const response = await axios.post(`${apiUrl}/kundali/basic`, body, {
//             headers: {
//                 "X-API-KEY": apiKey
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

const generateCompleteKundali = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/kundali/complete`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// const compareAshtakootCompatibility = async (body) => {
//     try {
//         const response = await axios.post(`${apiUrl}/compatibility/ashtakoot`, body, {
//             headers: {
//                 "X-API-KEY": apiKey
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

const compareDetailedAshtakootCompatibility = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/compatibility/ashtakoot/detailed`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const compareManglikCompatibility = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/compatibility/manglik`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const checkMangalDosha = async (body) => {
    try {
        const response = await axios.post(`${apiUrl}/dosha/mangal`, body, {
            headers: {
                "X-API-KEY": apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    // generateBasicKundali,
    generateCompleteKundali,
    // compareAshtakootCompatibility,
    compareDetailedAshtakootCompatibility,
    compareManglikCompatibility,
    checkMangalDosha
}