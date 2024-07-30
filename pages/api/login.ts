// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import serviceAccount from "../../internal/noswar-firebase-adminsdk-t9ryi-13d93d58e0.json";
import { User } from "firebase/auth";
import { randomUUID } from 'crypto';
import memoryDataSingleton from '../../services/localMemoryData';

type Data = {
  token?: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let adminApp = admin.apps[0];
  if (!adminApp) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
  const firestore = getFirestore(adminApp);

  const user: User = req.body;
  
  // Add or Update
   firestore.collection("users").doc(user.uid).set(user).then((value) => {
     firestore.collection("users").doc(user.uid).get().then((doc) => {
       if (doc.exists) {
         const token = memoryDataSingleton.createToken(user.uid);
         res.status(200).json({ token: token.token })
       } else {
         res.status(200).json({ token: undefined })
       }
     })
   })

}
