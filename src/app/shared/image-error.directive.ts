import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageError]',
  standalone: true
})
export class ImageErrorDirective {
  @Input() fallbackImage: string = 'https://via.placeholder.com/300x200/cccccc/666666?text=Imagen+No+Disponible';
  @Input() originalSrc: string = '';
  
  private hasError = false;

  constructor(private el: ElementRef) {}

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement as HTMLImageElement;
    
    // Evitar cambios múltiples de imagen
    if (!this.hasError && img.src !== this.fallbackImage) {
      this.hasError = true;
      img.src = this.fallbackImage;
      console.warn(`Error al cargar imagen: ${img.src}`);
    }
  }

  @HostListener('load')
  onLoad() {
    const img = this.el.nativeElement as HTMLImageElement;
    
    // Si la imagen se carga correctamente, resetear el flag de error
    if (img.src === this.fallbackImage) {
      this.hasError = false;
    }
    
    // Aplicar opacidad completa cuando la imagen se carga
    img.style.opacity = '1';
  }
} 