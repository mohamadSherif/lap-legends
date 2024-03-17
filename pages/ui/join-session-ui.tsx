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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { ActiveSessionCard } from "./active-session-card"

export function JoinSession() {

    const [isJoining, setIsJoining] = useState(true); // State to toggle between joining and creating a session

    // Toggle function to switch between states
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
                        <InputOTP
                            maxLength={6}
                            className="mx-auto"
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            render={({ slots }) => (
                                <InputOTPGroup>
                                    {slots.map((slot, index) => (
                                        <InputOTPSlot key={index} {...slot} />
                                    ))}{" "}
                                </InputOTPGroup>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input id="private-id" placeholder="private id" className="col-span-4" />
                    </div>
                </div>
                <DialogFooter>
                        <Button onClick={toggleSessionMode} type="submit">Create</Button>
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
            </DialogContent>)}

        </Dialog>
    )
}
