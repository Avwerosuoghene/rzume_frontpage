import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Features } from '../../components/features/features';
import { Faq } from '../../components/faq/faq';
import { Blog } from '../../components/blog/blog';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, About, Features, Faq, Blog],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
