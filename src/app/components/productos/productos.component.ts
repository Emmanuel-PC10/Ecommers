import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { Producto } from '../../models/producto.model';

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  carrito: CarritoItem[] = [];
  precioTotal: number = 0;
  mostrarCarrito: boolean = false; // Controla si el carrito se muestra o no

  constructor(private router: Router) {} // Inyecta el Router

  ngOnInit() {
    this.productos = [
      { id: 1, nombre: 'Laptop Gamer', precio: 1500, imagen: 'https://m.media-amazon.com/images/I/71IsafDXnKL.jpg' },
      { id: 2, nombre: 'Smartphone Samsung', precio: 800, imagen: 'https://i5-mx.walmartimages.com/samsmx/images/product-images/img_large/981017612l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF' },
      { id: 3, nombre: 'Auriculares Bluetooth', precio: 120, imagen: 'https://cdn1.coppel.com/images/catalog/mkp/3634/5000/36343372-1.jpg' },
      { id: 4, nombre: 'Smartwatch Apple', precio: 400, imagen: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MYG03ref_FV98_VW_34FR+watch-case-44-aluminum-midnight-nc-se_VW_34FR+watch-face-44-aluminum-midnight-se_VW_34FR?wid=752&hei=720&bgc=fafafa&trim=1&fmt=p-jpg&qlt=80&.v=OUh6OFdFVEJxVkF6SUo5TWxpTE50MG5TeWJ6QW43NUFnQ2V4cmRFc1VnWWxvMTNVeXVWaTk0Ui9PSEVKVVU0dzN2QVRTWW5kR2Jad3ptYU8zZ21EUWZmQXlUU2xCQ2pTN3lrcDE0UU1hK0ZpRFN2VTEyRk9ZNEFubk9kM01kUmIySDNGVkFuTWJDdzY3LzhwNXhBeGdqanlpa2c4cm9CV25oRTZ3N0FCaUk1SHU3NmZyQzBTVVZ5ZWlSanV5V2tOdkZ1emhkYWNycmJka1dOU01FKzNBdFRUV0g5d1FoYmhBY0FhQ1ZnNFdFRFI2SjAxL1NHYWFLQ2hLdGdQSUw4bw' },
      { id: 5, nombre: 'Teclado Mecánico RGB', precio: 100, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS022qhXTD-qmjhG8rV9nV5d_Doy_-fmfTQog&s' },
      { id: 6, nombre: 'Mouse Inalámbrico', precio: 50, imagen: 'https://www.officedepot.com.mx/medias/100021861.jpg-1200ftw?context=bWFzdGVyfHJvb3R8MjM3NjMzfGltYWdlL2pwZWd8YUdWbEwyaG1aaTh4TURBMU1USTJPVEE1T1RVMU1DNXFjR2N8ZmUzNDcyM2ExYzFiMDZmM2RkMTIxMzQxYzEyMTExMzRlMGE4M2E2NDI1M2FjZDAwNDY0ZTEzNDdjMDVhZGJjYw' }
    ];
  }

  agregarAlCarrito(producto: Producto) {
    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
        itemExistente.cantidad++; // Si el producto ya está en el carrito, aumenta la cantidad
    } else {
        this.carrito.push({ producto, cantidad: 1 }); // Si no está, lo agrega al carrito
    }

    this.actualizarPrecioTotal(); // Actualiza el precio total
  }

  eliminarDelCarrito(item: CarritoItem) {
      this.carrito = this.carrito.filter(i => i !== item); // Elimina el producto del carrito
      this.actualizarPrecioTotal(); // Actualiza el precio total
  }

  actualizarPrecioTotal() {
      this.precioTotal = this.carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0); // Calcula el precio total
  }

  regresar() {
    this.router.navigate(['/']); // Navega a la ruta de HomeComponent
}

}

