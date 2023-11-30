import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { User } from '../model/user.model';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
  Firestore,
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  //------------ Autentificar----------
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //------------ Crear nuevo usuario ----------
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //------------  ----------
  getAuth() {
    return getAuth();
  }

  //------------ Actualizar usuario ----------
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //------------ Recuperar contraseña  ----------
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //------------ Serrar sesion----------
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
  //------------ BASE DE DATOS----------

  // Obtener documentos de coleccion
  getColectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }
  // Setear un documetno
  setDocumento(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Obtener un documetno
  async getDocumento(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Agregar un documetno
  addDocumento(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // Update Salida
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
  // Delete Salida
  deleteDocument(path: string) {
    //return deleteDoc(doc(getFirestore(), path))
    const firestore: Firestore = getFirestore(); // Obtén la instancia de Firestore

    const documentRef = doc(firestore, path); // Crea una referencia al documento que deseas eliminar

    return deleteDoc(documentRef); // Elimina el documento y devuelve una promesa
  }
}
