import { FormatWidth } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]), 
    role: new FormControl('',[Validators.required]),  
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async submit1() {
    if(this.form.valid) {
      const loading = await  this.utilsSvc.loading();
      await loading.present();
      
      this.firebaseSvc.signUp(this.form.value as User).then(async res =>{
      await this.firebaseSvc.updateUser(this.form.value.name);
      
      let uid = res.user.uid;
      this.form.controls.uid.setValue(uid);
      
      this.setUserInfo1(uid);
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

  async setUserInfo1(uid: string) {
    if(this.form.valid) {
      const loading = await  this.utilsSvc.loading();
      await loading.present();
      
      let path = `users/${uid}`;
      
      this.firebaseSvc.setDocumento(path, this.form.value).then(async res =>{
      this.utilsSvc.saveInLocalStorage('user', this.form.value)
        this.utilsSvc.routerLink('/main/home');
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

  async setUserInfo(uid: string) {
    if(this.form.valid) {
      const loading = await  this.utilsSvc.loading();
      await loading.present();
      
      let path ='users/${uid}';
      
      this.firebaseSvc.setDocumento(path, this.form.value).then(async res =>{
      this.utilsSvc.saveInLocalStorage('user', this.form.value)
      this.utilsSvc.routerLink('/main/home');
      
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
