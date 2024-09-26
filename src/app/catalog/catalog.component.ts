import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

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
  styleUrl: './catalog.component.css',
})

export class CatalogComponent implements OnInit{
  public products: Product[] = []

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next:(products: Product[]) => {
        this.products = products;
      },
      error: (e) => {
        console.error('Error fetching products:', e);
      }
    });
  }
  minLimit: number = 200;
  maxLimit: number = 300000;
  minValue: number = 2990;
  maxValue: number = 167890;

  selectedProduct: any = null;

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
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
