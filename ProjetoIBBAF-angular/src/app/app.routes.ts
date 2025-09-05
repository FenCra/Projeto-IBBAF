import { Routes } from '@angular/router';
import { Home } from './home/home';
import { VisualizarMusicas } from './visualizar-musicas/visualizar-musicas';
import { CrudMusicas } from './crud-musicas/crud-musicas';
import { FormularioMusicas } from './formulario-musicas/formulario-musicas';
import { Apresentacao } from './apresentacao-musicas/apresentacao-musicas';
import { VisualizacaoUnica } from './visualizacao-unica/visualizacao-unica';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'visualizar', component: VisualizarMusicas },
  { path: 'crud', component: CrudMusicas },
  { path: 'adicionar-musica', component: FormularioMusicas },
  { path: 'editar-musica/:id', component: FormularioMusicas },
  { path: 'apresentacao', component: Apresentacao },
   { path: 'musica/:id', component: VisualizacaoUnica }
];