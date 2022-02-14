import { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { handleErrors } from "@/lib/middleware";
import { check, validate } from "@/lib/validator";

import models from "@/models";
import getCollections from "@/models";

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;

    const { Introduction, Review } = await getCollections();

    if (req.method === "POST") {
      await validate([check(req.body.rating).isNumeric()]);
      const user = await getCurrentUser(req, res);
      const jobs = await Introduction.details(new ObjectId(req.body.jobId));
      let job;
      if (jobs.length > 0) job = jobs[0];
      // console.log('job:', job);
      const business = job.business._id;
      const guru = job.guru._id;
      let rate = parseInt(req.body.rating);
      if (rate < 0) rate = 0;
      if (rate > 5) rate = 5;
      const payload = {
        business: business,
        guru: guru,
        comment: req.body.comment,
        rate: rate,
        jobId: job._id,
      };
      result = await Review.create(payload);
    } else {
      res.setHeader("Allow", "POST");
      return res.status(405).send({ message: "Method Not Allowed" });
    }
    res.status(200).json(result);
  }
);
