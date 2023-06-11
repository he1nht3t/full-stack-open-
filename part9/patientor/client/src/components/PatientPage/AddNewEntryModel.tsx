import {
	Modal,
	TextField,
	Box,
	Button,
	Alert,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { NewEntry, Patient, HealthCheckRating, EntryType } from '../../types';
import { ChangeEvent, useState } from 'react';
import patientService from '../../services/patients';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Props {
	openModal: boolean;
	setOpenModel: (open: boolean) => void;
	setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
	setSuccessMessage: (message: string) => void;
}

const AddNewEntryModel = ({
	openModal,
	setOpenModel,
	setPatient,
	setSuccessMessage,
}: Props) => {
	const [description, setDescription] = useState<string>('');
	const [date, setDate] = useState<string>('');
	const [specialist, setSpecialist] = useState<string>('');
	const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
	const [type, setType] = useState<string>('HealthCheck');
	const [healthCheckRating, setHealthCheckRating] =
		useState<HealthCheckRating>(0);
	const [employerName, setEmployerName] = useState<string>('');
	const [sickLeave, setSickLeave] = useState<{
		startDate: string;
		endDate: string;
	}>({ startDate: '', endDate: '' });
	const [discharge, setDischarge] = useState<{
		date: string;
		criteria: string;
	}>({ date: '', criteria: '' });
	const [error, setError] = useState<string>();

	const { id } = useParams<{ id: string }>();

	const onTypeChange = (event: SelectChangeEvent<string>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setType(value);
		}
	};

	const onHealthCheckRatingChange = (
		event: SelectChangeEvent<HealthCheckRating>
	) => {
		event.preventDefault();
		setHealthCheckRating(Number(event.target.value));
	};

	const onEmployerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setEmployerName(value);
		}
	};

	const onSickLeaveStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setSickLeave({ ...sickLeave, startDate: value });
		}
	};

	const onSickLeaveEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setSickLeave({ ...sickLeave, endDate: value });
		}
	};

	const onDischargeDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setDischarge({ ...discharge, date: value });
		}
	};

	const onDischargeCriteriaChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setDischarge({ ...discharge, criteria: value });
		}
	};

	const onDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setDescription(value);
		}
	};

	const onDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setDate(value);
		}
	};

	const onSpecialistChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (typeof event.target.value === 'string') {
			const value = event.target.value;
			setSpecialist(value);
		}
	};

	const onDiagnosisCodesChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const value = event.target.value;
		setDiagnosisCodes(value.replace(/\s/g, '').split(','));
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			let addedEntry;

			if (type === 'HealthCheck') {
				const newEntry: NewEntry = {
					description,
					date,
					specialist,
					diagnosisCodes: diagnosisCodes ? diagnosisCodes : [],
					type,
					healthCheckRating,
				};
				addedEntry = await patientService.addEntry(newEntry, id as string);
			}

			if (type === 'OccupationalHealthcare') {
				const newEntry: NewEntry = {
					description,
					date,
					specialist,
					diagnosisCodes: diagnosisCodes ? diagnosisCodes : [],
					type,
					employerName,
					sickLeave:
						sickLeave.startDate && sickLeave.endDate ? sickLeave : undefined,
				};
				addedEntry = await patientService.addEntry(newEntry, id as string);
			}

			if (type === 'Hospital') {
				const newEntry: NewEntry = {
					description,
					date,
					specialist,
					diagnosisCodes: diagnosisCodes ? diagnosisCodes : [],
					type,
					discharge,
				};
				addedEntry = await patientService.addEntry(newEntry, id as string);
			}

			if (addedEntry) {
				setPatient(addedEntry);

				setSuccessMessage(`Entry of ${addedEntry?.name} is added`);
				setError(undefined);
				setDescription('');
				setDate('');
				setSpecialist('');
				setDiagnosisCodes([]);
				setType('HealthCheck');
				setHealthCheckRating(0);
				setEmployerName('');
				setSickLeave({ startDate: '', endDate: '' });
				setDischarge({ date: '', criteria: '' });

				setOpenModel(false);
			}
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				if (e?.response?.data && typeof e?.response?.data === 'string') {
					const message = e.response.data.replace(
						'Something went wrong. Error: ',
						''
					);
					console.error(message);
					setError(message);
				} else {
					setError('Unrecognized axios error');
				}
			} else {
				console.error('Unknown error', e);
				setError('Unknown error');
			}
		}
	};

	const margin = {
		marginBottom: '10px',
	};

	return (
		<>
			<Modal
				open={openModal}
				onClose={() => setOpenModel(false)}
				aria-labelledby='modal-modal-title'>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}>
					<Typography
						sx={{ marginBottom: '10px' }}
						id='modal-modal-title'
						variant='h5'
						component='h2'>
						Add New Entry
					</Typography>
					{error && (
						<Alert sx={{ marginBottom: '10px' }} severity='error'>
							{error}
						</Alert>
					)}

					<form onSubmit={onSubmit}>
						<TextField
							required
							fullWidth
							id='description'
							label='Description'
							value={description}
							onChange={onDescriptionChange}
							sx={margin}
						/>
						<TextField
							fullWidth
							required
							id='date'
							type='date'
							label='Date'
							value={date}
							onChange={onDateChange}
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								min: '1900-01-01',
								max: '9999-12-31',
								style: { fontSize: 14 },
							}}
						/>
						<TextField
							fullWidth
							required
							id='specialist'
							label='Specialist'
							value={specialist}
							onChange={onSpecialistChange}
							sx={margin}
						/>
						<TextField
							fullWidth
							id='diagnosisCodes'
							label='Diagnosis Codes'
							value={diagnosisCodes}
							onChange={onDiagnosisCodesChange}
							sx={margin}
							placeholder='Separate codes with comma'
						/>
						<Box sx={margin}>
							<FormControl fullWidth>
								<InputLabel id='type'>Type</InputLabel>
								<Select
									labelId='type'
									id='type'
									value={type}
									label='Type'
									onChange={onTypeChange}>
									{Object.values(EntryType).map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
						{type === 'HealthCheck' ? (
							<Box sx={margin}>
								<FormControl fullWidth>
									<InputLabel id='healthCheckRating'>
										Health Check Rating
									</InputLabel>
									<Select
										labelId='healthCheckRating'
										id='healthCheckRating'
										value={healthCheckRating}
										label='Health Check Rating'
										onChange={onHealthCheckRatingChange}>
										{Object.values(HealthCheckRating)
											.filter((value) => typeof value === 'string')
											.map((rating, index) => (
												<MenuItem key={index} value={index}>
													{rating}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</Box>
						) : type === 'Hospital' ? (
							<Box sx={margin}>
								<TextField
									required
									type='date'
									id='dischargeDate'
									label='Discharge Date'
									value={discharge.date}
									onChange={onDischargeDateChange}
									InputLabelProps={{
										shrink: true,
									}}
									inputProps={{
										min: '1900-01-01',
										max: '9999-12-31',
										style: { fontSize: 14 },
									}}
								/>
								<TextField
									required
									id='dischargeCriteria'
									label='Discharge Criteria'
									value={discharge.criteria}
									onChange={onDischargeCriteriaChange}
								/>
							</Box>
						) : (
							<>
								<TextField
									fullWidth
									required
									id='employerName'
									label='Employer Name'
									value={employerName}
									onChange={onEmployerNameChange}
									sx={margin}
									placeholder='Enter employer name'
								/>
								<Box sx={margin}>
									<TextField
										required
										type='date'
										id='sickLeaveStartDate'
										label='Sick Leave Start Date'
										value={sickLeave.startDate}
										onChange={onSickLeaveStartDateChange}
										sx={margin}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{
											min: '1900-01-01',
											max: '9999-12-31',
											style: { fontSize: 14 },
										}}
									/>
									<TextField
										required
										type='date'
										id='sickLeaveEndDate'
										label='Sick Leave End Date'
										value={sickLeave.endDate}
										onChange={onSickLeaveEndDateChange}
										sx={margin}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{
											min: '1900-01-01',
											max: '9999-12-31',
											style: { fontSize: 14 },
										}}
									/>
								</Box>
							</>
						)}

						<Button variant='contained' type='submit'>
							Submit
						</Button>
					</form>
				</Box>
			</Modal>
		</>
	);
};

export default AddNewEntryModel;
