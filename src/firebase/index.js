import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import moment from 'moment';

import { firebaseConfig } from './config';

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.storage = firebase.storage();
    this.db = firebase.firestore();
  }

  async register(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    this.auth.signOut();
  }

  async verifyAuth() {
    return new Promise((resolve) => this.auth.onAuthStateChanged(resolve));
  }

  async fetchCollection(collection) {
    const result = await this.db.collection(collection).get();
    return result.docs.map((document) => {
      return {
        id: document.id,
        ...document.data(),
      };
    });
  }

  async deleteDocument(collection, documentId) {
    await this.db.collection(collection).doc(documentId).delete();
    return true;
  }

  async fetchDocumentById(collection, documentId) {
    const result = await this.db.collection(collection).doc(documentId).get();
    return {
      id: documentId,
      ...result.data(),
    };
  }

  async createDocument(collection, data) {
    this.db.collection(collection).add(data);
  }

  async updateDocumentById(collection, documentId, data) {
    this.db.collection(collection).doc(documentId).update(data);
  }

  async uploadFile(file) {
    const storageRef = this.storage.ref();
    const fileName = moment().unix() + '-' + file.name;
    const fileRef = storageRef.child(fileName);
    await fileRef.put(file);
    const imageUrl = await fileRef.getDownloadURL();

    return {
      imageUrl,
      fileName,
    };
  }

  async removeFileByUrl(fileUrl) {
    const fileRef = this.storage.refFromURL(fileUrl);
    await fileRef.delete();
  }
}

const firebaseApp = new Firebase();

export default firebaseApp;
