import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ImageErrorDirective } from '../shared/image-error.directive';
import { ImageValidationService } from '../shared/image-validation.service';
import { API_URL } from '../../environments/environment';

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  sku: string;
  stock: number;
  urlImagenPrincipal: string;
  idCategoria?: number;
  categoriaNombre?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
  activo: boolean;
}

interface CategoriaConProductos {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  urlImagen: string;
  fechaCreacion: string;
  activo: boolean;
  productos: Producto[];
}

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
    MatProgressSpinnerModule,
    RouterModule,
    ImageErrorDirective
  ]
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private imageValidationService: ImageValidationService
  ) {}

  ngOnInit() {
    this.cargarProductosDestacados();
  }

  /**
   * Carga productos destacados aleatorios del servicio
   */
  cargarProductosDestacados() {
    this.loading = true;
    
    this.http.get<CategoriaConProductos[]>(`${API_URL}/Productos/Categorias`).subscribe({
      next: (data) => {
        const categoriasConProductos = data.filter(cat => cat.activo);
        
        // Extraer todos los productos activos de todas las categorías
        const todosLosProductos = categoriasConProductos.flatMap(cat => 
          cat.productos.filter(p => p.activo)
        );
        
        // Seleccionar 3 productos aleatorios
        this.seleccionarProductosAleatorios(todosLosProductos);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos destacados:', error);
        this.loading = false;
        
        // Cargar productos de ejemplo si la API no está disponible
        this.cargarProductosEjemplo();
      }
    });
  }

  /**
   * Selecciona 3 productos aleatorios para destacar
   */
  seleccionarProductosAleatorios(productos: Producto[]): void {
    if (productos.length === 0) {
      this.productosDestacados = [];
      return;
    }
    
    // Crear una copia del array de productos para no modificar el original
    const productosDisponibles = [...productos];
    const productosSeleccionados: Producto[] = [];
    
    // Seleccionar hasta 3 productos aleatorios
    const cantidadDestacados = Math.min(3, productosDisponibles.length);
    
    for (let i = 0; i < cantidadDestacados; i++) {
      // Generar índice aleatorio
      const indiceAleatorio = Math.floor(Math.random() * productosDisponibles.length);
      
      // Agregar el producto seleccionado
      productosSeleccionados.push(productosDisponibles[indiceAleatorio]);
      
      // Remover el producto seleccionado para evitar duplicados
      productosDisponibles.splice(indiceAleatorio, 1);
    }
    
    this.productosDestacados = productosSeleccionados;
  }

  /**
   * Carga productos de ejemplo cuando la API no está disponible
   */
  cargarProductosEjemplo() {
    this.productosDestacados = [
      {
        idProducto: 1,
        nombre: 'Smartphone X10 Pro',
        descripcion: 'El smartphone más avanzado con triple cámara y procesador de última generación.',
        precio: 999.99,
        sku: 'SMARTX10P',
        stock: 50,
        urlImagenPrincipal: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Smartphone+X10+Pro',
        idCategoria: 1,
        categoriaNombre: 'Smartphones y Accesorios',
        fechaCreacion: '2025-06-30T20:31:01.32',
        ultimaActualizacion: '2025-06-30T20:31:01.32',
        activo: true
      },
      {
        idProducto: 3,
        nombre: 'Laptop Gaming Ultra',
        descripcion: 'Laptop de alto rendimiento para gaming y trabajo profesional.',
        precio: 1499.99,
        sku: 'LAPTOPUL',
        stock: 25,
        urlImagenPrincipal: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Laptop+Gaming+Ultra',
        idCategoria: 2,
        categoriaNombre: 'Computadoras y Tablets',
        fechaCreacion: '2025-06-30T20:31:01.32',
        ultimaActualizacion: '2025-06-30T20:31:01.32',
        activo: true
      },
      {
        idProducto: 5,
        nombre: 'Auriculares Wireless Pro',
        descripcion: 'Auriculares bluetooth con cancelación de ruido activa.',
        precio: 299.99,
        sku: 'AUDIOWP',
        stock: 100,
        urlImagenPrincipal: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Auriculares+Wireless+Pro',
        idCategoria: 3,
        categoriaNombre: 'Audio y Sonido',
        fechaCreacion: '2025-06-30T20:31:01.32',
        ultimaActualizacion: '2025-06-30T20:31:01.32',
        activo: true
      }
    ];
    
    this.snackBar.open('Mostrando productos de ejemplo', 'Cerrar', { duration: 3000 });
  }

  /**
   * Obtiene la URL de imagen dummy para un producto
   * @param producto El producto para el cual generar la imagen dummy
   * @returns URL de la imagen dummy
   */
  getDummyImageUrl(producto: Producto): string {
    return this.imageValidationService.getDummyImage(
      `Imagen de ${producto.nombre}`,
      300,
      200
    );
  }

  /**
   * Maneja el error de carga de una imagen
   * @param event Evento de error de la imagen
   * @param producto Producto asociado a la imagen
   */
  onImageError(event: Event, producto: Producto): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getDummyImageUrl(producto);
    console.warn(`Error al cargar imagen para ${producto.nombre}: ${producto.urlImagenPrincipal}`);
  }

  /**
   * Maneja la carga exitosa de una imagen
   * @param event Evento de carga de la imagen
   */
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  /**
   * Agrega un producto al carrito
   * @param producto El producto a agregar
   */
  agregarAlCarrito(producto: Producto): void {
    this.snackBar.open(`${producto.nombre} agregado al carrito`, 'Cerrar', { duration: 2000 });
  }

  /**
   * Formatea el precio para mostrar
   * @param precio El precio a formatear
   * @returns Precio formateado como string
   */
  formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }
} 