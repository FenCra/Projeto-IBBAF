const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src', 'assets', 'letras.json');
const destDir = path.join(__dirname, '..', 'ProjetoIBBAF-angular', 'src', 'assets', 'musicas');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

const data = fs.readFileSync(sourceFile, 'utf8');
const musicas = JSON.parse(data);

const grouped = {};
musicas.forEach(musica => {
  const letra = musica.nome.charAt(0).toLowerCase();
  if (!grouped[letra]) grouped[letra] = [];
  grouped[letra].push(musica);
});

Object.keys(grouped).forEach(letra => {
  const filePath = path.join(destDir, `${letra}.json`);
  fs.writeFileSync(filePath, JSON.stringify(grouped[letra], null, 2));
});

console.log('Arquivos divididos com sucesso.');
