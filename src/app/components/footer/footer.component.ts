import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, FormsModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    emailValue: string = '';

    footerLinks = [
        { label: 'About', route: '/about' },
        // { label: 'Features', route: '/features' },
        // { label: 'FAQ', route: '/faq' },
        { label: 'Blog', route: '/blog' },
        { label: 'Terms', route: '/terms-conditions' }
    ];

    onSubscribe(): void {
    }
}
