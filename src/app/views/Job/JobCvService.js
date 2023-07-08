import axios from "axios";
import ConstantList from "../../appConfig";

const API_JOB_CV = ConstantList.API_ENPOINT + "/api/job-cv";
const API_FILE = ConstantList.API_ENPOINT + "/api/file";

export const searchByPage = option =>
	axios.post(
		API_JOB_CV+"/searchByDto",option
	);
export const uploadFileCv = (formData) => {
	var url = API_FILE +"/upload";
	return axios.post(url, formData);
};
export const getFileCv = (item) => {
	var url = API_FILE +"/get-cv"   ;
	return axios.post(url,item);
};
export const addJobCv = jobCv => axios.post(API_JOB_CV, jobCv);

export const updateJobCv = jobCv => axios.put(API_JOB_CV+ `/${jobCv.id}`, jobCv);

export const deleteJobCv= id => axios.delete(API_JOB_CV + `/${id}`);
