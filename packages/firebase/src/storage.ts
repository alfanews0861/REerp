import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseInstance } from './config';

export function getStorageRef(path: string): any {
  const { storage } = getFirebaseInstance();
  return ref(storage, path);
}

export async function uploadFile(path: string, file: Blob | File): Promise<string> {
  const fileRef = getStorageRef(path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function removeFile(path: string): Promise<void> {
  const fileRef = getStorageRef(path);
  await deleteObject(fileRef);
}
