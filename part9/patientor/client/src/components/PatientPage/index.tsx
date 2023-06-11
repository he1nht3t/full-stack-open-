import { Patient, Diagnosis } from '../../types';
import {
	Typography,
	Card,
	CardContent,
	CardMedia,
	List,
	ListItem,
	ListItemText,
	Alert,
	Box,
	Button,
} from '@mui/material';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import axios from 'axios';
import AddNewEntryModel from './AddNewEntryModel';

interface Props {
	diagnoses: Diagnosis[];
}

const Index = ({ diagnoses }: Props) => {
	const [patient, setPatient] = useState<Patient | undefined>(undefined);
	const [error, setError] = useState<string>();
	const [message, setMessage] = useState<string>();
	const [openModel, setOpenModel] = useState<boolean>(false);

	const { id } = useParams<{ id: string }>();

	const setErrorMessage = (message: string) => {
		setError(message);

		setTimeout(() => {
			setError(undefined);
		}, 5000);
	};

	const setSuccessMessage = (message: string) => {
		setMessage(message);

		setTimeout(() => {
			setMessage(undefined);
		}, 5000);
	};

	const fetchPatient = async (id: string) => {
		try {
			const patient = await patientService.getOne(id);
			setPatient(patient);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (
					error?.response?.data &&
					typeof error?.response?.data === 'string'
				) {
					const message = error.response.data.replace(
						'Something went wrong. Error: ',
						''
					);
					console.error(message);
					setErrorMessage(message);
				} else {
					setErrorMessage('Unrecognized axios error');
				}
			} else {
				console.error('Unknown error', error);
				setErrorMessage('Unknown error');
			}
		}
	};

	useEffect(() => {
		if (id) fetchPatient(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!patient) return null;

	return (
		<>
			{error && (
				<Alert severity='error' sx={{ margin: '10px 0' }}>
					{error}
				</Alert>
			)}
			{message && (
				<Alert severity='success' sx={{ margin: '10px 0' }}>
					{message}
				</Alert>
			)}

			{openModel && (
				<AddNewEntryModel
					openModal={openModel}
					setOpenModel={setOpenModel}
					setPatient={setPatient}
					setSuccessMessage={setSuccessMessage}
				/>
			)}

			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='100vh'>
				<Box>
					<Card sx={{ maxWidth: 345, marginTop: 5, marginBottom: 5 }}>
						<CardMedia
							component='img'
							height='140'
							image='/static/images/cards/contemplative-reptile.jpg'
						/>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								{patient.name}
								{patient.gender === 'male' ? (
									<MaleIcon />
								) : patient.gender === 'female' ? (
									<FemaleIcon />
								) : null}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								SSN: {patient.ssn}
							</Typography>
							<Typography color='text.secondary'>
								Occupation: {patient.occupation}
							</Typography>
						</CardContent>
					</Card>
					<Box
						display='flex'
						justifyContent='space-between'
						alignItems='center'>
						<Typography variant='h5' style={{ marginBottom: 3 }}>
							<strong>Entries</strong>
						</Typography>
						<Button
							onClick={() => setOpenModel(!openModel)}
							variant='contained'
							size='small'
							color='primary'>
							<AddIcon /> New Entry
						</Button>
					</Box>
					{patient.entries.map((entry) => (
						<Card
							key={entry.id}
							sx={{ maxWidth: 345, marginTop: 5, marginBottom: 5 }}>
							<CardContent>
								<Typography gutterBottom variant='h5' component='div'>
									{entry.date}{' '}
									{entry.type === 'Hospital' ? (
										<LocalHospitalIcon />
									) : entry.type === 'OccupationalHealthcare' ? (
										<WorkIcon />
									) : entry.type === 'HealthCheck' ? (
										<MedicalServicesIcon />
									) : null}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{entry.description}
								</Typography>
							</CardContent>

							{entry.type === 'HealthCheck' && (
								<CardContent>
									{entry.type === 'HealthCheck' ? (
										entry.healthCheckRating === 0 ? (
											<FavoriteIcon color='success' />
										) : entry.healthCheckRating === 1 ? (
											<FavoriteIcon sx={{ color: 'orange' }} />
										) : entry.healthCheckRating === 2 ? (
											<FavoriteIcon color='warning' />
										) : entry.healthCheckRating === 3 ? (
											<FavoriteIcon sx={{ color: 'red' }} />
										) : null
									) : null}
								</CardContent>
							)}

							{entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
								<CardContent>
									<List>
										{entry.diagnosisCodes?.map((code) => (
											<ListItem key={code}>
												<ListItemText>
													{code}
													{' - '}
													{diagnoses.map((diagnosis) =>
														diagnosis.code === code ? diagnosis.name : null
													)}
												</ListItemText>
											</ListItem>
										))}
									</List>
								</CardContent>
							)}

							<CardContent>
								<Typography>
									<strong>Diagnose by: </strong>
									{entry.specialist}
								</Typography>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>
		</>
	);
};

export default Index;
