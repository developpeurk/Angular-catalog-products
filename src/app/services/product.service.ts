import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../model/product.model";
import { UUID  as uuid} from 'angular2-uuid';
import { faker } from '@faker-js/faker';
import {ValidationErrors} from "@angular/forms";



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products! : Product[]

  constructor() {
    this.products= [
      {id:uuid.UUID(), name:"Computer", price: 6500, promotion: true},
      {id:uuid.UUID(), name:"Printer", price: 1200, promotion: true},
      {id:uuid.UUID(), name:"Smart phone", price: 1400, promotion: false},
    ];
    for (let i = 0; i < 100; i++) {
      this.products.push({id: uuid.UUID(), name:  faker.commerce.product(), price: faker.datatype.float({ min: 1000, max: 9000, precision: 0.01 }), promotion: faker.datatype.boolean()})
    }
  }

  public getAllProducts():Observable<Product[]>{
    let rnd = Math.random();
    if(rnd<0.1) return throwError(()=>new Error("Internet connexion error"))
    else return of([...this.products]);
  }

  public getPageProduct(page: number, size: number):Observable<PageProduct>{
    return this.calculTotalPages(page, size, this.products);

  }

  private calculTotalPages(page: number, size: number, other: any) {
    let index = page * size;
    let totalPages = ~~(other.length / size)
    if (this.products.length % size != 0) {
      totalPages += 1;
    }
    let pageProduct = other.slice(index, index + size);
    return of({
      page: page,
      size: size,
      totalPages: totalPages,
      products: pageProduct
    });
  }

  public deleteProduct(id : string): Observable<boolean>{
      this.products = this.products.filter(p => p.id != id);
      return of(true);
  }

  public setPromotion(id: string): Observable<Boolean>{
    let product = this.products.find(p=>p.id == id);
    if(product!= undefined){
      product.promotion = !product.promotion
      return of(true)
    }else return throwError(()=> new Error("Product not found"));

  }

  //public searchProduct(keyword:string): Observable<Product[]>{
  public searchProduct(keyword:string, page: number, size: number): Observable<PageProduct>{
    let result = this.products.filter(p=>p.name.includes(keyword));
    return this.calculTotalPages(page, size, result);

  }

  public addNewProduct(product: Product):Observable<Product>{
    product.id = uuid.UUID()
    this.products.push(product)
    return of(product)
  }

  public getOneProduct(id:string):Observable<Product>{
    let product= this.products.find(p => p.id == id)
    if(!product) return throwError(()=> new Error("Product not found"))
    return of(product)
  }


  public updateProduct(product:Product):Observable<Product>{
    this.products  = this.products.map(p=>(p.id==product.id)?product:p)
    return of(product)
  }

  getErrorMessage(field: string, errors: ValidationErrors):string {
    if(errors['required']) return field + " is required"
    else if(errors['minlength']) return field + " should have at least " +
      errors['minlength']['requiredLength'] + " Characters"
    else if(errors['min']) return field + " should have at least " + errors['min']['min'] + " $"
    return ""
  }


}
