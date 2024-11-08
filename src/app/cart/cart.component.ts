import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  public cartItems: any[] = [];
  public selectedTab: string = 'cart';
  public selectedProduct: Product | null = null;

  public paymentMethods = [
    { value: 'value 2', label: 'value 1' },
    { value: 'value 1', label: 'value 2' },
  ];
  public selectedPaymentMethod: string = this.paymentMethods[0].value;

  public selectedTypeOrder: string = "Самовывоз";

  public showOrderModal:boolean = false;

  onChangePaymentMethod(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPaymentMethod = target.value;
  }

  openOrderModal() {
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
  }
  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log("cart: ", items);
      },
      error: (err) => console.error(err),
    });
  }
  get total() {
    let total = 0;
    this.cartItems.forEach((product) => {
      total += product.subtotal;
    })
    return total;
  }

  removeItem() {
    if (this.selectedProduct) {
      this.cartService.removeFromCart(this.selectedProduct.id).subscribe({
        next: (response) => {
          this.loadCart();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
    }
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
  isInCart(product: Product): boolean {
    return this.cartService.isProductInCart(product.id);
  }
  updateCartQuantity(product: Product, quantity: number, action: string) {
    this.cartService.updateProductQuantity(product.id, quantity, action).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (err) => console.error(err),
    });
  }
  public goToHome() {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog() {
    this.router.navigateByUrl('/catalog');
  }
  placeOrder() {
    this.openOrderModal();
  }
}
