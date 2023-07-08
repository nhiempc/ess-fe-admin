import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api";
const UPLOAD_PATH = ConstantList.API_ENPOINT ;

// IN CV
export const printCV = (cvType, sailorId) => {
    var url = API_PATH + '/listSailor/download-cv?cvType=' + cvType + '&sailorId=' + sailorId
    return axios({
        url: url,
        responseType: "blob",
        method: 'POST'
    })
}

export const searchByPage = (obj) => {
    var url = API_PATH + "/listSailor/searchByPage";
    return axios.post(url, obj);
};


export const deleteSailor = (id) => {
    let url = API_PATH + "/listSailor/" + id 
    return axios.delete(url)
}


//ok
export const addSailorInformation = (object) => {
    let url = API_PATH + "/listSailor"
    return axios.post(url, object)
}

export const editSailorInformation = (object,id) => {
    console.log(object);
    let url = API_PATH + "/listSailor/" + id;
    return axios.put(url, object)
}

export const getSailorById = (id) => {
    let url = API_PATH + "/listSailor/" + id;
    return axios.get(url)
}


// ESS ID
export const getNewEssId = () => {
    let url = API_PATH + "/listSailor/auto-generate-essid"
    return axios.get(url)
}


// Passport and sailor book
export const addPassportAndSailorBook = (object, id) => {
    let url = API_PATH + "/passportAndCrew?sailorId=" + id
    return axios.post(url, object)
}

export const editPassportAndSailorBook = (object, id) => {
    let url = API_PATH + "/passportAndCrew/" + id
    return axios.put(url, object)
}

export const deletePassportAndSailorBook = (id) => {
    let url = API_PATH + "/passportAndCrew/" + id
    return axios.delete(url)
}

export const getPassportAndSailorBook = (object) => {
    let url = API_PATH + "/passportAndCrew/listPage?pageIndex=" + object.pageIndex + "&pageSize=" + object.pageSize
    return axios.get(url)
}

// Relative People
export const addRelative = (object, id) => {
    let url = API_PATH + "/family?sailorId=" + id
    return axios.post(url, object)
}

export const getRelativeByIdSailor = (id) => {
    let url = API_PATH + "/family/get-by-sailor-id/" + id
    return axios.get(url)
}

export const getRelative = (object) => {
    let url = API_PATH + "/family/listPage?pageIndex=" + object.pageIndex + "&pageSize=" + object.pageSize
    return axios.get(url)
}

export const removeRelative = (id) => {
    let url = API_PATH + "/family?id=" + id
    return axios.delete(url)
}


export const removeDependent = (id) => {
    let url = API_PATH + "/dependentPerson?id=" + id
    return axios.delete(url)
}


// interview Feedback
export const addInterviewFeedback = (object, id) => {
    let url = API_PATH + "/interviewFeedback?sailorId=" + id
    return axios.post(url, object)
}

export const getInterviewFeedbackByIdSailor = (id) => {
    let url = API_PATH + "/interviewFeedback/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeInterviewFeedback = (id) => {
    let url = API_PATH + "/interviewFeedback?id=" + id
    return axios.delete(url)
}


// certificate by ship owner
export const addCertificateByShipOwner = (object, id) => {
    let url = API_PATH + "/certificateIssuedByShipOwner?sailorId=" + id
    return axios.post(url, object)
}

export const getCertificateByShipOwner = (id) => {
    let url = API_PATH + "/certificateIssuedByShipOwner/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeCertificateByShipOwner = (id) => {
    let url = API_PATH + "/certificateIssuedByShipOwner?id=" + id
    return axios.delete(url)
}


// comment
export const addComment = (object, id) => {
    let url = API_PATH + "/comment?sailorId=" + id
    return axios.post(url, object)
}

export const getCommentByIdSailor = (id) => {
    let url = API_PATH + "/comment/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeComment = (id) => {
    console.log(id);
    let url = API_PATH + "/comment?id=" + id
    return axios.delete(url)
}


// sailor feedback
export const addCrewFeedback = (object, id) => {
    let url = API_PATH + "/crewFeedback?sailorId=" + id
    return axios.post(url, object)
}

export const getCrewFeedbackByIdSailor = (id) => {
    let url = API_PATH + "/crewFeedback/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeCrewFeedback = (id) => {
    let url = API_PATH + "/crewFeedback?id=" + id
    return axios.delete(url)
}


// health reports
export const addHealthReport = (object, id) => {
    let url = API_PATH + "/healthReport?sailorId=" + id
    return axios.post(url, object)
}

export const getHealthReport = (id) => {
    let url = API_PATH + "/healthReport/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeHealthReport = (id) => {
    let url = API_PATH + "/healthReport?id=" + id
    return axios.delete(url)
}


