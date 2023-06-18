import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room | Room[]>
) {
  if (req.method === "GET") {
    const { senderName } = req.query;
    const roomList = await prisma.room.findMany({
      where: { senders: { has: senderName?.toString() } },
    });
    if (roomList) res.status(200).json(roomList);
  }
  return;
}
