import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule, NewsletterComponent],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    footerLinks = [
        { label: 'About', route: '/about' },
        // { label: 'Features', route: '/features' },
        // { label: 'FAQ', route: '/faq' },
        { label: 'Blog', route: '/blog' },
        { label: 'Terms', route: '/terms-conditions' }
    ];
}
