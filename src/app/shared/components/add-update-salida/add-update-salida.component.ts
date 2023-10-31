import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-salida',
  templateUrl: './add-update-salida.component.html',
  styleUrls: ['./add-update-salida.component.scss'],
})
export class AddUpdateSalidaComponent implements OnInit {


  form = new FormGroup({
    id: new FormControl(''),
    destino: new FormControl('', [Validators.required, Validators.minLength(4)]),
    hora: new FormControl('', [Validators.required]),
    pasajero: new FormControl('', [Validators.required, Validators.min(0)]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  async submit() {
    if (this.form.valid) {
      let path = 'users/${this.user.uid}/salida'

      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.id

      this.firebaseSvc.addDocumento(path, this.form.value).then(async res => {
        this.utilsSvc.dismissModal({ success: true })

        this.utilsSvc.presentToast({
          message: "Salida agregada correctamente",
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }



}
