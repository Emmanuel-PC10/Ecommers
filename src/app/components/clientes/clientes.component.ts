import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  showForm: Boolean = false;
  textoModal: String = "Nuevo Cliente";
  isEditMode: Boolean = false;
  selectedCliente: Cliente | null = null;


  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder
  ){
    this.clienteForm = this.formBuilder.group({
      id: [null],
      nombre: ['',[Validators.required, Validators.maxLength(50)]],
      apellido: ['',[Validators.required, Validators.maxLength(50)]],
      email: ['',[Validators.required, Validators.maxLength(100)]],
      telefono: ['',[Validators.required, Validators.maxLength(10)]],
      direccion: ['',[Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }
  

  loadClientes(): void{
    this.clienteService.getClientes().subscribe({
      next: data => {
        this.clientes = data;
        console.log(this.clientes);//aqui el del profe se llama aerolineas
      } 
    });
  }

  // Método para alternar la visibilidad del formulario
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.clienteForm.reset();  // Limpiar el formulario cuando se cierra
      this.isEditMode = false;  // Desactivar modo edición cuando se cierra el formulario
    }
  }
  // Método para cargar los datos del aeropuerto seleccionada en el formulario
  editCliente(cliente: Cliente): void {
    this.isEditMode = true;
    this.selectedCliente = cliente;
    this.textoModal = "Editar Cliente";
    
    // Rellenamos el formulario con los datos de la aerolínea seleccionada
    this.clienteForm.setValue({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    
    this.showForm = true;  // Mostrar el formulario para editar
  }
  
  // Método para manejar el envío del formulario (crear o editar aeropuerto)
  onSubmit(): void {
    if (this.clienteForm.valid) {
      if (this.isEditMode) {
        // Si estamos en modo edición, actualizamos la aerolínea
        this.clienteService.updateCliente(this.clienteForm.value).subscribe({
          next: (data) => {
            console.log("Cliente actualizado:", data);
            this.showForm = false;  // Ocultar el formulario después de actualizar
            this.loadClientes();  // Actualizar la lista de aeropuertos
            this.clienteForm.reset();  // Limpiar el formulario
            this.isEditMode = false;  // Desactivar modo edición
          },
          error: (err) => {
            this.mostrarErrores(err);
          }
        });
      } else {
        // Si estamos en modo creación, creamos un nuevo aeropuerto
        this.clienteService.creatCliente(this.clienteForm.value).subscribe({
          next: (data) => {
            console.log("Cliente creado:", data);
            this.showForm = false;  // Ocultar el formulario después de guardar
            this.loadClientes();  // Actualizar la lista de aerolíneas
            this.clienteForm.reset();  // Limpiar el formulario
          },
          error: (err) => {
            this.mostrarErrores(err);
          }
        });
      }
    }
  }
  
  
  deleteCliente(idCliente: number): void {
    Swal.fire({
      title: 'Eliminar cliente',
      text: '¿Estás seguro que deseas eliminar el cliente?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.clienteService.deleteCliente(idCliente).subscribe({
          next: (deletedCliente) => {
            this.clientes = this.clientes.filter(a => a.id !== idCliente);
            Swal.fire({
              title: 'Cliente eliminada',
              text: 'El Cliente se eliminó exitosamente',
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
  