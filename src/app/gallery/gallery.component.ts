import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  idCategoriaNavigation?: any;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
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
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent, 
    FooterComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class GalleryComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriasConProductos: CategoriaConProductos[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: number = 0;
  loading: boolean = true;
  error: string = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarCategoriasConProductos();
  }



  cargarCategoriasConProductos() {
    this.loading = true;
    this.error = '';
    
    this.http.get<CategoriaConProductos[]>(`${API_URL}/Productos/Categorias`).subscribe({
      next: (data) => {
        this.categoriasConProductos = data.filter(cat => cat.activo);
        
        // Extraer todos los productos de todas las categorías
        this.productos = this.categoriasConProductos.flatMap(cat => 
          cat.productos.filter(p => p.activo)
        );
        
        // Crear lista de categorías para los botones
        this.categorias = this.categoriasConProductos.map(cat => ({
          idCategoria: cat.idCategoria,
          nombre: cat.nombre,
          descripcion: cat.descripcion
        }));
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías con productos:', error);
        this.error = 'Error al cargar los productos. Por favor, intenta de nuevo.';
        this.loading = false;
        
        // Mostrar datos de ejemplo si la API no está disponible
        this.cargarProductosEjemplo();
      }
    });
  }



  cargarProductosEjemplo() {
    this.categoriasConProductos = [
      {
        idCategoria: 1,
        nombre: "Smartphones y Accesorios",
        descripcion: "Descubre lo último en tecnología móvil y sus complementos.",
        urlImagen: "https://ejemplo.com/imagenes/categoria_smartphones.jpg",
        fechaCreacion: "2025-06-30T20:30:42.727",
        activo: true,
        productos: [
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
            idProducto: 2,
            nombre: 'Funda Protectora Ultra Resistente',
            descripcion: 'Máxima protección para tu smartphone.',
            precio: 19.99,
            sku: 'FUNDAULTRA',
            stock: 200,
            urlImagenPrincipal: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Funda+Protectora',
            idCategoria: 1,
            categoriaNombre: 'Smartphones y Accesorios',
            fechaCreacion: '2025-06-30T20:31:01.32',
            ultimaActualizacion: '2025-06-30T20:31:01.32',
            activo: true
          }
        ]
      },
      {
        idCategoria: 2,
        nombre: "Computadoras y Tablets",
        descripcion: "Equipos de cómputo para trabajo y entretenimiento.",
        urlImagen: "https://ejemplo.com/imagenes/categoria_computadoras.jpg",
        fechaCreacion: "2025-06-30T20:30:42.727",
        activo: true,
        productos: [
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
            idProducto: 4,
            nombre: 'Tablet Pro Max',
            descripcion: 'Tablet de 12 pulgadas con lápiz digital y teclado incluido.',
            precio: 799.99,
            sku: 'TABLETPM',
            stock: 30,
            urlImagenPrincipal: 'https://via.placeholder.com/300x200/F44336/ffffff?text=Tablet+Pro+Max',
            idCategoria: 2,
            categoriaNombre: 'Computadoras y Tablets',
            fechaCreacion: '2025-06-30T20:31:01.32',
            ultimaActualizacion: '2025-06-30T20:31:01.32',
            activo: true
          }
        ]
      },
      {
        idCategoria: 3,
        nombre: "Audio y Sonido",
        descripcion: "Equipos de audio profesionales y para el hogar.",
        urlImagen: "https://ejemplo.com/imagenes/categoria_audio.jpg",
        fechaCreacion: "2025-06-30T20:30:42.727",
        activo: true,
        productos: [
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
          },
          {
            idProducto: 22,
            nombre: 'Auriculares con Cancelación de Ruido Z',
            descripcion: 'Bloquea el mundo exterior y disfruta tu música.',
            precio: 179.00,
            sku: 'ACANZETA',
            stock: 80,
            urlImagenPrincipal: 'https://http2.mlstatic.com/D_NQ_NP_906957-MLU77933132990_082024-O.webp',
            fechaCreacion: '2025-06-30T20:31:01.32',
            ultimaActualizacion: '2025-06-30T20:31:01.32',
            activo: true,
            categoriaNombre: 'Audio y Sonido'
          }
        ]
      }
    ];
    
    // Extraer todos los productos de todas las categorías
    this.productos = this.categoriasConProductos.flatMap(cat => 
      cat.productos.filter(p => p.activo)
    );
    
    // Crear lista de categorías para los botones
    this.categorias = this.categoriasConProductos.map(cat => ({
      idCategoria: cat.idCategoria,
      nombre: cat.nombre,
      descripcion: cat.descripcion
    }));
    
    this.snackBar.open('Mostrando productos de ejemplo', 'Cerrar', { duration: 3000 });
  }

  get productosFiltrados() {
    let productosAMostrar: Producto[] = [];
    
    if (this.categoriaSeleccionada === 0) {
      // Mostrar todos los productos
      productosAMostrar = this.productos;
    } else {
      // Mostrar solo productos de la categoría seleccionada
      const categoriaSeleccionada = this.categoriasConProductos.find(c => c.idCategoria === this.categoriaSeleccionada);
      if (categoriaSeleccionada) {
        productosAMostrar = categoriaSeleccionada.productos.filter(p => p.activo);
      }
    }
    
    // Aplicar filtro de búsqueda
    return productosAMostrar.filter(p => 
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  seleccionarCategoria(idCategoria: number) {
    this.categoriaSeleccionada = idCategoria;
  }

  obtenerNombreCategoria(producto: Producto): string {
    // Si el producto tiene categoriaNombre, usarlo directamente
    if (producto.categoriaNombre) {
      return producto.categoriaNombre;
    }
    
    // Si no, buscar en las categorías por idCategoria
    if (producto.idCategoria) {
      const categoria = this.categorias.find(c => c.idCategoria === producto.idCategoria);
      return categoria ? categoria.nombre : `Categoría ${producto.idCategoria}`;
    }
    
    return 'Sin categoría';
  }

  agregarAlCarrito(producto: Producto) {
    this.snackBar.open(`${producto.nombre} agregado al carrito`, 'Cerrar', { duration: 2000 });
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
} 