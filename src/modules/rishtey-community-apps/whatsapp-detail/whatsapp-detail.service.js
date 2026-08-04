import { whatsappDetailRepo } from "./whatsapp-detail.repository.js";

const addWhatsappDetail = async (data) => {
    return whatsappDetailRepo.addWhatsappDetail(data);
};

export const whatsappDetailService = {
    addWhatsappDetail
};