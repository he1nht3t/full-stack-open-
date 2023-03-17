import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
	const req = axios.get(baseUrl);
	return req.then(res => res.data);
};

const create = newPersonObject => {
	const req = axios.post(baseUrl, newPersonObject);
	return req.then(res => res.data);
};

const update = (id, updatedPersonObject) => {
	const req = axios.put(`${baseUrl}/${id}`, updatedPersonObject);
	return req.then(res => res.data);
};

const remove = id => {
	return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, remove, update };
