// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message[] | Message>
) {
  if (req.method === "GET") {
    const { roomId } = req.query;
    if (!roomId) return;
    const message = await prisma.message.findMany({
      where: { roomId: roomId.toString() },
    });
    res.status(200).json(message);
  }
  return;
}
