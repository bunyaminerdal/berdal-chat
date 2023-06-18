import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room | Room[]>
) {
  if (req.method === "GET") {
    const { rooms } = req.body;
    const roomList = await (
      await prisma.room.findMany()
    ).find((room) => rooms.includes(room.id));
    if (roomList) res.status(200).json(roomList);
  }
  if (req.method === "POST") {
    const newRoom = await prisma.room.create({
      data: req.body,
    });
    res.status(200).json(newRoom);
  }
  return;
}
