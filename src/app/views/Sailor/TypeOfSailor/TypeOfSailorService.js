import axios from "axios";
import ConstantList from "../../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/crewType";

export const searchByPage = (searchObject) => {
    return axios.post(API_PATH + "searchByPage", searchObject);
};

export const deleteItem = (id) => {
    return axios.delete(API_PATH + "?id=" + id);
};

export const getAllItem = () => {
    return axios.get(API_PATH + "/list");
};

export const saveItem = (item) => {
    return axios.post(API_PATH, item);
};
export const updateItem = (item) => {
    return axios.put(API_PATH + "?id=" + item.id, item);
};

export const getItemById = (id) => {
    return axios.get(API_PATH + id);
};

export const checkCode = (id, code) => {
    const config = { params: { id: id, code: code } };
    return axios.get(API_PATH + "checkCode", config);
};
