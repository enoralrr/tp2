import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router'; 
@Component({ 
selector: 'app-root', 
templateUrl: './app.html', 
styleUrl: './app.css' 
}) 
export class App {
  prenom: string = "Enora";
  mydate: string = new Date().toLocaleTimeString();
  fruits = ['pomme', 'kiwi', 'orange']; 

  compteur: number = 0;

  incrementer() {
    this.compteur++;
  }

  decrementer() {
    this.compteur--;
  }
  



}



