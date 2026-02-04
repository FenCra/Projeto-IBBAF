const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// A sua API deve vir ANTES das rotas estaticas.
const isPkg = !!process.pkg;
const appBase = process.env.APP_BASE || (isPkg ? path.dirname(process.execPath) : path.join(__dirname, '..'));
const defaultMusicasDir = path.join(appBase, 'data', 'musicas');
const defaultFrontendDir = path.join(appBase, 'frontend');
const devMusicasDir = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src', 'assets', 'musicas');
const devFrontendDistDir = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'dist', 'browser');
const devFrontendSrcDir = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src');

const musicasDir = process.env.MUSICAS_DIR || (isPkg ? defaultMusicasDir : (fs.existsSync(defaultMusicasDir) ? defaultMusicasDir : devMusicasDir));
const frontendPath =
    process.env.FRONTEND_DIR ||
    (isPkg
        ? defaultFrontendDir
        : (fs.existsSync(defaultFrontendDir)
            ? defaultFrontendDir
            : (fs.existsSync(devFrontendDistDir) ? devFrontendDistDir : devFrontendSrcDir)));


// Função helper para ler todas as músicas
function lerTodasMusicas() {
    const musicas = [];
    if (!fs.existsSync(musicasDir)) {
        return musicas;
    }
    const files = fs.readdirSync(musicasDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(musicasDir, file);
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                if (data.trim()) {
                    const musicasDoArquivo = JSON.parse(data);
                    musicas.push(...musicasDoArquivo);
                }
            } catch (err) {
                console.error(`Erro ao ler arquivo ${file}:`, err);
            }
        }
    });
    return musicas;
}

// Função helper para salvar música em arquivo por letra
function salvarMusicaPorLetra(musica) {
    fs.mkdirSync(musicasDir, { recursive: true });
    const letra = musica.nome.charAt(0).toLowerCase();
    const filePath = path.join(musicasDir, `${letra}.json`);
    let musicasDoArquivo = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        musicasDoArquivo = JSON.parse(data);
    }
    musicasDoArquivo.push(musica);
    fs.writeFileSync(filePath, JSON.stringify(musicasDoArquivo, null, 2));
}

// Função helper para encontrar e atualizar música
function atualizarMusica(id, dadosAtualizados) {
    if (!fs.existsSync(musicasDir)) {
        return null;
    }
    const files = fs.readdirSync(musicasDir);
    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(musicasDir, file);
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                if (data.trim()) {
                    const musicas = JSON.parse(data);
                    const index = musicas.findIndex(m => m.id == id);
                    if (index !== -1) {
                        const musicaAntiga = musicas[index];
                        const musicaAtualizada = { ...musicaAntiga, ...dadosAtualizados };
                        musicas[index] = musicaAtualizada;
                        fs.writeFileSync(filePath, JSON.stringify(musicas, null, 2));
                        // Se a letra mudou, mover para outro arquivo
                        const novaLetra = musicaAtualizada.nome.charAt(0).toLowerCase();
                        const letraAntiga = musicaAntiga.nome.charAt(0).toLowerCase();
                        if (novaLetra !== letraAntiga) {
                            // Remover do arquivo antigo
                            musicas.splice(index, 1);
                            fs.writeFileSync(filePath, JSON.stringify(musicas, null, 2));
                            // Adicionar ao novo arquivo
                            salvarMusicaPorLetra(musicaAtualizada);
                        }
                        return musicaAtualizada;
                    }
                }
            } catch (err) {
                console.error(`Erro ao ler arquivo ${file}:`, err);
            }
        }
    }
    return null;
}

