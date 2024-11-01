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
app.use(bodyParser.json()); // Adicionado para suportar JSON

// Configurando a pasta de arquivos estáticos (CSS, JS e imagens)
app.use(express.static(path.join(__dirname, 'views')));

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

// ====================================
// Criação do middleware de verificação
// ====================================
function isAdmin(req, res, next) {
  if (!req.session.user || !req.session.isAdmin) {
    return res.status(403).json({ error: "Acesso negado. Somente administradores podem realizar esta ação." });
  }
  next(); // Se for administrador, prosseguir
}

// ====================================
// Rotas
// ====================================

// Rota principal para '/'
app.get("/", (req, res) => {
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
      return res.render('incorrect-admin-key');
    }

    req.session.user = username;
    req.session.isAdmin = user.adminKey === adminKey;

    // Redirecionar para o dashboard após login
    return res.redirect("/dashboard");
  });
});

// Rota para o dashboard do usuário comum
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "dashboard.html")); // Envia o arquivo index.html
});

// Rota para atualizar o produto
app.post('/dashboard/editar', isAdmin, (req, res) => {
  const { id, name, image } = req.body;
  const query = 'UPDATE produtos SET name = ?, image = ? WHERE id = ?';
  db.query(query, [name, image, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
    res.redirect('/dashboard');
  });
});

// Rota para o dashboard do administrador
app.get("/admin-dashboard", (req, res) => {
  if (!req.session.user || !req.session.isAdmin) {
    return res.redirect("/");
  }
  res.render("admin-dashboard", { username: req.session.user });
});

// Rota para logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error', { message: 'Erro ao deslogar.' });
    }
    res.redirect("/");
  });
});

// ============================
// Gerenciamento de Conteúdos (CRUD)
// ============================

// GET /conteudo — Para obter todos os conteúdos (visível para todos)
app.get('/conteudo', (req, res) => {
  const query = 'SELECT * FROM conteudo';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar conteúdos.' });
    }
    res.json(results);  // Envia todos os conteúdos em formato JSON
  });
});

// POST /conteudo — Para criar novo conteúdo (restrito a administradores)
app.post('/conteudo', isAdmin, (req, res) => {
  const { title, body, author } = req.body;
  const query = 'INSERT INTO conteudo (title, body, author) VALUES (?, ?, ?)';

  db.query(query, [title, body, author], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao adicionar conteúdo.' });
    }
    res.status(201).json({ message: 'Conteúdo criado com sucesso!', id: result.insertId });
  });
});

// PUT /conteudo/:id — Para atualizar conteúdo existente (restrito a administradores)
app.put('/conteudo/:id', isAdmin, (req, res) => {
  const { title, body, author } = req.body;
  const query = 'UPDATE conteudo SET title = ?, body = ?, author = ? WHERE id = ?';

  db.query(query, [title, body, author, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar conteúdo.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conteúdo não encontrado.' });
    }
    res.json({ message: 'Conteúdo atualizado com sucesso!' });
  });
});

// DELETE /conteudo/:id — Para remover conteúdo (restrito a administradores)
app.delete('/conteudo/:id', isAdmin, (req, res) => {
  const query = 'DELETE FROM conteudo WHERE id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar conteúdo.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conteúdo não encontrado.' });
    }
    res.json({ message: 'Conteúdo deletado com sucesso!' });
  });
});

// ============================
// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