// Training additional
export const addAdditionalTrainingNeeds = (object, id) => {
    let url = API_PATH + "/additionalTrainingNeed?sailorId=" + id
    return axios.post(url, object)
}

export const getAddTraining = (id) => {
    let url = API_PATH + "/additionalTrainingNeed/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeAddTraining = (id) => {
    console.log(id);
    let url = API_PATH + "/additionalTrainingNeed?id=" + id
    return axios.delete(url)
}


// Training complete
export const addCompleteTrainingCourse = (object, id) => {
    let url = API_PATH + "/completeTrainingCourse?sailorId=" + id
    return axios.post(url, object)
}

export const getCompleteTrainingCourseByIdSailor = (id) => {
    let url = API_PATH + "/completeTrainingCourse/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeTraining = (id) => {
    let url = API_PATH + "/completeTrainingCourse?id=" + id
    return axios.delete(url)
}


// dependent person
export const addDependent = (object, id) => {
    let url = API_PATH + "/dependentPerson?sailorId=" + id
    return axios.post(url, object)
}

export const getDependentByIdSailor = (id) => {
    let url = API_PATH + "/dependentPerson/get-by-sailor-id/" + id
    return axios.get(url)
}


export const addInternalCertificate = (object, id) => {
    let url = API_PATH + "/internalCertificate?sailorId=" + id
    return axios.post(url, object)
}

export const getInternalCertificateByIdSailor = (id) => {
    let url = API_PATH + "/internalCertificate/get-by-sailor-id/" + id
    return axios.get(url)
}

export const addDocumentCertificate = (obj,id) => {
    let url = API_PATH + "/personal-certificate?sailorId=" + id
    return axios.post(url, obj)
}

export const getDocumentCertificateByIdSailor = (id) => {
    let url = API_PATH + "/personal-certificate/get-by-sailor-id/" + id
    return axios.get(url)
}

export const removeDocumentCertificate = (id) => {
    let url = API_PATH + "/personal-certificate?id=" + id
    return axios.delete(url)
}



export const addPreviousExperience = (object,id) => {
    let url = API_PATH + "/previousExperience?sailorId=" + id
    return axios.post(url, object)
}

export const getExperienceByIdSailor = (id) => {
    let url = API_PATH + "/previousExperience/by-sailor-id/" + id
    return axios.get(url)
}

export const removeInternalCertificate = (id) => {
    let url = API_PATH + "/internalCertificate?id=" + id
    return axios.delete(url)
}

export const removeExperience = (id) => {
    let url = API_PATH + "/previousExperience?id=" + id
    return axios.delete(url)
}

//currentShip
export const getCurrentShip = () => {
    let url = API_PATH + "/currentShip"
    return axios.get(url)
}

export const getCurrentShipByID = (id) => {
    let url = API_PATH + "/currentShip/" + id
    return axios.get(url)
}

export const addCurrentShip = (object,id) => {
    let url = API_PATH + "/currentShip?sailorId=" + id
    return axios.post(url, object)
}

export const editCurrentShip = (object, id) => {
    let url = API_PATH + "/currentShip?id=" + id
    return axios.put(url, object)
}

export const deleteCurrentShip = (id) => {
    let url = API_PATH + "/currentShip?id=" + id
    return axios.delete(url)
}

//prevUnit
export const addPreviousUnit = (object,id) => {
    let url = API_PATH + "/previousUnit?sailorId=" + id
    return axios.post(url, object)
}

export const getPreviousUnit = (id) => {
    let url = API_PATH + "/previousUnit/"+id;
    return axios.get(url)
}

export const removeUnit = (id) => {
    let url = API_PATH + "/previousUnit?id=" + id
    return axios.delete(url)
}


//file
export const addFile = (object) => {
    let url = UPLOAD_PATH + "/public/api/upload-file"
    return axios.post(url, object)
}

export const getFile = (fileName) => {
    let url = UPLOAD_PATH + "/public/api/file/" + fileName
    return axios.get(url,{
        responseType: 'arraybuffer' // Specify that the response type is a byte array
    })
}


//Unit Info
export const addNationalUnit = (sailorId, unitId) => {
    let url = UPLOAD_PATH + '/api/listSailor/set-present-units?sailorId=' + sailorId + '&nationalityId=' + unitId
    return axios.put(url)
}

export const getNationalUnit = (sailorId) => {
    let url = UPLOAD_PATH + '/api/listSailor/present-units/' + sailorId
    return axios.get(url)
}

export const deleteNationalUnit = (sailorId) => {
    let url = UPLOAD_PATH + '/api/listSailor/delete-present-units/' + sailorId
    return axios.put(url)
}
