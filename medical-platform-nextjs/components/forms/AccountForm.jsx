'use client'

import React, {useActionState, useEffect, useState} from 'react';
import {changeUserDetails} from "@/app/(auth)/actions";

const initialState = {
    success: null,
    errors: {},
};

function AccountForm({user}) {
    const [state, formAction, pending] = useActionState(changeUserDetails, initialState);
    const [name, setName] = useState(user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');

    useEffect(() => {
        setName(user?.user_metadata?.full_name || '');
        setEmail(user?.email || '');
    }, [user]);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="name" className="block mb-1">Nume</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Numele complet"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {state?.errors?.name && (
                    <p className="text-red-500 text-sm">
                        {state.errors.name._errors[0]}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@exemplu.com"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {state?.errors?.email && (
                    <p className="text-red-500 text-sm">
                        {state.errors.email._errors[0]}
                    </p>
                )}
            </div>

            <button type="submit" className="btn btn-accent" disabled={pending}>
                {pending ? 'Se salvează...' : 'Actualizează'}
            </button>
        </form>
    );
}

export default AccountForm;