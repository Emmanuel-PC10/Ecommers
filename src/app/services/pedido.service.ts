import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pedido } from "../models/pedido.models";


@Injectable({
    providedIn: 'root'
})

export class PedidoService {
    private apiUrl: string = environment.apiUrl + 'pedidosproductos'
    constructor(private http: HttpClient) {}

    getPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }

    creatPedido(pedido: Pedido): Observable<Pedido>{
        return this.http.post<Pedido>(this.apiUrl + '/pedido-dto', pedido);
    }

    updateVuelo(pedido: Pedido): Observable<Pedido>{
        return this.http.put<Pedido>(`${this.apiUrl}${pedido.id}`, pedido);
    }

    deletePedido(idPedido: number): Observable<Pedido> {
        return this.http.delete<Pedido>(`${this.apiUrl}${idPedido}`);
    }
}