import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { getFirebaseInstance } from './config';

export async function callCloudFunction<TReq = unknown, TRes = unknown>(
  name: string,
  data?: TReq
): Promise<TRes> {
  const { functions } = getFirebaseInstance();
  const callable = httpsCallable<TReq, TRes>(functions, name);
  const result: HttpsCallableResult<TRes> = await callable(data);
  return result.data;
}
