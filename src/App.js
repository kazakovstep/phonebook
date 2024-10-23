import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
	const [contacts, setContacts] = useState([])
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')

	const fetchContacts = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/contacts')
			setContacts(response.data)
		} catch (error) {
			console.error('Ошибка при получении контактов:', error)
		}
	}

	useEffect(() => {
		fetchContacts()
	}, [])

	const addContact = async e => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:5000/api/contacts', {
				name,
				phone,
			})
			setContacts([...contacts, response.data])
			setName('')
			setPhone('')
		} catch (error) {
			console.error('Ошибка при добавлении контакта:', error)
		}
	}

	return (
		<div>
			<h1>Список контактов</h1>
			<form onSubmit={addContact}>
				<input
					type='text'
					placeholder='Имя'
					value={name}
					onChange={e => setName(e.target.value)}
					required
				/>
				<input
					type='text'
					placeholder='Номер телефона'
					value={phone}
					onChange={e => setPhone(e.target.value)}
					required
				/>
				<button type='submit'>Добавить контакт</button>
			</form>
			<h2>Созданные контакты:</h2>
			<ul>
				{contacts.map(contact => (
					<li key={contact.id}>
						{contact.name} - {contact.phone}
					</li>
				))}
			</ul>
		</div>
	)
}

export default App
