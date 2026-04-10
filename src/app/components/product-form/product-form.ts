import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  productId = signal<number | null>(null);

  product: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.productService.getById(+id).subscribe({
        next: (data) => (this.product = data),
        error: (err) => console.error('Error al cargar producto', err),
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      this.productService.update(this.productId()!, this.product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error al actualizar producto', err),
      });
    } else {
      this.productService.create(this.product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error al crear producto', err),
      });
    }
  }
}
