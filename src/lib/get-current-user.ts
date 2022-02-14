import { ObjectId } from "bson";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { HttpError } from "./error";

export default async function getCurrentUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const email = session?.user?.email || "";
  const _id = session?.user?._id || "";
  if (!session || !email || !_id) {
    throw new HttpError(401);
  }
  return { _id: new ObjectId(_id), email };
}
