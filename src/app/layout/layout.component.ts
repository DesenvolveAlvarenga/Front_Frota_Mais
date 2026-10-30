import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-layout', standalone: false,
  templateUrl: './layout.component.html', styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  // Edite estes textos para identificar o software da equipe.
  nomeSistema = 'Projeto Integrador';
  usuario = 'Aluno exemplo';
  // Informação visual de exemplo: este modelo não implementa login.
  readonly telaPequena$ = inject(BreakpointObserver)
    .observe('(max-width: 767px)')
    .pipe(map(result => result.matches), shareReplay({ bufferSize: 1, refCount: true }));
}
