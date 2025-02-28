
  export interface Cliente{
    id: number;
    nombre: string;
  }
  
  export interface Pedido {
    id: number | null;
    cliente: Cliente;
    total: number;
    fechaCreacion: string,
    estado: number;
  }