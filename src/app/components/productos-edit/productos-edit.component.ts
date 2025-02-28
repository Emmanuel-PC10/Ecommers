import { Component } from '@angular/core';
import { ProductoEdit } from '../../models/productoEdit.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoEditService } from '../../services/productoEdit.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-productos-edit',
  standalone: false,
  templateUrl: './productos-edit.component.html',
  styleUrl: './productos-edit.component.css'
})
export class ProductosEditComponent {
  productos: ProductoEdit[] = [];
  productoForm: FormGroup;
  showForm: Boolean = false;
  textoModal: String = "Nuevo Producto";
  isEditMode: Boolean = false;
  selectedProducto: ProductoEdit | null = null;


  constructor(
    private productoEditService: ProductoEditService,
    private formBuilder: FormBuilder
  ){
    this.productoForm = this.formBuilder.group({
      idProducto: [null],
      nombre: ['',[Validators.required, Validators.maxLength(50)]],
      descripcion: ['',[Validators.required, Validators.maxLength(250)]],
      precio: ['',[Validators.required]],
      stock: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.loadProductos();
  }
  

  loadProductos(): void {
    this.productoEditService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
    console.log("Datos de productos:", this.productos); // Verifica la estructura
  }
// Método para alternar la visibilidad del formulario
toggleForm(): void {
  this.showForm = !this.showForm;
  if (!this.showForm) {
    this.productoForm.reset();  // Limpiar el formulario cuando se cierra
    this.isEditMode = false;  // Desactivar modo edición cuando se cierra el formulario
  }
}

// Método para cargar los datos de la aerolínea seleccionada en el formulario
editProducto(producto: ProductoEdit): void {
  this.isEditMode = true;
  this.selectedProducto = producto;
  this.textoModal = "Editar Producto";
  
  // Rellenamos el formulario con los datos de la aerolínea seleccionada
  this.productoForm.setValue({
    idProducto: producto.idProducto,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
  });
  
  this.showForm = true;  // Mostrar el formulario para editar
}

// Método para manejar el envío del formulario (crear o editar aerolínea)
onSubmit(): void {
  if (this.productoForm.valid) {
    if (this.isEditMode) {
      // Si estamos en modo edición, actualizamos la aerolínea
      this.productoEditService.updateProducto(this.productoForm.value).subscribe({
        next: (data) => {
          console.log("Producto actualizada:", data);
          this.showForm = false;  // Ocultar el formulario después de actualizar
          this.loadProductos();  // Actualizar la lista de aerolíneas
          this.productoForm.reset();  // Limpiar el formulario
          this.isEditMode = false;  // Desactivar modo edición
        },
        error: (err) => {
          this.mostrarErrores(err);
        }
      });
    } else {
      // Si estamos en modo creación, creamos una nueva aerolínea
      this.productoEditService.creatProducto(this.productoForm.value).subscribe({
        next: (data) => {
          console.log("Producto creada:", data);
          this.showForm = false;  // Ocultar el formulario después de guardar
          this.loadProductos();  // Actualizar la lista de aerolíneas
          this.productoForm.reset();  // Limpiar el formulario
        },
        error: (err) => {
          this.mostrarErrores(err);
        }
      });
    }
  }
}


deleteProductos(idProducto: number): void {
  if (idProducto === undefined || idProducto === null) {
    console.error('El id del producto no está definido');
    return;
  }

  Swal.fire({
    title: 'Eliminar producto',
    text: '¿Estás seguro que deseas eliminar el producto?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true
  }).then((resp) => {
    if (resp.isConfirmed) {
      this.productoEditService.deleteProducto(idProducto).subscribe({
        next: (deletedProductos) => {
          this.productos = this.productos.filter(a => a.idProducto !== idProducto);
          Swal.fire({
            title: 'Producto eliminada',
            text: 'La Producto se eliminó exitosamente',
            icon: 'success'
          });
        },
        error: (error) => {
          this.mostrarErrores(error);
        }
      });
    }
  });
}

mostrarErrores(errorResponse: any): void {
  // Verificar si hay errores
  if (errorResponse && errorResponse.error) {
    let errores = errorResponse.error;
    let mensajeErrores = '';
    
    // Recorrer todos los errores
    for (let campo in errores) {
      if (errores.hasOwnProperty(campo)) {
        mensajeErrores += errores[campo] + "\n"; // Unir los mensajes con saltos de línea
      }
    }

    // Mostrar todos los errores en una alerta
    Swal.fire({
      icon: 'error',
      title: 'Errores encontrados',
      text: mensajeErrores.trim(), // Eliminar el salto de línea al final
    });
  } else {
    // Si no se recibieron errores del backend
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al procesar la solicitud.',
    });
  }
}
}
