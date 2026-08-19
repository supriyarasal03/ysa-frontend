import api from "../api/axiosClient";

const CONTACT_URL = "/contact";

export const saveContact = async (contactData) => {
    const response = await api.post(CONTACT_URL, contactData);
    return response.data;
};