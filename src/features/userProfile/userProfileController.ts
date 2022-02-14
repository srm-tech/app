import { NextApiRequest, NextApiResponse } from "next";

import getCurrentUser from "@/lib/get-current-user";
import { handleErrors } from "@/lib/middleware";
import { check, validate } from "@/lib/validator";

import getCollections from "@/models";

import { defaultProfile, UserProfile } from "./constants";

type DefaultProfileKeys = keyof typeof defaultProfile;
const getCheckByKey = (v: DefaultProfileKeys) => check(v);

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const user = await getCurrentUser(req, res);
    const { UserProfile } = await getCollections();
    if (req.method === "GET") {
      result = await UserProfile.getOne(user._id);
    } else if (req.method === "PUT" || req.method === "POST") {
      const profile: UserProfile = req.body;
      await validate([
        getCheckByKey("contactEmail").isEmail(),
        getCheckByKey("lastName").isLength({
          min: 1,
          max: 55,
        }),
        getCheckByKey("firstName").isLength({
          min: 1,
          max: 55,
        }),
        getCheckByKey("contactPhone").optional().isLength({
          min: 0,
          max: 55,
        }),
        getCheckByKey("businessName").optional().isLength({ min: 0, max: 255 }),
        getCheckByKey("isAcceptingIntroductions").optional().isBoolean(),
      ])(req, res);
      if (profile.isAcceptingIntroductions) {
        await validate([
          getCheckByKey("businessName").isLength({ min: 1, max: 255 }),
          getCheckByKey("businessCategory").isLength({ min: 1, max: 255 }),
          getCheckByKey("address1").isLength({ min: 1, max: 255 }),
          getCheckByKey("address2").optional().isLength({ min: 0, max: 255 }),
          getCheckByKey("commissionPerReceivedLead").optional().isNumeric(),
          getCheckByKey("commissionPerCompletedLead").optional().isNumeric(),
          getCheckByKey("commissionPerReceivedLeadPercent")
            .optional()
            .isNumeric(),
          getCheckByKey("commissionType").optional().isString(),
          getCheckByKey("abn")
            .optional({ checkFalsy: true })
            .isLength({ min: 11, max: 11 }),
          getCheckByKey("country").isLength({ min: 2, max: 2 }),
        ])(req, res);
        if (req.body.commissionType) {
          req.body.isBusiness = true;
          req.body.commissionValue = req.body[req.body.commissionType];
        }
      }
      if (req.method === "POST") {
        result = {
          ...(await UserProfile.create(user._id, {
            ...profile,
            isActive: true,
          })),
          contactEmail: user.email,
        };
      } else {
        result = await UserProfile.updateOne({
          ...profile,
          isComplete: true,
        });
      }
    } else {
      res.setHeader("Allow", "GET, POST, PUT");
      return res.status(405).send({ message: "Method Not Allowed" });
    }
    res.status(200).json(result);
  }
);
