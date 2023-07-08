import axios from "axios";
import ConstantList from "../../appConfig";
const baseURL = ConstantList.API_ENPOINT + "/api/article";

export const searchByDto = searchDto => axios.post(baseURL + "/searchByDto", searchDto);

export const getById = id => axios.get(baseURL + `/${id}`);

export const deleteArticle = id => axios.delete(baseURL + "/" + id);

export const addNewArticle = article => axios.post(baseURL, article);

export const updateArticle = article => axios.put(baseURL + "/" + article.id, article);
