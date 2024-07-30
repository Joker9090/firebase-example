// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import serviceAccount from "../../internal/noswar-firebase-adminsdk-t9ryi-13d93d58e0.json";

type Data = {
  scoreItems: any[]
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

  // Get All from Collection "score"

  // firestore.collection("score").get().then((querySnapshot) => {
  //   const scoreItems:any[] = [];
  //   querySnapshot.forEach((doc) => {
  //     scoreItems.push({...doc.data(), firebaseId : doc.id});
  //   });
  //   res.status(200).json({ scoreItems })
  // })

  // Get One from Colletion

  // firestore.collection("score").doc("122").get().then((doc) => {
  //   if (doc.exists) {
  //     res.status(200).json({ scoreItems: [doc.data()] })
  //   } else {
  //     res.status(200).json({ scoreItems: [] })
  //   }
  // })

  // Get one using doc path resolve
  // firestore.doc("score/122").get().then((doc) => {
  //   if (doc.exists) {
  //     res.status(200).json({ scoreItems: [doc.data()] })
  //   } else {
  //     res.status(200).json({ scoreItems: [] })
  //   }
  // })

  //Add or Update
  // firestore.collection("score").doc("133").set({ "game": "2", "user_id": "3", "value": "100" }).then((value) => {
  //   firestore.collection("score").doc("133").get().then((doc) => {
  //     if (doc.exists) {
  //       res.status(200).json({ scoreItems: [doc.data()] })
  //     } else {
  //       res.status(200).json({ scoreItems: [] })
  //     }
  //   })
  // })

  // delete
  firestore.collection("score").doc("133").delete().then((value) => {
    firestore.collection("score").get().then((querySnapshot) => {
    const scoreItems:any[] = [];
    querySnapshot.forEach((doc) => {
      scoreItems.push({...doc.data(), firebaseId : doc.id});
    });
    res.status(200).json({ scoreItems })
  })
  })
}
