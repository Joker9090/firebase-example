// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import serviceAccount from "../../internal/noswar-firebase-adminsdk-t9ryi-13d93d58e0.json";
import memoryDataSingleton from "../../services/localMemoryData";

type Data = {
  scoreItems?: any[];
  error?: string;
};

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
  const userScore: {
    game: string;
    value: number;
  } = req.body;

    // get authorization token from header
    let token = req.headers.authorization;
    token = token?.replace("Bearer ", "");
  
    //check if token is valid
    let valid = memoryDataSingleton.checkToken(token ?? "");
    if (valid) {
      firestore.collection("users").doc(valid.user).collection("scores").doc(userScore.game)
        .set({
          value: userScore.value,
        })
        .then((value) => {
          console.log("SIGUE");
          firestore
            .collection("users")
            .doc(valid.user)
            .get()
            .then((doc) => {
              if (doc.exists) {
                res.status(200).json({ scoreItems: [doc.data()] });
              } else {
                res.status(200).json({ scoreItems: [] });
              }
            });
        });
    } else {
      res.status(500).json({ error: "Unauthorized" });
    }
}
