import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  zcScptlessSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const spmElement = form.querySelector('#zc_spmSubmit');
    if (spmElement) spmElement.remove();

    form.submit();
  }
}