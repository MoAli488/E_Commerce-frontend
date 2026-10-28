import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

export type InfoTab = 'about' | 'contact' | 'faq' | 'policies';

@Component({
  imports: [FormsModule],
  selector: 'app-info-page',
  styleUrl: './info-page.css',
  templateUrl: './info-page.html',
})
export class InfoPage implements OnInit {
  private _route = inject(ActivatedRoute);

  activeTab = signal<InfoTab>('about');
  contactSent = signal(false);

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const page = params['page'] as InfoTab;
      if (['about', 'contact', 'faq', 'policies'].includes(page)) {
        this.activeTab.set(page);
      }
    });

    this._route.queryParams.subscribe((queryParams) => {
      const tab = queryParams['tab'] as InfoTab;
      if (['about', 'contact', 'faq', 'policies'].includes(tab)) {
        this.activeTab.set(tab);
      }
    });
  }

  setTab(tab: InfoTab): void {
    this.activeTab.set(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitContact(): void {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) return;
    this.contactSent.set(true);
    setTimeout(() => {
      this.contactSent.set(false);
      this.contactForm = { name: '', email: '', subject: '', message: '' };
    }, 4000);
  }
}
