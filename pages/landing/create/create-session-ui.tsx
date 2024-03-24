"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
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

export function CreateSession() {

    const [isSessionExist, setIsCreating] = useState(true);
    const router = useRouter()

    const toggleSessionMode = () => {
        setIsCreating(!isSessionExist);
    };

    const createSession = async () => {
        const sessionName = document.getElementById('session-name') as HTMLInputElement;
        const privateId = document.getElementById('private-id') as HTMLInputElement;
        const displayName = document.getElementById('display-name') as HTMLInputElement;

        const response = await fetch('/api/create-session', {
            method: 'POST',
            body: JSON.stringify({
                sessionName: sessionName.value,
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
            document.cookie = `sessionName=${sessionName.value}; `;
            document.cookie = `displayName=${displayName.value}; `;
            document.cookie = `privateId=${privateId.value}; `;
            console.log(data);
            router.push('/creator-page-ui')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-full">Create Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add your details</DialogTitle>
                    <DialogDescription>
                        create a stupid driver name
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="session-name">Session name</Label>
                        <Input id="session-name" placeholder="session 101" className="col-span-4" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="display-name">Display name</Label>
                        <Input id="display-name" placeholder="stig101" className="col-span-4" />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="private-id">Private ID</Label>
                        <Input type="number" id="private-id" placeholder="00000000" className="col-span-4" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="rounded-full btn-lg" onClick={createSession} type="submit">Start Session 🏁</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
