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
  host: '127.0.0.1',   // Hostname como mostrado na imagem
  user: 'root',        // Usuário 'root', como mostrado na imagem
  password: 'root',        // Senha não foi especificada, então deixe em branco
  port: 3306,          // Porta padrão do MySQL, como mostrado
  database: 'user_db'  // Nome do banco de dados que você criar
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
    secret: "my_secret_key", // Troque por uma chave segura
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
  res.sendFile(path.join(__dirname, "views", "home.html")); // Referencia ao arquivo home.html
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

  // Verificar se o usuário já existe no banco de dados
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.render('user-exists'); // Renderiza a página de erro 'Usuário já existe'
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o novo usuário no banco de dados
    const insertQuery = 'INSERT INTO users (username, password, adminKey) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, hashedPassword, adminKey], (err, result) => {
      if (err) throw err;
      res.render('register-success'); // Renderiza a página de sucesso
    });
  });
});

// Rota para processar o login
app.post("/login", async (req, res) => {
  const { username, password, adminKey } = req.body;

  // Verificar se o usuário existe no banco de dados
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.render("user-not-found"); // Renderiza a página de erro 'Usuário não encontrado'
    }

    const user = results[0];

    // Comparar a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("incorrect-password"); // Renderiza a página de erro 'Senha incorreta'
    }

    // Verificar a chave de administrador
    if (user.adminKey !== adminKey) {
      return res.render('incorrect-admin-key'); // Renderiza a página de erro 'Chave de administrador incorreta'
    }

    // Criar sessão
    req.session.user = username;

    // Verificar se é administrador
    if (adminKey === user.adminKey) {
      req.session.isAdmin = true;
      return res.render("admin-dashboard", { username }); // Renderiza a página de administrador
    } else {
      req.session.isAdmin = false;
      return res.render("dashboard", { username }); // Renderiza a página de usuário normal
    }
  });
});

// Rota para o dashboard do administrador
app.get("/admin-dashboard", (req, res) => {
  if (!req.session.user || !req.session.isAdmin) {
    return res.redirect("/login");
  }

  // Renderizar a página do dashboard do administrador
  res.render("admin-dashboard", { username: req.session.user });
});

// Rota para o dashboard do usuário comum
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Renderizar a página do dashboard do usuário
  res.render("dashboard", { username: req.session.user });
});

// Rota para logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendFile(path.join(__dirname, "views", "logout-error.html")); // Exibe o erro 'Erro ao deslogar'
    }
    res.redirect("/login");
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
