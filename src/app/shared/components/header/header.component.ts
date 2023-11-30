import { Component, Input, OnInit, inject } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() IsModal!: boolean;
  @Input() closeButton!: boolean;

  close= false;

  utilsSvc = inject(UtilsService)

  ngOnInit() {}

  dissmissModal() {
    this.utilsSvc.dismissModal();
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
}
