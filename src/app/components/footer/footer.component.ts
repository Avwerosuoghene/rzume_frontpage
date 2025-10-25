import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerLinks = [
    { label: 'About', route: '/about' },
    { label: 'Blog', route: '/blog' },
    { label: 'Contact', route: '/contact' },
    { label: 'Privacy', route: '/privacy' }
  ];
}
