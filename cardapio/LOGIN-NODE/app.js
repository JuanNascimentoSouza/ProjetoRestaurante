const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const users = []; // Armazenamento temporário de usuários

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
  const { username, password } = req.body;

  // Verificar se o usuário já existe
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.render('user-exists'); // Renderiza a página de erro 'Usuário já existe'
  }

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Armazenar o novo usuário
  users.push({
    username,
    password: hashedPassword
  });

  // Renderiza a página de sucesso após o registro
  res.render('register-success'); // Renderiza a página de sucesso após o registro
});

// Rota para processar o login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário existe
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.render("user-not-found"); // Renderiza a página de erro 'Usuário não encontrado'
  }

  // Comparar a senha fornecida com a senha armazenada
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("incorrect-password"); // Renderiza a página de erro 'Senha incorreta'
  }

  // Criar sessão
  req.session.user = username;

  // Renderizar página de login bem-sucedido com o nome do usuário
  res.render("login-success", { username }); // Renderiza a página de sucesso e passa o username
});

// Rota para o dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Renderizar a página do dashboard com o nome do usuário
  res.render("dashboard", { username: req.session.user }); // Passa o nome do usuário na sessão
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
