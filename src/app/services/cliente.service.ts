import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cliente} from "../models/cliente.models";


@Injectable({
    providedIn: 'root'
})

export class ClienteService {
    private apiUrl: string = environment.apiUrl + 'clientes/'
    constructor(private http: HttpClient) {}

    getClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl);
    }

    creatCliente(cliente: Cliente): Observable<Cliente>{
        return this.http.post<Cliente>(this.apiUrl, cliente);
    }

    updateCliente(cliente: Cliente): Observable<Cliente>{
        return this.http.put<Cliente>(`${this.apiUrl}${cliente.id}`, cliente);
    }

    deleteCliente(idCliente: number): Observable<Cliente> {
        return this.http.delete<Cliente>(`${this.apiUrl}${idCliente}`);
    }
}