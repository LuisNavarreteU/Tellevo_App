import { Component, Input, OnInit, inject } from '@angular/core';
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
  esPasajero: boolean = false; // Variable para verificar si el usuario es pasajero
  esConductor: boolean = false;

  usuario = '';
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products: Salida[] = [];

  ngOnInit() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');
    let usu = user1.name;
    this.usuario = usu;
    
    if (user1.role == 'Conductor') this.esConductor = true;
    else this.esPasajero = true;
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');
    let usu = user1.name;
    this.usuario = usu;
    this.getProductos();
  }

  // Obtener Productos
  getProductos() {
    let path = 'salida';
    let user = this.utilsSvc.getFromLocalStorage('user');
    console.log(user)
    this.firebaseSvc.getColectionData(path).subscribe({
      next: (res: any[]) => {
        if (user.role === 'Conductor') {
          console.log(user.uid)
          this.products = res.filter((p) => p.usuario === user.uid);
        } else {
          this.products = res;
        }
      },
      error: (err) => {
        // Manejar errores si es necesario
      },
    });
  }

  // Ingresar o actualizar salida
  async addUpdateSalidar(salida?: Salida) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateSalidaComponent,
      cssClass: 'add-update-modal',
      componentProps: { salida },
    });

    if (success) this.getProductos();
  }

  async deleteSalida(salida: Salida) {
    let path = `salida/${salida.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      this.firebaseSvc.deleteDocument(path).then(async (res) => {
        this.products = this.products.filter((p) => p.id !== salida.id);

        this.utilsSvc.presentToast({
          message: 'Salida Eliminada',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      });
    } catch (error) {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  async ConfirmarEliminar(products: Salida) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Salida!',
      message: '¿Quiere eliminar la salida?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteSalida(products);
          },
        },
      ],
    });
  }

  // Ocupa un lugar
  async pasajeroSalidar(salida?: Salida) {
    salida.capacidad = salida.capacidad - 1;

    let path = `salida/${salida.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete salida.id;

    try {
      await this.firebaseSvc.updateDocument(path, salida);
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Solicitud aceptada',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }
}
