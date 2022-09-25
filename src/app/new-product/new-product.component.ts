import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators as v} from "@angular/forms";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  productFormGroup! : FormGroup
  constructor(private fb: FormBuilder,
              private productService: ProductService
              ) { }

  ngOnInit(): void {
    this.productFormGroup = this.fb.group({
      name: this.fb.control(null,[v.required, v.minLength(4)]),
      price: this.fb.control(0,[v.required,v.min(200)]),
      promotion: this.fb.control(false, [v.required]),
    })
  }


  handleAddProduct() {
    let product= this.productFormGroup.value
    this.productService.addNewProduct(product).subscribe({
      next:(data)=>{
          alert("Product added successfully!")
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


  getErrorMessage(field: string, errors: ValidationErrors):string {
    if(errors['required']) return field + " is required"
    else if(errors['minlength']) return field + " should have at least " +
      errors['minlength']['requiredLength'] + " Characters"
    else if(errors['min']) return field + " should have at least " + errors['min']['min'] + " $"
    return ""


  }
}
