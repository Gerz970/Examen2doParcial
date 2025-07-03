import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageValidationService {

  constructor(private http: HttpClient) {}

  /**
   * Valida si una URL de imagen es válida y accesible
   * @param url La URL de la imagen a validar
   * @returns Observable<boolean> true si la imagen es válida, false en caso contrario
   */
  validateImageUrl(url: string): Observable<boolean> {
    if (!url || url.trim() === '') {
      return of(false);
    }

    // Validación básica de formato URL
    try {
      new URL(url);
    } catch {
      return of(false);
    }

    // Verificar si la imagen es accesible
    return this.http.head(url, { observe: 'response' }).pipe(
      map(response => {
        const contentType = response.headers.get('content-type');
        return Boolean(contentType && contentType.startsWith('image/'));
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Obtiene una imagen dummy basada en el tipo de contenido
   * @param fallbackText Texto opcional para mostrar en la imagen dummy
   * @param width Ancho de la imagen dummy
   * @param height Alto de la imagen dummy
   * @returns URL de la imagen dummy
   */
  getDummyImage(fallbackText: string = 'Imagen No Disponible', width: number = 300, height: number = 200): string {
    const encodedText = encodeURIComponent(fallbackText);
    return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=${encodedText}`;
  }

  /**
   * Valida múltiples URLs de imagen de forma asíncrona
   * @param urls Array de URLs a validar
   * @returns Observable<Map<string, boolean>> Mapa con URL como clave y validez como valor
   */
  validateMultipleImageUrls(urls: string[]): Observable<Map<string, boolean>> {
    const validationMap = new Map<string, boolean>();
    const validationPromises: Observable<{url: string, isValid: boolean}>[] = [];

    urls.forEach(url => {
      validationPromises.push(
        this.validateImageUrl(url).pipe(
          map(isValid => ({ url, isValid }))
        )
      );
    });

    return new Observable(observer => {
      let completed = 0;
      validationPromises.forEach((validation$, index) => {
        validation$.subscribe({
          next: result => {
            validationMap.set(result.url, result.isValid);
            completed++;
            if (completed === validationPromises.length) {
              observer.next(validationMap);
              observer.complete();
            }
          },
          error: () => {
            validationMap.set(urls[index], false);
            completed++;
            if (completed === validationPromises.length) {
              observer.next(validationMap);
              observer.complete();
            }
          }
        });
      });
    });
  }
} 