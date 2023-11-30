import { ReturnStatement } from '@angular/compiler';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,AlertOptions,LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController)
  toasCtrl = inject(ToastController)
  router = inject(Router)
  modalCtrl = inject(ModalController)
  alertCtrl = inject(AlertController)
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toasCtrl.create(
      opts
    );
    toast.present();
  }

  async presentAlert(opts?:AlertOptions ) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }
  // Enrutar paginas
  routerLink(url: string) {
    return this.router.navigateByUrl(url)
  }
  // Guardar en localstorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }
  // Obtener elementos de localstorage
  getFromLocalStorage(key: string): any {
    const item = localStorage.getItem(key);
  
    if (item !== null) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return null; // O un valor por defecto adecuado para tu aplicación
      }
    } else {
      return null; // O un valor por defecto adecuado para tu aplicación
    }
  }
  
  // Modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
