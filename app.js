const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

// Configuración de Express para manejar datos de formularios y sesiones
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'claveSecreta', resave: false, saveUninitialized: true }));

// Base de datos simulada
let users = [];

// Ruta de inicio de sesión
app.get('/login', (req, res) => res.sendFile(__dirname + '/HTML/login.html'));
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.send('Inicio de sesión exitoso');
  } else {
    res.send('Credenciales incorrectas');
  }
});

// Ruta de registro
app.get('/register', (req, res) => res.sendFile(__dirname + '/HTML/register.html'));
app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  users.push({ username: req.body.username, password: hashedPassword });
  res.send('Registro exitoso');
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
