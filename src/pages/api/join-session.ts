// src/pages/api/join-session.ts
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch'; // Make sure you have 'node-fetch' installed
import type { NextApiRequest, NextApiResponse } from 'next';

interface IData {
   Status: string;
   UserOnline: number;
   BestLap: number;
   BestLapTime: number;
   TopSpeed: number;
   LapAccuracy: number;
   PredictLapTime: number;
   User: [];
   Ext: [];
   Map: [];
}
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sessionId, privateId } = req.body;

    // Replace <private-id> with the actual privateId and ensure the URL is correct
    const apiURL = `https://live.racerender.com/ViewData.php?ID=${encodeURIComponent(privateId)}`;

    try {
      // Fetch the status from the external API
      const response = await fetch(apiURL);

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const responseText = await response.text();
      const fixedText = responseText.replace(/"Color":\s*0x([0-9A-Fa-f]+)/g, '"Color": "0x$1"');

      const data = JSON.parse(fixedText) as IData;

      // Check if the driver's status is 'OK' and the user is online
      if (data.Status === 'OK') {
        // Logic to add the driver to the session
        const session = await prisma.session.findUnique({
          where: { sessionId },
          include: { drivers: true },
        });

        if (!session) {
          return res.status(404).json({ message: 'Session not found' });
        } else if (!session.isActive) {
          return res.status(400).json({ message: 'Session is not active' });
        }

        // Check if the driver already exists in this session
        let driver = await prisma.driver.findUnique({
          where: {
            privateId,
          },
        });

        // If driver does not exist, create new driver record
        if (!driver) {
          driver = await prisma.driver.create({
            data: {
              privateId,
              displayName: 'Unknown', // Placeholder, replace with actual data if available
              bestLap: data.BestLap.toString(),
              bestLapTime: data.BestLapTime.toString(),
              topSpeed: data.TopSpeed,
              status: 'OK',
              sessions: {
                connect: {
                  id: session.id,
                },
              },
            },
          });
        } else {
          // If driver exists, update their record with the new data
          await prisma.driver.update({
            where: {
              id: driver.id,
            },
            data: {
              bestLap: data.BestLap.toString(),
              bestLapTime: data.BestLapTime.toString(),
              topSpeed: data.TopSpeed,
              status: 'OK',
            },
          });
        }

        // Add the driver to the session
        await prisma.session.update({
          where: {
            id: session.id,
          },
          data: {
            drivers: {
              connect: {
                privateId,
              },
            },
          },
        });

        // Send back a success response with a list of drivers in the session
        res.status(200).json({ message: 'Driver added to session successfully', session });
      } else {
        // If the driver's status is not 'OK' or user is not online, return an error message
        res.status(400).json({ message: 'Driver is offline or not available to join the session' });
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      res.status(500).json({ message: 'An error occurred while checking driver status', error: (error as Error).message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
