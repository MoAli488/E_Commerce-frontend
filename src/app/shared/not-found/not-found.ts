import { Component } from '@angular/core';
import { Header } from '../../layout/shared/header/header';

@Component({
  imports: [Header],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}
