import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sender>
) {
  if (req.method === "POST") {
    const { name } = req.body;
    const sender = await prisma.sender.findFirst({
      where: { name },
    });
    if (sender) return res.status(200).json(sender);

    const newSender = await prisma.sender.create({
      data: req.body,
    });
    return res.status(200).json(newSender);
  }
}
