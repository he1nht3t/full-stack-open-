import axios from 'axios';
import { apiBaseUrl } from '../constants';

import { Diagnosis } from '../types';

const getDiagnoses = async (): Promise<Diagnosis[]> => {
	const { data: diagnoses } = await axios.get<Diagnosis[]>(
		`${apiBaseUrl}/diagnoses`
	);
	return diagnoses;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getDiagnoses,
};
