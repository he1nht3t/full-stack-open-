import { useEffect, useState } from "react";
import _ from "lodash";

import personsServer from "./server/persons";

//components
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Person";
import Notification from "./components/Notification";

function App() {
	const [allPersons, setAllPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [notification, setNotification] = useState(null);
	const [error, setError] = useState(false)

	useEffect(() => {
		personsServer.getAll().then(persons => {
			setAllPersons(persons);
		});
	}, []);

	const handleNewName = e => {
		setNewName(e.target.value);
	};
	const handleNewNumber = e => {
		setNewNumber(e.target.value);
	};
	const handleSearch = e => {
		setSearchTerm(e.target.value);
	};

	const addNewPerson = e => {
		e.preventDefault();
		const newPerson = { name: newName, number: newNumber };

		const isNameExist = allPersons.find(person =>
			_.isEqual(person.name, newName)
		);

		if (isNameExist) {
			const isConfirmUpdate = confirm(
				`${isNameExist.name} is already added to phonebook, replace old number with new one?`
			);

			if (isConfirmUpdate) {
				personsServer.update(isNameExist.id, newPerson).then(person => {
					setAllPersons(
						allPersons.map(p => (p.id === person.id ? person : p))
					);
					setNewName("");
					setNewNumber("");
					setNotification(`Updated ${person.name}`);
					setTimeout(() => {
						setNotification(null);
					}, 5000);
				}).catch(error => {
					setAllPersons(allPersons.filter(p => p.id !== isNameExist.id))

					setError(true);
					setNotification(`Information of ${isNameExist.name} has already been removed from server.`);

					setTimeout(() => {
						setError(false);
						setNotification(null)
					}, 5000)
				})
			}
			return;
		}

		personsServer.create(newPerson).then(person => {
			setAllPersons(allPersons.concat(person));
			setNewName("");
			setNewNumber("");
			setNotification(`Added ${person.name}`);
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		});
	};

	const removePerson = (id, name) => {
		if (confirm(`Delete ${name}`))
			personsServer.remove(id).then(res => {
				setAllPersons(allPersons.filter(person => person.id !== id));
			});
	};

	const personsToShow = searchTerm
		? allPersons.filter(person =>
				person.name
					.toLocaleLowerCase()
					.includes(searchTerm.toLocaleLowerCase())
		  )
		: allPersons;

	return (
		<>
			<h1 className="title">PhoneBook</h1>

			<Filter inputValue={searchTerm} handleChange={handleSearch} />

			<Notification message={notification} error={error} />

			<h3 className="sub-title">Add a new</h3>

			<PersonForm
				handleSubmit={addNewPerson}
				newNameValue={newName}
				handleNewName={handleNewName}
				newNumberValue={newNumber}
				handleNewNumber={handleNewNumber}
			/>

			<h3 className="sub-title">Numbers</h3>

			{personsToShow.map(person => (
				<Person
					key={person.id}
					person={person}
					removePerson={() => removePerson(person.id, person.name)}
				/>
			))}
		</>
	);
}

export default App;
