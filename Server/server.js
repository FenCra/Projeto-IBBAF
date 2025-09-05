const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// A sua API deve vir ANTES das rotas estáticas.
const filePath = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src', 'assets', 'letras.json');

// Rotas de CRUD
app.get('/api/musicas', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler letras.json:', err);
            return res.status(500).send('Erro ao ler o arquivo de letras.');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/musicas/:id', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de letras.');
        }
        const musicas = JSON.parse(data);
        const musica = musicas.find(m => m.id === parseInt(req.params.id));
        if (!musica) {
            return res.status(404).send('Música não encontrada.');
        }
        res.json(musica);
    });
});

app.post('/api/musicas', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de letras.');
        }
        const musicas = JSON.parse(data);
        const novaMusica = req.body;
        novaMusica.id = musicas.length ? Math.max(...musicas.map(m => m.id)) + 1 : 1;
        musicas.push(novaMusica);
        fs.writeFile(filePath, JSON.stringify(musicas, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar a música.');
            }
            res.status(201).send('Música adicionada com sucesso.');
        });
    });
});

app.put('/api/musicas/:id', (req, res) => {
    const idParaAtualizar = parseInt(req.params.id);
    const dadosAtualizados = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo.');
        }
        let musicas = JSON.parse(data);
        const index = musicas.findIndex(m => m.id === idParaAtualizar);
        if (index === -1) {
            return res.status(404).send('Música não encontrada.');
        }
        musicas[index] = { ...musicas[index], ...dadosAtualizados };
        fs.writeFile(filePath, JSON.stringify(musicas, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar a música.');
            }
            res.status(200).send('Música atualizada com sucesso.');
        });
    });
});

app.delete('/api/musicas/:id', (req, res) => {
    const idParaDeletar = parseInt(req.params.id);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo.');
        }
        const musicas = JSON.parse(data);
        const musicasFiltradas = musicas.filter(m => m.id !== idParaDeletar);
        fs.writeFile(filePath, JSON.stringify(musicasFiltradas, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao deletar a música.');
            }
            res.status(200).send('Música deletada com sucesso.');
        });
    });
});

// Serve os arquivos da pasta 'src'
const angularSrcPath = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src');
app.use(express.static(angularSrcPath));

// Middleware que garante que o Angular lide com as rotas.
// Esta é a nova rota genérica que evita o erro.
app.use((req, res) => {
    res.sendFile(path.join(angularSrcPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});