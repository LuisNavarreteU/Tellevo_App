import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Salida } from 'src/app/model/salida.model';
import { User } from 'src/app/model/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-salida',
  templateUrl: './add-update-salida.component.html',
  styleUrls: ['./add-update-salida.component.scss'],
})
export class AddUpdateSalidaComponent implements OnInit {
  @Input() salida: Salida;

  form = new FormGroup({
    id: new FormControl(''),
    destino: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    hora: new FormControl('', [Validators.required]),
    capacidad: new FormControl(null, [Validators.required, Validators.min(0)]),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    usuario: new FormControl(null, [Validators.min(1)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.salida) this.form.setValue(this.salida);
  }

  submit() {
    if (this.form.valid) {
      if (this.salida) this.updateSalida();
      else this.crearSalida();
    }
  }

  async crearSalida() {
    const path = 'salida'; // Ajusta la ruta según la estructura de tu base de datos

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.form.value.usuario = this.user.uid;
    delete this.form.value.id;

    try {
      await this.firebaseSvc.addDocumento(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Salida agregada correctamente',
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

  async updateSalida() {
    let path = `salida/${this.salida.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    try {
      await this.firebaseSvc.updateDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Salida actualizada correctamente',
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
