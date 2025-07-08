'use client'

import LoginGoogleButton from '@/components/buttons/LoginGoogleButton'
import {useActionState} from "react";
import {login} from "@/app/(auth)/actions";

const initialState = {
    success: null,
    errors: {},
}

function LoginForm() {
    const [state, formAction, pending] = useActionState(login, initialState)

    return (
        <div className="space-y-4 max-w-lg mx-auto card p-8 shadow bg-white">
            <form className="space-y-4">
                
                {state?.errors?._form && (
                    <div role="alert" className="alert alert-error alert-soft">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="font-semibold">{state.errors._form}</span>
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@domain.com"
                        className="input input-bordered w-full"
                    />
                    {state?.errors?.email && (
                        <p className="text-red-500 text-sm">
                            {state.errors.email._errors[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Parolă</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={'•'.repeat(12)}
                        className="input input-bordered w-full"
                    />
                    {state?.errors?.password && (
                        <p className="text-red-500 text-sm">
                            {state.errors.password._errors[0]}
                        </p>
                    )}
                </div>
                <p className="text-sm text-gray-500 text-center my-6">
                    Nu ai un cont?{' '}
                    <a href="/signup" className="text-primary font-medium hover:underline">
                        Creează unul aici
                    </a>
                </p>
                <button formAction={formAction} type="submit" className="btn btn-primary w-full">
                    Autentifică-te
                </button>
            </form>
            <div className="divider">sau</div>
            <LoginGoogleButton/>
        </div>
    )
}

export default LoginForm;