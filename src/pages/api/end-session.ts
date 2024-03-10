// src/pages/api/end-session.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sessionId, driverId } = req.body; // Assuming you pass the session ID and driver ID

    // Retrieve the session to check the creator
    const session = await prisma.session.findUnique({
      where: {
        sessionId: sessionId,
      },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if the requesting driver is the session creator
    if (session.creatorId !== driverId) {
      return res.status(403).json({ message: 'Only the session creator can end the session' });
    }

    // End the session by setting isActive to false
    const updatedSession = await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({ message: 'Session ended successfully', updatedSession });
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
