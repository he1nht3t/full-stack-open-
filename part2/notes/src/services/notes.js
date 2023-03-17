import axios from "axios";

const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
	const req = axios.get(baseUrl);
	return req.then(res => res.data);
};

const create = newObject => {
	const req = axios.post(baseUrl, newObject);
	return req.then(res => res.data);
};

const update = (id, updatedObject) => {
	const req = axios.put(`${baseUrl}/${id}`, updatedObject);
	return req.then(res => res.data);
};

const remove = id => {
	return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
