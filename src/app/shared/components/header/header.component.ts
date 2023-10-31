import { Component, Input, OnInit, inject } from '@angular/core';
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

  utilsSvc = inject(UtilsService)

  ngOnInit() {}

  dissmissModal() {
    this.utilsSvc.dismissModal();
  }

  
}
