"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ActiveSessionCard } from "./active-session-card"

export function JoinSession() {

    const [isJoining, setIsJoining] = useState(true);

    const toggleSessionMode = () => {
        setIsJoining(!isJoining);
    };

    const joinSession = async () => {
        const sessionId = document.getElementById('session-id') as HTMLInputElement;
        const privateId = document.getElementById('private-id') as HTMLInputElement;
        const displayName = document.getElementById('display-id-name') as HTMLInputElement;

        const response = await fetch('/api/join-session', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: sessionId.value,
                privateId: privateId.value,
                displayName: displayName.value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `sessionId=${data.sessionId}; `;
            document.cookie = `sessionName=${data.sessionName}; `;
            document.cookie = `displayName=${data.displayName}; `;
            document.cookie = `privateId=${data.privateId}; `;
            toggleSessionMode
            console.log(data);
            // router.push('/active-session-card')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Join Session</Button>
            </DialogTrigger>
            {isJoining ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Join a session</DialogTitle>
                        <DialogDescription>
                            Join a session by adding a session name and your private id.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-2">
                            <Label htmlFor="session-id">Session id</Label>
                            <Input id="session-id" placeholder="000000" className="col-span-4" />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-2">
                            <Label htmlFor="session-id">Private id</Label>
                            <Input id="private-id" placeholder="private id" className="col-span-4" />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-2">
                            <Label htmlFor="session-id">Display name</Label>
                            <Input id="display-id-name" placeholder="display name" className="col-span-4" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={joinSession} type="submit">Join</Button>
                    </DialogFooter>
                </DialogContent>
            ) : (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Checking ...</DialogTitle>
                        <DialogDescription>
                            See if the session exists
                        </DialogDescription>
                    </DialogHeader>
                    <ActiveSessionCard/>
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit">Join session</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>)}

        </Dialog>
    )
}
