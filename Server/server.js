const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'dist')));
const filePath = path.join(__dirname, 'letras.json');

// Rotas de CRUD
app.get('/api/musicas', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o arquivo.');
    res.json(JSON.parse(data));
  });
});

app.post('/api/musicas', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o arquivo.');
    const musicas = JSON.parse(data);
    const novaMusica = req.body;
    novaMusica.id = musicas.length ? Math.max(...musicas.map(m => m.id)) + 1 : 1;
    musicas.push(novaMusica);
    fs.writeFile(filePath, JSON.stringify(musicas, null, 2), (err) => {
      if (err) return res.status(500).send('Erro ao salvar a música.');
      res.status(201).send('Música adicionada com sucesso.');
    });
  });
});

app.delete('/api/musicas/:id', (req, res) => {
  const idParaDeletar = parseInt(req.params.id);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o arquivo.');
    const musicas = JSON.parse(data);
    const musicasFiltradas = musicas.filter(m => m.id !== idParaDeletar);
    fs.writeFile(filePath, JSON.stringify(musicasFiltradas, null, 2), (err) => {
      if (err) return res.status(500).send('Erro ao deletar a música.');
      res.status(200).send('Música deletada com sucesso.');
    });
  });
});

app.put('/api/musicas/:id', (req, res) => {
  const idParaAtualizar = parseInt(req.params.id);
  const dadosAtualizados = req.body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o arquivo.');
    let musicas = JSON.parse(data);
    const index = musicas.findIndex(m => m.id === idParaAtualizar);
    if (index === -1) return res.status(404).send('Música não encontrada.');
    musicas[index] = { ...musicas[index], ...dadosAtualizados };
    fs.writeFile(filePath, JSON.stringify(musicas, null, 2), (err) => {
      if (err) return res.status(500).send('Erro ao salvar a música.');
      res.status(200).send('Música atualizada com sucesso.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
