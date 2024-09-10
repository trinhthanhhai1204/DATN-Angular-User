import {Component, OnInit} from '@angular/core';
import {CategoryComponent} from "../../../components/category/category.component";
import {CategoryService} from "../../../services/category.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-index-featured-categories',
  standalone: true,
  imports: [CategoryComponent, NgForOf],
  templateUrl: './index-featured-categories.component.html',
  styles: []
})
export class IndexFeaturedCategoriesComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getFeaturedCategories().subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }
}
