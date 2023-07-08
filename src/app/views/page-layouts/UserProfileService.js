import axios from "axios";
import ConstantList from "../../appConfig";
const API_USER = ConstantList.API_ENPOINT + "/api/users";

export const getCurrentUser = () => {
	var url = API_USER + "/getCurrentUser";
	return axios.get(url);
};

export const updateProfile = user => axios.put(API_USER, user);

export const changePassword = user =>
	axios.put(API_USER + "/password/self", user);

export const updateUserAvatar = data =>
	axios.post(API_USER + "/updateavatar", data, {
		"Content-Type": "multipart/form-data",
	});

export const getUserAvatar = username =>
	axios.get(ConstantList.API_ENPOINT + `/public/users/photo/${username}`);

