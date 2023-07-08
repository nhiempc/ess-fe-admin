import axios from "axios";
import ConstantList from "../../appConfig";
const API_REGISTER_APLLY = ConstantList.API_ENPOINT + "/api/job-cv";
const API_IMAGE = ConstantList.API_ENPOINT + "/public/api/image";

export const searchByPage = option =>
	axios.post(
		API_REGISTER_APLLY + "/searchByDto", option
	);
export const uploadImage = (formData) => {
	var url = API_IMAGE;
	return axios.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const addRegisterApply = registerApply => axios.post(API_REGISTER_APLLY, registerApply);

export const updateRegisterApply = registerApply => axios.put(API_REGISTER_APLLY + `/${registerApply.id}`, registerApply);

export const deleteRegisterApply = id => axios.delete(API_REGISTER_APLLY + `/${id}`);
