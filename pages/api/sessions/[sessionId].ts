// pages/api/sessions/[sessionId].ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Handler for fetching session details by session ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if it's a GET request
  if (req.method === 'GET') {
    try {
      // Extract the session ID from the URL query parameters
      const { sessionId } = req.query;

      // Retrieve the session from the database
      const session = await prisma.session.findUnique({
        where: {
          sessionId: sessionId as string, // Cast to string to satisfy TypeScript
        },
        include: {
          drivers: true, // If you want to include related drivers
        },
      });

      // If no session is found, return a 404 response
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Send the session details as a response
      res.status(200).json(session);
    } catch (error) {
      // Handle any errors that occur during the database query
      console.error('Error fetching session details:', error);
      res.status(500).json({ error: 'Error fetching session details' });
    }
  } else {
    // If the request method is not GET, return a 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
