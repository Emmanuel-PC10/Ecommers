import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Producto } from '../models/producto.model';


@Injectable({
  providedIn: 'root', // Esto hace que el servicio esté disponible en toda la aplicación
})
export class ProductoService {
  private apiUrl: string = environment.apiUrl + 'productos/'

  constructor(private http: HttpClient) {}

  // Método para obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl); // Ajusta la ruta según tu backend
  }
}