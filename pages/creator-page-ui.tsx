"use client";

import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LeaderTable } from './leaderboard-table';
import "../styles/globals.css";


const CreatorPage: React.FC = () => {
    const [sessionid, setSessionIdValue] = useState('');

    const updateDisplayedCookie = () => {
        const user = Cookies.get('sessionId') || ''; // Gets the value of the cookie named 'user'
        setSessionIdValue(user); // Update state
    };

    // Function to remove a cookie
    const removeCookie = () => {
        Cookies.remove('user'); // Removes the cookie named 'user'
        updateDisplayedCookie(); // Update the displayed cookie value
    };

    useEffect(() => {
        updateDisplayedCookie();
    }, []);

    return (
        <div className="bg-slate-200 max-h-full md:max-h-screen relative isolate px-6 pt-6 lg:px-40">
            <Card>
                <CardHeader>Session 0001</CardHeader>
                <CardContent>
                    <p>Session Name: <span className="font-bold">Session 1</span></p>
                    <p>Session ID: <span className="font-bold">{sessionid}</span></p>
                </CardContent>
            </Card>

            <LeaderTable />
        </div>
    )
}

export default CreatorPage;