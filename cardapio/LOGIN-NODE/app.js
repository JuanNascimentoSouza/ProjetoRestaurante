const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2"); // Biblioteca MySQL

const app = express();
const PORT = 3000;

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',   // Hostname
  user: 'root',        // Usuário 'root'
  password: 'root',    // Senha
  port: 3306,          // Porta padrão do MySQL
  database: 'user_db'  // Nome do banco de dados
});

// Conectar ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

// Configurando o body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando a pasta de arquivos estáticos (CSS, JS)
app.use(express.static("public"));

// Configurando as sessões
app.use(
  session({
    secret: "my_secret_key", 
    resave: false,
    saveUninitialized: true,
  })
);

// Configurando o mecanismo de templates EJS
app.set("view engine", "ejs");

// Configurando a pasta de views
app.set("views", path.join(__dirname, "views"));

// Rota principal para '/'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Rota para exibir o formulário de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Rota para exibir o formulário de registro
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Rota para processar o registro
app.post('/register', async (req, res) => {
  const { username, password, adminKey } = req.body;

  if (password.length < 8) {
    return res.render('error', { message: 'A senha deve ter no mínimo 8 caracteres.' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.render('user-exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO users (username, password, adminKey) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, hashedPassword, adminKey], (err, result) => {
      if (err) throw err;
      res.render('register-success');
    });
  });
});

// Rota para processar o login
app.post("/login", async (req, res) => {
  const { username, password, adminKey } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return res.render("error", { message: 'Erro no sistema, tente novamente mais tarde.' });
    }
    
    if (results.length === 0) {
      return res.render("user-not-found");
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("incorrect-password");
    }

    // Verificar a chave de administrador
    if (user.adminKey !== adminKey) {
      return res.render('incorrect-admin-key'); // Renderiza a página de erro 'Chave de administrador incorreta'
    }

    req.session.user = username;
    req.session.isAdmin = user.adminKey === adminKey;

    if (req.session.isAdmin) {
      return res.render("admin-dashboard", { username });
    } else {
      return res.render("dashboard", { username });
    }
  });
});

// Rota para o dashboard do administrador
app.get("/admin-dashboard", (req, res) => {
  if (!req.session.user || !req.session.isAdmin) {
    return res.redirect("/login");
  }
  res.render("admin-dashboard", { username: req.session.user });
});

// Rota para o dashboard do usuário comum
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("dashboard", { username: req.session.user });
});

// Rota para logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error', { message: 'Erro ao deslogar.' });
    }
    res.redirect("/login");
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});