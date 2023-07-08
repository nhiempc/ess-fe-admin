import axios from "axios";
import ConstantList from "../../appConfig";
const API_SHIP_OWNER = ConstantList.API_ENPOINT + "/api/register-apply";

export const searchByPage = option =>
	axios.post(
		API_SHIP_OWNER + "/searchByDto", option
	);
export const getAll = () => axios.get(API_SHIP_OWNER)

export const addShipOwnerRegister = shipOwner => axios.post(API_SHIP_OWNER, shipOwner);

export const updateShipOwnerRegister = shipOwner => axios.put(API_SHIP_OWNER + `/${shipOwner.id}`, shipOwner);

export const getOne = shipOwner => axios.get(API_SHIP_OWNER + `/${shipOwner.id}`);

export const deleteShipOwnerRegister = id => axios.delete(API_SHIP_OWNER + `/${id}`);
