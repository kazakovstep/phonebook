import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
	const [contacts, setContacts] = useState([])
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [editingId, setEditingId] = useState(null)

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

	const editContact = async e => {
		e.preventDefault()
		try {
			const response = await axios.put(
				`http://localhost:5000/api/contacts/${editingId}`,
				{
					name,
					phone,
				}
			)
			setContacts(
				contacts.map(contact =>
					contact.id === editingId ? response.data : contact
				)
			)
			setName('')
			setPhone('')
			setEditingId(null)
		} catch (error) {
			console.error('Ошибка при редактировании контакта:', error)
		}
	}

	const startEditing = contact => {
		setEditingId(contact.id)
		setName(contact.name)
		setPhone(contact.phone)
	}

	const deleteContact = async id => {
		try {
			await axios.delete(`http://localhost:5000/api/contacts/${id}`)
			setContacts(contacts.filter(contact => contact.id !== id))
		} catch (error) {
			console.error('Ошибка при удалении контакта:', error)
		}
	}

	return (
		<div>
			<h1>Список контактов</h1>
			<form onSubmit={editingId ? editContact : addContact}>
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
				<button type='submit'>
					{editingId ? 'Сохранить изменения' : 'Добавить контакт'}
				</button>
			</form>
			<h2>Созданные контакты:</h2>
			<ul>
				{contacts.map(contact => (
					<li key={contact.id}>
						{contact.name} - {contact.phone}
						<button onClick={() => startEditing(contact)}>Редактировать</button>
						<button onClick={() => deleteContact(contact.id)}>Удалить</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default App
