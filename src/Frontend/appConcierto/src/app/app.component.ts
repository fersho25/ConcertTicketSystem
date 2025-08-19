import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  constructor(
    private translate: TranslateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}

