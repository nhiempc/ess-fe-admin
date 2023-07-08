import axios from "axios";
import ConstantList from "../../appConfig";
const API_GET_CERTIFICATE = ConstantList.API_ENPOINT+ "/api/certificate"
const BASE_API = ConstantList.API_ENPOINT + "/api/register-apply-certificate";
export const getAllCertificate = () => axios.get(API_GET_CERTIFICATE+"/getAll");
export const searchByPageCertificate = option =>
	axios.post(BASE_API + "/searchByDto", option);

export const addRegisterApplyCertificate = item => axios.post(BASE_API, item);

export const updateRegisterApplyCertificate = item => axios.put(BASE_API + `/${item.id}`, item);

export const deleteRegisterApplyCertificate = id => axios.delete(BASE_API + `/${id}`);

export const exportExcelPatient = () =>
	axios.get(BASE_API + "/exportExcel", {
		responseType: "blob",
	});
