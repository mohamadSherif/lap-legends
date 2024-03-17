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
import { ActiveSessionCard } from "./active-session-card"

export function JoinSession() {

    const [isJoining, setIsJoining] = useState(true); 

    const toggleSessionMode = () => {
        setIsJoining(!isJoining);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Join Session</Button>
            </DialogTrigger>
            {isJoining ? (<DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Join a session</DialogTitle>
                    <DialogDescription>
                        Join a session by adding a session name and your private id.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center">
                        <Input id="session-id" placeholder="session id" className="col-span-4" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input id="private-id" placeholder="private id" className="col-span-4" />
                    </div>
                </div>
                <DialogFooter>
                        <Button onClick={toggleSessionMode} type="submit">Join</Button>
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
                <ActiveSessionCard />
                <DialogFooter>
                    <DialogClose>
                        <Button type="submit">Join session</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>)}

        </Dialog>
    )
}
