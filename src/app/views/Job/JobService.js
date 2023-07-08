import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/job/";

const API_PATH_POSITION_TITLE = ConstantList.API_ENPOINT + "/api/position-title/";

const API_PATH_POSITION_TITLE_LEVEL = ConstantList.API_ENPOINT + "/api/position-title-level/";

const API_PATH_TYPE_OF_SHIP = ConstantList.API_ENPOINT + "/api/type-of-ship/";

export const searchByPagePositionTitleLevel = (searchObject) => {
  return axios.post(API_PATH_POSITION_TITLE_LEVEL +  "search", searchObject);
};

export const searchByPagePositionTitle = (searchObject) => {
  return axios.post(API_PATH_POSITION_TITLE_LEVEL +  "search", searchObject);
};

export const searchByPageTypeOfShip = (searchObject) => {
  return axios.post(API_PATH_TYPE_OF_SHIP +  "searchByPage", searchObject);
};

export const searchByPage = (searchObject) => {
  return axios.post(API_PATH +  "searchByPage", searchObject);
};

export const deleteItem = id => {
  return axios.delete(API_PATH + id);
};

export const saveItem = item => {
  return axios.post(API_PATH, item);
};
export const updateItem = item => {
  return axios.put(API_PATH , item);
};

export const getItemById = id => {
  return axios.get(API_PATH + id);
};

export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  return axios.get(API_PATH + "checkCode", config);
};