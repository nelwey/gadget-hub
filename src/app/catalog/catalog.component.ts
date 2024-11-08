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
import { Filter } from './interfaces/filters';
import { Color } from './interfaces/colors';

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

  public itemsPerPage: number = 9;
  public currentPage: number = 1;
  public paginatedProducts: Product[] = [];
  public showPrevButton: boolean = false;

  public selectedColors: string[] = [];
  public filteredProducts: Product[] = [];

  public selectedTypes: string[] = [];

  ngOnInit(): void {
    this.getProducts();
    this.loadCart();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...products]; // Display all products initially
        this.updatePaginatedProducts();
      },
      error: (e) => console.error('Error fetching products:', e),
    });
  }


  filterByType(): void {
    if (this.selectedTypes.length) {
      this.filteredProducts = this.products.filter(product =>
        product.category && this.selectedTypes.includes(product.category)
      );
    } else {
      // Show all products if no type is selected
      this.filteredProducts = [...this.products];
    }
    this.currentPage = 1; // Reset to the first page when applying a new filter
    this.updatePaginatedProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesColor = !this.selectedColors.length || (product.color && this.selectedColors.includes(product.color));
      const matchesType = !this.selectedTypes.length || (product.category && this.selectedTypes.includes(product.category));
      return matchesColor && matchesType;
    });
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePaginatedProducts();
  }

  toggleColorSelection(color: string): void {
    if (this.selectedColors.includes(color)) {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    } else {
      this.selectedColors.push(color);
    }
    this.filterProducts();
  }

  toggleTypeSelection(type: string): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
    this.filterProducts();
  }



  // toggleColor(colorValue: string): void {
  //   if (this.selectedColors.includes(colorValue)) {
  //     this.selectedColors = this.selectedColors.filter(color => color !== colorValue);
  //   } else {
  //     this.selectedColors.push(colorValue);
  //   }
  //   this.filterByColor();
  // }

  // filterByColor(): void {
  //   if (this.selectedColors.length) {
  //     this.filteredProducts = this.products.filter(product =>
  //       product.color && this.selectedColors.includes(product.color)
  //     );
  //   } else {
  //     // Show all products if no color is selected
  //     this.filteredProducts = [...this.products];
  //   }
  //   this.currentPage = 1; // Reset to first page when applying a new filter
  //   this.updatePaginatedProducts();
  // }



  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
    this.showPrevButton = this.currentPage > 1;
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredProducts.length) {
      this.currentPage++;
      this.updatePaginatedProducts();
      this.showPrevButton = true;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
      this.showPrevButton = this.currentPage > 1;
    }
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

  public typeFilters: Filter[] = [
    { type: "Смартфоны", value: 'Smartphones' },
    { type: "Портативная акустика", value: 'PortableAcoustics' },
    { type: "Очки виртуальной реальности", value: 'VirtualRealityGlasses' },
    { type: "Умные часы", value: 'SmartWatches' },
    { type: "Другое", value: 'Other' },
    { type: "Внешний Аккумулятор", value: 'ExternalBattery' },
    { type: "Наушники", value: 'Headphones' },
  ];
  public colorFilters: Color[] = [
    { color: "Красный", value: 'red' },
    { color: "Желтый", value: 'yellow' },
    { color: "Белый", value: 'white' },
    { color: "Зеленый", value: 'green' },
    { color: "Голубой", value: 'lightblue' },
    { color: "Синий", value: 'blue' },
    { color: "Фиолетовый", value: 'purple' },
    { color: "Розовый", value: 'pink' },
    { color: "Чёрный", value: 'black' }
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

