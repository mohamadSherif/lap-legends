// pages/api/leaderboard/[sessionId].ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { sessionId } = req.query;

    try {
      // Fetch the session with the given ID, including driver details
      const session = await prisma.session.findUnique({
        where: { sessionId: sessionId as string },
        include: {
          drivers: {
            select: {
              displayName: true,
              bestLap: true,
              bestLapTime: true,
              topSpeed: true,
            },
            orderBy: {
              bestLapTime: 'asc', // Order by best lap time in ascending order
            },
          },
        },
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Respond with the leaderboard information
      res.status(200).json(session.drivers);
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ error: 'Unable to fetch leaderboard information' });
    }
  } else {
    // Handle any non-GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
