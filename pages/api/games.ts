// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import serviceAccount from "../../internal/noswar-firebase-adminsdk-t9ryi-13d93d58e0.json";
import memoryDataSingleton from "../../services/localMemoryData";

type Games = {
  firebaseId: string;
  name: string;
};

type Data = {
  games?: Games[];
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

  // get authorization token from header
  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  //check if token is valid
  let valid = memoryDataSingleton.checkToken(token ?? "");
  if (valid) {
    firestore
      .collection("games")
      .get()
      .then((querySnapshot) => {
        const scoreItems: any[] = [];
        querySnapshot.forEach((doc) => {
          scoreItems.push({ ...doc.data(), firebaseId: doc.id });
        });
        res.status(200).json({ games: scoreItems });
      });
  } else {
    res.status(500).json({ error: "Unauthorized" });
  }
}
