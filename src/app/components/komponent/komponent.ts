import { Component } from '@angular/core';


import { VehiclesPermission } from './../../services/VehiclesPermission'

@Component({
  selector: 'app-komponent',
  imports: [],
  templateUrl: './komponent.html',
  styleUrl: './komponent.css'
})
export class Komponent {
  VehiclesPermission = VehiclesPermission
  
  

}
