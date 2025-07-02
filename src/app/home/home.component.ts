import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule,
    RouterModule
  ]
})
export class HomeComponent {
  productosPrincipales = [
    { 
      nombre: 'Producto Destacado 1', 
      imagen: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Producto+1',
      descripcion: 'Descripción del producto destacado 1',
      precio: '$299.99'
    },
    { 
      nombre: 'Producto Destacado 2', 
      imagen: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Producto+2',
      descripcion: 'Descripción del producto destacado 2',
      precio: '$199.99'
    },
    { 
      nombre: 'Producto Destacado 3', 
      imagen: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Producto+3',
      descripcion: 'Descripción del producto destacado 3',
      precio: '$399.99'
    }
  ];
} 