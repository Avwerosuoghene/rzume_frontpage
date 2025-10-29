import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { 
  HEADER_CONFIG,
  HeaderConfig
} from '../../core/models';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatButtonModule
  ],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent implements OnInit {
  headerConfig: HeaderConfig = HEADER_CONFIG;
  isHeaderDark: boolean = false;

  ngOnInit(): void {
    this.setActiveNavigation();
  }

  private setActiveNavigation(): void {
    this.headerConfig = {
      ...this.headerConfig,
      navigationItems: this.headerConfig.navigationItems.map(item => ({
        ...item,
        isActive: item.route === '/terms-conditions'
      }))
    };
  }
}
