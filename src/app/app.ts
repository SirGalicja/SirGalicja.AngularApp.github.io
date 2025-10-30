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

l1 = $localize`1 Sample`;
l2 = $localize`::1 Sample`;
l3 = $localize`1 Sample::`;


l4 = $localize`:@@id:1 Sample`;
l5 = $localize`:Description|Meaning@@id:1 Sample`;


l6 = $localize`1 Sample:@@id:`;
l7 = $localize`1 Sample:Description|Meaning@@id:`;

  
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


