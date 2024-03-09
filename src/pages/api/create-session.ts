// pages/api/create-session.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Define a type for the request body
type RequestBody = {
  sessionName: string;
  privateId: string;
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
    const { sessionName, privateId } = req.body as RequestBody;

    // Generate a unique string for session ID
    const uniqueSessionId = Math.random().toString(36).substring(2, 8);

    try {
      // Use Prisma to create a new session with an associated driver
      const session = await prisma.session.create({
        data: {
          sessionId: uniqueSessionId,
          name: sessionName,
          drivers: {
            create: [{
              privateId: privateId,
              status: 'Active' // Assuming a default status
              // Include other default fields if necessary
            }],
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
