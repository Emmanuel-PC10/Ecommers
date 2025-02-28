import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductoEdit } from "../models/productoEdit.model";
import { environment } from "../environments/environment";
import { Producto } from "../models/producto.model";


@Injectable({
    providedIn: 'root'
})

export class ProductoEditService {
    private apiUrl: string = environment.apiUrl + 'productos/'
    constructor(private http: HttpClient) {}

    getProductos(): Observable<ProductoEdit[]> {
        return this.http.get<ProductoEdit[]>(this.apiUrl);
    }

    creatProducto(producto: Producto): Observable<Producto>{
        return this.http.post<Producto>(this.apiUrl, producto);
    }

    updateProducto(producto: ProductoEdit): Observable<ProductoEdit>{
        return this.http.put<ProductoEdit>(`${this.apiUrl}${producto.idProducto}`, producto);
    }

    deleteProducto(id: number): Observable<Producto> {
        return this.http.delete<Producto>(`${this.apiUrl}${id}`);
    }
}