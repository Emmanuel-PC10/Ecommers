import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.models';
import { Cliente } from '../../models/cliente.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{
  pedidos: Pedido[] = [];
  pedidoForm: FormGroup;
  showForm: Boolean = false;
  textoModal: String = "Nuevo Pedido";
  isEditMode: Boolean = false;
  selectedPedido: Pedido | null = null;
  clientes: Cliente[] = [];
  


  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService, // Inyecta el servicio de aerolíneas
    private formBuilder: FormBuilder

  ){
    this.pedidoForm = this.formBuilder.group({
      id: [null],
      total: ['',[Validators.required]],
      idCliente: ['',[Validators.required]],
      estado: ['',[Validators.required]],
      fechaCreacion: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPedidos();
    this.loadClientes();
  }
  

  loadPedidos(): void{
    this.pedidoService.getPedidos().subscribe({
      next: data => {
        this.pedidos = data;
        console.log(this.pedidos);
      } 
    });
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('clientes cargadas:', this.clientes);
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.pedidoForm.valid) {
      const pedidoData = this.pedidoForm.value;

  
      if (this.isEditMode) {
        // Modo edición
        this.pedidoService.updateVuelo(pedidoData).subscribe({
          next: (response) => {
            console.log('Pedido actualizado:', response);
            this.loadPedidos(); // Recargar la lista de vuelos
            this.showForm = false; // Ocultar el formulario
            this.pedidoForm.reset(); // Limpiar el formulario
            this.isEditMode = false; // Desactivar modo edición
          },
          error: (err) => {
            this.mostrarErrores(err);
          },
        });
      } else {
        
        this.pedidoService.creatPedido(pedidoData).subscribe({
          next: (response) => {
            console.log('pedido creado:', response);
            this.loadPedidos(); // Recargar la lista de aviones
            this.showForm = false; // Ocultar el formulario
            this.pedidoForm.reset(); // Limpiar el formulario
          },
          error: (err) => {
            this.mostrarErrores(err);
          },
        });
      }
    }
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.pedidoForm.reset(); // Limpiar el formulario
      this.isEditMode = false; // Desactivar modo edición
    }
  }



  editPedido(pedido: Pedido): void {
    this.isEditMode = true;
    this.selectedPedido = pedido;
    this.textoModal = "Editar pedido";
  
    this.pedidoForm.setValue({
      id: pedido.id,
      idCliente: pedido.cliente.id,
      total: pedido.total,
      fechaCreacion: pedido.fechaCreacion,
      estado: pedido.estado,// Asignar el ID de la aerolínea
    });
  
    this.showForm = true; // Mostrar el formulario
  }

  deletePedido(idPedido: number): void {
      Swal.fire({
        title: 'Eliminar pedido',
        text: '¿Estás seguro que deseas eliminar este pedido?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then((resp) => {
        if (resp.isConfirmed) {
          this.pedidoService.deletePedido(idPedido).subscribe({
            next: () => {
              this.pedidos = this.pedidos.filter(a => a.id !== idPedido);
              Swal.fire({
                title: 'Pedido eliminado',
                text: 'El Pedido se eliminó exitosamente',
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