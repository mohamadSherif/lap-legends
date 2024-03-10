// pages/api/create-session.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Define a type for the request body
type RequestBody = {
  sessionName: string;
  privateId: string;
  displayName: string;
};

// Define a type for the response data
type ResponseData = {
  id?: number; // Session ID is a number according to your Prisma schema
  sessionId?: string; // This is the unique session identifier
  name?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { sessionName, privateId, displayName } = req.body as RequestBody;

    // Generate a unique string for session ID
    const uniqueSessionId = Math.random().toString(36).substring(2, 8);

    try {

      // Check if a driver with the provided privateId exists
      let driver = await prisma.driver.findUnique({
        where: { privateId },
      });

      // If the driver does not exist, create a new driver record
      if (!driver) {
        driver = await prisma.driver.create({
          data: {
            privateId,
            displayName,
            status: 'Active',
          },
        });
      }

      // Create a new session with the provided sessionName and the driver's privateId
      const session = await prisma.session.create({
        data: {
          sessionId: uniqueSessionId,
          name: sessionName,
          isActive: true,
          creatorId: privateId,
          drivers: {
            connect: { privateId },
          },
        },
      });

      // Respond with the created session data
      res.status(201).json({
        id: session.id,
        sessionId: session.sessionId,
        name: session.name
      });
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ error: 'Unable to create session' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
