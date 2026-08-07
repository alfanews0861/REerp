import { ref, uploadBytes, getDownloadURL, deleteObject, StorageReference } from 'firebase/storage';
import { getFirebaseInstance } from './config';

export function getStorageRef(path: string): StorageReference {
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
