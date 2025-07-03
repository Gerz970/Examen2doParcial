import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageErrorDirective } from './image-error.directive';
import { ImageValidationService } from './image-validation.service';

@Component({
  selector: 'app-image-test',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ImageErrorDirective
  ],
  template: `
    <div class="test-container">
      <h2>Prueba de Validación de Imágenes</h2>
      
      <div class="test-grid">
        <mat-card class="test-card">
          <h3>Imagen Válida</h3>
          <img 
            [src]="validImageUrl" 
            alt="Imagen válida"
            class="test-image"
            appImageError
            [fallbackImage]="dummyImageUrl"
            (error)="onImageError($event, 'válida')"
            (load)="onImageLoad($event)">
          <p>Esta imagen debería cargar correctamente</p>
        </mat-card>

        <mat-card class="test-card">
          <h3>Imagen de Prueba</h3>
          <img 
            [src]="invalidImageUrl" 
            alt="Imagen de prueba"
            class="test-image"
            appImageError
            [fallbackImage]="dummyImageUrl"
            (error)="onImageError($event, 'de prueba')"
            (load)="onImageLoad($event)">
          <p>Esta imagen debería cargar correctamente</p>
        </mat-card>

        <mat-card class="test-card">
          <h3>URL Vacía</h3>
          <img 
            [src]="emptyImageUrl" 
            alt="URL vacía"
            class="test-image"
            appImageError
            [fallbackImage]="dummyImageUrl"
            (error)="onImageError($event, 'vacía')"
            (load)="onImageLoad($event)">
          <p>Esta imagen debería mostrar la imagen dummy</p>
        </mat-card>

        <mat-card class="test-card">
          <h3>Imagen Alternativa</h3>
          <img 
            [src]="malformedImageUrl" 
            alt="Imagen alternativa"
            class="test-image"
            appImageError
            [fallbackImage]="dummyImageUrl"
            (error)="onImageError($event, 'alternativa')"
            (load)="onImageLoad($event)">
          <p>Esta imagen debería cargar correctamente</p>
        </mat-card>
      </div>

      <div class="validation-results">
        <h3>Resultados de Validación</h3>
        <div class="result-item" *ngFor="let result of validationResults">
          <mat-icon [class]="result.isValid ? 'valid-icon' : 'invalid-icon'">
            {{ result.isValid ? 'check_circle' : 'error' }}
          </mat-icon>
          <span>{{ result.url }}: {{ result.isValid ? 'Válida' : 'Inválida' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .test-container h2 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .test-card {
      text-align: center;
      padding: 20px;
    }

    .test-card h3 {
      margin-bottom: 15px;
      color: #555;
    }

    .test-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 15px;
      transition: opacity 0.3s ease;
      opacity: 0;
    }

    .test-image[style*="opacity: 1"] {
      opacity: 1;
    }

    .test-card p {
      color: #666;
      font-size: 14px;
    }

    .validation-results {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
    }

    .validation-results h3 {
      margin-bottom: 15px;
      color: #333;
    }

    .result-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }

    .result-item mat-icon {
      margin-right: 10px;
    }

    .valid-icon {
      color: #4caf50;
    }

    .invalid-icon {
      color: #f44336;
    }

    .result-item span {
      font-family: monospace;
      font-size: 14px;
    }
  `]
})
export class ImageTestComponent {
  validImageUrl = 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Imagen+Válida';
  invalidImageUrl = 'https://via.placeholder.com/300x200/F44336/ffffff?text=Imagen+de+Prueba';
  emptyImageUrl = '';
  malformedImageUrl = 'https://via.placeholder.com/300x200/FF9800/ffffff?text=URL+Malformada';
  dummyImageUrl = 'https://via.placeholder.com/300x200/cccccc/666666?text=Imagen+No+Disponible';
  
  validationResults: Array<{url: string, isValid: boolean}> = [];

  constructor(private imageValidationService: ImageValidationService) {
    this.validateTestImages();
  }

  validateTestImages(): void {
    const testUrls = [
      this.validImageUrl,
      this.invalidImageUrl,
      this.emptyImageUrl,
      this.malformedImageUrl
    ];

    this.imageValidationService.validateMultipleImageUrls(testUrls)
      .subscribe({
        next: (validationMap) => {
          this.validationResults = Array.from(validationMap.entries()).map(([url, isValid]) => ({
            url: url || '(URL vacía)',
            isValid
          }));
        },
        error: (error) => {
          console.error('Error al validar imágenes de prueba:', error);
        }
      });
  }

  onImageError(event: Event, type: string): void {
    const img = event.target as HTMLImageElement;
    img.src = this.dummyImageUrl;
    console.warn(`Error al cargar imagen ${type}: ${img.src}`);
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
    console.log('Imagen cargada correctamente:', img.src);
  }
} 