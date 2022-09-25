import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {Product} from "../../model/product.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators as v} from "@angular/forms";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productId!: string
  product!: Product
  productFormGroup!: FormGroup
  constructor(private route:ActivatedRoute,
              public productService:ProductService,
              private fb: FormBuilder) {
    this.productId = this.route.snapshot.params['id']
  }

  ngOnInit(): void {
    this.getOneProduct();
    this.productFormGroup = this.fb.group({
      name: this.fb.control(this.product.name,[v.required, v.minLength(4)]),
      price: this.fb.control(this.product.price,[v.required,v.min(200)]),
      promotion: this.fb.control(this.product.promotion, [v.required]),
    })
  }

  private getOneProduct() {
    this.productService.getOneProduct(this.productId).subscribe({
      next: (data) => {
        this.product = data
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


  handleEditProduct() {
    let p = this.productFormGroup.value
    p.id = this.product.id
    this.productService.updateProduct(p).subscribe({
      next:(prod)=>{
        alert("Product updated!")
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