// Função helper para deletar música
function deletarMusica(id) {
    if (!fs.existsSync(musicasDir)) {
        return false;
    }
    const files = fs.readdirSync(musicasDir);
    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(musicasDir, file);
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                if (data.trim()) {
                    const musicas = JSON.parse(data);
                    const index = musicas.findIndex(m => m.id == id);
                    if (index !== -1) {
                        musicas.splice(index, 1);
                        fs.writeFileSync(filePath, JSON.stringify(musicas, null, 2));
                        return true;
                    }
                }
            } catch (err) {
                console.error(`Erro ao ler arquivo ${file}:`, err);
            }
        }
    }
    return false;
}

// Rotas de CRUD
app.get('/api/musicas', (req, res) => {
    try {
        const musicas = lerTodasMusicas();
        res.json(musicas);
    } catch (err) {
        console.error('Erro ao ler as músicas:', err);
        res.status(500).send('Erro ao ler as músicas.');
    }
});

app.get('/api/musicas/letra/:letra', (req, res) => {
    try {
        const letra = req.params.letra.toLowerCase();
        const filePath = path.join(musicasDir, `${letra}.json`);
        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }
        const data = fs.readFileSync(filePath, 'utf8');
        if (!data.trim()) {
            return res.json([]);
        }
        const musicas = JSON.parse(data);
        res.json(musicas);
    } catch (err) {
        console.error('Erro ao ler as músicas por letra:', err);
        res.status(500).send('Erro ao ler as músicas por letra.');
    }
});

app.get('/api/musicas/:id', (req, res) => {
    try {
        const musicas = lerTodasMusicas();
        const musica = musicas.find(m => m.id == req.params.id); // Usar == para comparar string ou number
        if (!musica) {
            return res.status(404).send('Música não encontrada.');
        }
        res.json(musica);
    } catch (err) {
        console.error('Erro ao ler a música:', err);
        res.status(500).send('Erro ao ler a música.');
    }
});

app.post('/api/musicas', (req, res) => {
    try {
        const musicas = lerTodasMusicas();
        const ids = musicas.map(m => parseInt(m.id)).filter(id => !isNaN(id));
        const maxId = ids.length ? Math.max(...ids) : 0;
        const novaMusica = req.body;
        novaMusica.id = (maxId + 1).toString(); // Manter como string para consistência
        salvarMusicaPorLetra(novaMusica);
        res.status(201).send('Música adicionada com sucesso.');
    } catch (err) {
        console.error('Erro ao salvar a música:', err);
        res.status(500).send('Erro ao salvar a música.');
    }
});

app.put('/api/musicas/:id', (req, res) => {
    const idParaAtualizar = req.params.id; // Manter como string
    const dadosAtualizados = req.body;
    try {
        const musicaAtualizada = atualizarMusica(idParaAtualizar, dadosAtualizados);
        if (!musicaAtualizada) {
            return res.status(404).send('Música não encontrada.');
        }
        res.status(200).send('Música atualizada com sucesso.');
    } catch (err) {
        console.error('Erro ao atualizar a música:', err);
        res.status(500).send('Erro ao atualizar a música.');
    }
});

app.delete('/api/musicas/:id', (req, res) => {
    const idParaDeletar = req.params.id;
    try {
        const deletado = deletarMusica(idParaDeletar);
        if (!deletado) {
            return res.status(404).send('Música não encontrada.');
        }
        res.status(200).send('Música deletada com sucesso.');
    } catch (err) {
        console.error('Erro ao deletar a música:', err);
        res.status(500).send('Erro ao deletar a música.');
    }
});

// Serve os arquivos do frontend (dist no deploy, src no dev)
app.use(express.static(frontendPath));

// Middleware que garante que o Angular lide com as rotas.
// Esta e a nova rota generica que evita o erro.
const indexHtml = path.join(frontendPath, 'index.html');
const indexCsr = path.join(frontendPath, 'index.csr.html');
const indexToUse = fs.existsSync(indexHtml) ? indexHtml : (fs.existsSync(indexCsr) ? indexCsr : indexHtml);
app.use((req, res) => {
    res.sendFile(indexToUse);
});

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
server.on('error', (err) => {
    console.error('Erro ao iniciar servidor:', err);
});
