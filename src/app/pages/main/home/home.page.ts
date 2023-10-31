import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Salida } from 'src/app/model/salida.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateSalidaComponent } from 'src/app/shared/components/add-update-salida/add-update-salida.component';

@Component({
  selector: 'app-home/:usu',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuario = "";
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products: Salida[] = [];

  ngOnInit() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');
    let usu = user1.email;
    this.usuario = usu;
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProductos();
  }
  // Obtener Productos
  getProductos() {
    let path = 'users/${this.user().uid}/salida'
    let sub = this.firebaseSvc.getColectionData(path).subscribe({
      next:(res: any) =>{
        console.log(res)
        
        sub.unsubscribe();
      }
    })
  }

  // Ingresar o actualizar salida
  addUpdateSalidar() {
    this.utilsSvc.presentModal({
      component: AddUpdateSalidaComponent,
      cssClass: 'add-update-modal'
    })
  }
}
