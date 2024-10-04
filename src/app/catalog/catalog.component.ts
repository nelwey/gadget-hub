import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
  ],
  templateUrl: './catalog.component.html',
})

export class CatalogComponent implements OnInit {
  constructor(private cartService: CartService, private productService: ProductService, private router: Router) { }

  public cartProducts: any[] = [];
  public products: Product[] = [];
  public isCartEmpty: boolean = true;
  public selectedProduct: Product | null = null;
  public productQuantity: number = 1;
  public showModal: boolean = false;

  ngOnInit(): void {
    this.getProducts();
    this.loadCart();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (e) => {
        console.error('Error fetching products:', e);
      }
    });
  }
  loadCart(): void {
    this.cartService.getCart().subscribe((cartProducts) => {
      this.cartProducts = cartProducts;
    });
  }
  minLimit: number = 200;
  maxLimit: number = 300000;
  minValue: number = 2990;
  maxValue: number = 167890;

  public typeFilters: string[] = [
    "Смартфоны", "Фитнес браслеты", "Портативная акустика", "Очки виртуальной реальности", "Электротранспорт", "Умные часы"
  ];
  public colorFilters: string[] = [
    "Красный", "Оранжевый", "Желтый", "Зеленый", "Голубой", "Синий", "Фиолетовый"
  ];

  validateMinValue() {
    if (this.minValue < this.minLimit) {
      this.minValue = this.minLimit;
    }
    if (this.minValue >= this.maxValue) {
      this.minValue = this.maxValue - 1;
    }
  }

  validateMaxValue() {
    if (this.maxValue > this.maxLimit) {
      this.maxValue = this.maxLimit;
    }
    if (this.maxValue <= this.minValue) {
      this.maxValue = this.minValue + 1;
    }
  }

  updateMinValue() {
    this.validateMinValue();
  }

  updateMaxValue() {
    this.validateMaxValue();
  }

  calculatePercentage(value: number): number {
    return ((value - this.minLimit) / (this.maxLimit - this.minLimit)) * 100;
  }

  openModal(product: any) {
    this.showModal = true;
    this.selectedProduct = product;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }
  increaseQuantity(product: Product) {
    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, "increase");
    }
  }

  decreaseQuantity(product: Product) {
    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, "decrease");
    }
  }
  updateCartQuantity(product: Product, quantity: number, action: string) {
    this.cartService.updateProductQuantity(product.id, quantity, action).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (err) => console.error(err),
    });
  }
  addToCart(product?: Product) {
    this.selectedProduct = product ? product : this.selectedProduct;
    if (this.selectedProduct) {
      this.cartService.addToCart(this.selectedProduct.id, this.productQuantity, this.selectedProduct.price).subscribe({
        next: (response) => {
          this.ngOnInit();
        },
        error: (err) => console.error(err),
      });
    }
  }
  getQuantity(product: Product): string {
    const productIncart = this.cartProducts.find(item => item.id === product.id);
    return productIncart.quantity.toString();

  }
  isInCart(product: Product): boolean {
    const productIncart = this.cartProducts.find(item => item.id === product.id);
    if (productIncart) return true;
    return false;

  }
  public goToCart() {
    this.router.navigateByUrl('/cart');
  }
}

