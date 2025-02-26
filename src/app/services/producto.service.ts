import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop', precio: 1000, imagen: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Teléfono', precio: 500, imagen: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Auriculares', precio: 100, imagen: 'https://via.placeholder.com/150' }
  ];

  obtenerProductos(): Producto[] {
    return this.productos;
  }
}
