import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

interface DriverData {
    Status: string;
    BestLap: number;
    BestLapTime: number;
    TopSpeed: number;
    // Add other fields as necessary
}
async function updateDriverInfo() {
    try {
        // Fetch all active sessions
        const activeSessions = await prisma.session.findMany({
            where: { isActive: true },
            include: { drivers: true }, // Ensure you include drivers in the result
        });

        for (const session of activeSessions) {
            for (const driver of session.drivers) {
                try {
                    const apiURL = `https://live.racerender.com/ViewData.php?ID=${driver.privateId}`;
                    const response = await fetch(apiURL);
                    if (!response.ok) throw new Error('Failed to fetch driver info');

                    const data = await response.json() as DriverData;

                    // Update driver information in the database
                    // Adjust according to your schema and the data you wish to update
                    await prisma.driver.update({
                        where: { id: driver.id },
                        data: {
                            status: data.Status === 'OK' ? 'Active' : 'Error', // Example status update
                            bestLap: Number(data.BestLap).toString(),
                            bestLapTime: data.BestLapTime.toString(),
                            topSpeed: data.TopSpeed,
                            // Add other fields as necessary
                        },
                    });
                } catch (error) {
                    console.error(`Error updating driver ${driver.id}:`, (error as Error).message);
                    // Update driver's status to 'error'
                    await prisma.driver.update({
                        where: { id: driver.id },
                        data: { status: 'Error' },
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error updating driver info:', (error as Error).message);
    }
}

// Run the update process
updateDriverInfo().then(() => {
    console.log('Driver info update process completed.');
    process.exit(0);
}).catch((error) => {
    console.error('Failed to update driver info:', error);
    process.exit(1);
});
