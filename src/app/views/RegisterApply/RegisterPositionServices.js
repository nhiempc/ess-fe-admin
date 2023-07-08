import axios from "axios";
import ConstantList from "../../appConfig";
const API_GET_POSITION = ConstantList.API_ENPOINT+ "/api/position-title"
const BASE_API = ConstantList.API_ENPOINT + "/api/register-apply-position";
export const getAllPosition = () => axios.get(API_GET_POSITION+"/get-all-position");
export const searchByPagePosition = option =>
	axios.post(BASE_API + "/search", option);

export const addRegisterApplyPosition = item => axios.post(BASE_API, item);

export const updateRegisterApplyPosition = item => axios.put(BASE_API + `/${item.id}`, item);

export const deleteRegisterApplyPosition = id => axios.delete(BASE_API + `/${id}`);

export const exportExcelPatient = () =>
	axios.get(BASE_API + "/exportExcel", {
		responseType: "blob",
	});
