const cors = require('cors')
const express = require('express')
const mysql = require('mysql2')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'papamama1R',
	database: 'phonebook',
})

db.connect(err => {
	if (err) {
		console.error('Ошибка подключения к базе данных:', err)
		return
	}
	console.log('Подключение к базе данных MySQL успешно')
})

// API для управления контактами
app.get('/api/contacts', (req, res) => {
	db.query('SELECT * FROM contacts', (err, results) => {
		if (err) return res.status(500).send(err)
		res.json(results)
	})
})

app.post('/api/contacts', (req, res) => {
	const { name, phone } = req.body
	db.query(
		'INSERT INTO contacts (name, phone) VALUES (?, ?)',
		[name, phone],
		(err, results) => {
			if (err) return res.status(500).send(err)
			res.status(201).json({ id: results.insertId, name, phone })
		}
	)
})

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})
