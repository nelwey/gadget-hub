import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })

export class CartService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5000/api/cart';
  private cart: { productId: number, quantity: number }[] = [];

  private cartQuantitySource = new BehaviorSubject<number>(0);
  currentCartQuantity = this.cartQuantitySource.asObservable();

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // getCart(): Observable<{ productId: number; quantity: number }[]> {
  //   return this.http.get<{ productId: number; quantity: number }[]>(this.apiUrl);
  // }
  addToCart(productId: number, quantity: number, price: number): Observable<any> {
    const newCartItem = { productId, quantity };
    this.cart.push(newCartItem);

    let updatedQuantity = this.cartQuantitySource.value + 1;
    this.cartQuantitySource.next(updatedQuantity);
    console.log("addToCart totalCart: ", this.cart);
    return this.http.post(this.apiUrl, { productId, quantity, subtotal: price });
  }

  removeFromCart(productId: number): Observable<any> {
    this.cart = this.cart.filter(product => product.productId !== productId);
    this.updateCartQuantityTotal();
    return this.http.delete(`${this.apiUrl}/remove/${productId}`);
  }

  isProductInCart(productId: number): boolean {
    return this.cart.some(item => item.productId === productId);
  }

  updateProductQuantity(productId: number, quantity: number, action: string): Observable<any> {
    const product = this.cart.find(p => p.productId === productId);
    if (action === "increase") {
      product!.quantity++;
      this.updateCartQuantityTotal();
    } else {
      if (product && product.quantity > 0) {
        product!.quantity--;
      }
      this.updateCartQuantityTotal();
    }
    return this.http.put(`${this.apiUrl}/update/${productId}`, { quantity, action });
  }
  updateCartQuantityTotal(): void {
    let updatedQuantity = this.cartQuantitySource.value;
    updatedQuantity = this.cart.reduce((total, product) => total + product.quantity, 0);
    this.cartQuantitySource.next(updatedQuantity);
    console.log("totalCart: ", this.cart);
  }
  loadCart(): void {
    this.getCart().subscribe(cartItems => {
      this.cart = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
      this.updateCartQuantityTotal();
    });
  }
  clearCart(): void {
    this.cart = [];
    this.updateCartQuantityTotal();
  }
}
