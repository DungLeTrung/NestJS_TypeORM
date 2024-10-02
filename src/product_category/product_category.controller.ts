import { Controller } from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}
}
