import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';





@Component({
  selector: 'app-root',

  // dodatkowo
  standalone: true,

  imports: [RouterOutlet, CommonModule],// gdy dodajemy pipes (currency, date itp, trzeba zaimportować je)
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('Project Terra');
  protected readonly amount = signal(1020.99);  

  ex1 = $localize`1 Sample`;
  ex2 = $localize`2 Sample`;
  ex3 = $localize`3 Sample`;
  
  changeLanguage(event: Event) {
  const select = event.target as HTMLSelectElement;
  const lang = select.value;

  // Pobieramy baseHref z <base href="...">
  const base = document.querySelector('base')?.getAttribute('href') ?? '/';
  
  // Doklejamy język (upewniamy się, że kończy się '/')
  const normalizedBase = base.endsWith('/') 
  ? base 
  : base + '/'
  
  routes;

  const ifEn = normalizedBase.endsWith('/en')
  ? normalizedBase.slice(0, -3)
  : normalizedBase

  const ifPl = normalizedBase.endsWith('/pl/')
  ? normalizedBase.slice(0, -3)
  : normalizedBase

  const ifDe = normalizedBase.endsWith('/de/')
  ? normalizedBase.slice(0, -3)
  : normalizedBase

  window.location.href = `${ifEn}${lang}/`;
  }
  
}


