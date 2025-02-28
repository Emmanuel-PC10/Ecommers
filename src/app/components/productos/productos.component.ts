import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';


interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: false,
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {
  productos: Producto[] = []; // Lista de productos
  carrito: CarritoItem[] = []; // Carrito de compras
  precioTotal: number = 0; // Precio total del carrito
  mostrarCarrito: boolean = false; // Controla si el carrito se muestra o no
  productosEditar: Producto[] = [];

  constructor(
    private router: Router, // Inyecta el Router
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.obtenerProductos(); // Llama al método para obtener los productos al iniciar
  }

  // Método para obtener los productos desde el backend
  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe(
      (data) => {
        console.log('Productos obtenidos del backend:', data);
        this.productos = data;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }
  
  agregarAlCarrito(producto: Producto): void {
    const index = this.carrito.findIndex((item) => item.producto.idProducto === producto.idProducto);
  
    if (index !== -1) {
      this.carrito[index].cantidad += 1; // Si ya está en el carrito, aumenta la cantidad
    } else {
      this.carrito.push({ producto: { ...producto }, cantidad: 1 }); // Si no, lo agrega como nuevo
    }
  
    this.actualizarPrecioTotal();
    console.log('Carrito actualizado:', this.carrito);
  }

  eliminarDelCarrito(item: CarritoItem): void {
    const index = this.carrito.findIndex((i) => i.producto.idProducto === item.producto.idProducto);
  
    if (index !== -1) {
      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad -= 1; // Reducir cantidad en 1
      } else {
        this.carrito.splice(index, 1); // Eliminar del carrito si la cantidad es 1
      }
    }
  
    this.actualizarPrecioTotal(); // Actualiza el total del carrito
  }
  
  // Método para calcular el precio total del carrito
  actualizarPrecioTotal(): void {
    this.precioTotal = this.carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }

  // Método para regresar a la página de inicio
  regresar(): void {
    this.router.navigate(['/']); // Navega a la ruta de HomeComponent
  }
}