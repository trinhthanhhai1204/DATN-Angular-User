import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {IndexLastedProductsComponent} from "../index-lasted-products/index-lasted-products.component";
import {IndexSliderComponent} from "../index-slider/index-slider.component";
import {IndexFeaturedBooksComponent} from "../index-featured-books/index-featured-books.component";
import {BookComponent} from "../../../components/book/book.component";
import {IndexFeaturedCategoriesComponent} from "../index-featured-categories/index-featured-categories.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    BookComponent,
    NgForOf,
    IndexLastedProductsComponent,
    IndexSliderComponent,
    IndexFeaturedBooksComponent,
    IndexFeaturedCategoriesComponent
  ],
  templateUrl: './index.component.html',
  styles: []
})
export class IndexComponent {

}
