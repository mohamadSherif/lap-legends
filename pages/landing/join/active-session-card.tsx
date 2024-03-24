"use client";

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function ActiveSessionCard() {
    const [isSessionExist, setIsJoining] = useState(true); 

    const toggleSessionMode = () => {
        setIsJoining(!isSessionExist);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Session</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <p className="col-span-4">Session Name: <span className="font-bold">Session 1</span></p>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <p className="col-span-4">Session ID: <span className="font-bold">123456</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}