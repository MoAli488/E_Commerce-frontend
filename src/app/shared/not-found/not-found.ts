import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/shared/header/header';

@Component({
  imports: [Header, RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}
