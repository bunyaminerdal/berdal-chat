// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sender | { message: string } | null>
) {
  const { senderId } = req.query;
  if (req.method === "PATCH") {
    if (!senderId) return;
    try {
      const { contactNames, newContactName, rooms, senderName } = req.body;
      if (!senderName && !newContactName) return;
      const createdRoom = await prisma.room.create({
        data: {
          senders: [senderName?.toString(), newContactName?.toString()],
          name: senderName + "-" + newContactName?.toString(),
        },
      });
      const updatedSender = await prisma.sender.update({
        where: { id: senderId.toString() },
        data: {
          contacts: contactNames,
          rooms: rooms?.length ? [...rooms, createdRoom.id] : [createdRoom.id],
        },
      });

      res.status(200).json(updatedSender);
    } catch (error) {
      const saf = error as AxiosError;
      res.status(422).json({ message: saf.message });
    }
    return;
  }
  if (req.method === "GET") {
    try {
      const sender = await prisma.sender.findUniqueOrThrow({
        where: { id: senderId?.toString() },
      });
      return res.status(200).json(sender);
    } catch (error) {
      const saf = error as AxiosError;
      return res.status(404).json({ message: saf.message });
    }
  }
}
