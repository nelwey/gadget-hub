import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent {

  public products: any[] = [
    { status: "Хит", src: "/assets/images/image8.png", price: 102099, description: "Смартфон 256 ГБ розовый", rating: "5" },
    { status: "Новинка", src: "/assets/images/image5.png", price: 27990, description: "Умный робот-друг", rating: "" },
    { status: "Новинка", src: "/assets/images/image6.png", price: 2000, description: "Часы с GPS трекером, розовый", rating: "4,8" },

    { status: "Новинка", src: "/assets/images/image4.png", price: 15199, description: "Смарт-часы, черные", rating: "4" },
    { status: "Новинка", src: "/assets/images/image9.png", price: 43999, description: "Смартфон 256 ГБ розовый", rating: "4,2" },
    { status: "Хит", src: "/assets/images/image60.png", price: 4990, description: "Беспроводная акустика, голубой", rating: "4,8" },

    { status: "Хит", src: "/assets/images/image2.png", price: 10590, description: "Аппаратный ключ аутентификации...", rating: "5" },
    { status: "Хит", src: "/assets/images/image1.png", price: 49990, description: "Шлем виртуальной реальности 128...", rating: "4,8" },
    { status: "", src: "/assets/images/image10.png", price: 2299, description: "Фитнес-браслет, розовый", rating: "" },
  ]
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
  // Validates and updates the minimum value
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
}
