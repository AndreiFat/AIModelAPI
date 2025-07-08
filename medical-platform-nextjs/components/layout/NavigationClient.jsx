'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-regular-svg-icons";

export default function NavigationClient({user}) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 transition-colors duration-300 ${
                scrolled ? 'bg-base-100 shadow-sm' : 'bg-transparent'
            }`}
        >
            <div className="container navbar mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li><Link href="/">Acasă</Link></li>
                            <li><Link
                                className="font-bold bg-gradient-to-br from-secondary to-error bg-clip-text text-transparent"
                                href="/evaluate">Evaluază</Link></li>
                            {/*<li><Link href="/">About</Link></li>*/}
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    {/*<Link href="/" className="btn btn-ghost text-xl">daisyUI</Link>*/}
                </div>
                <div className="navbar-end">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <FontAwesomeIcon icon={faCircleUser} size="xl"/>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                <li><a>
                                    <div className={"flex flex-col gap-0.5"}>
                                        <span className={"font-semibold"}>
                                            {user.user_metadata.full_name}
                                        </span>
                                        <span className={"text-sm text-gray-500"}>
                                            {user.email}
                                        </span>
                                    </div>
                                </a></li>
                                <li><Link href="/account">Cont utilizator</Link></li>
                                <li>
                                    <form action="/logout" method={"post"}
                                          className={"p-2 flex justify-center w-full"}>
                                        <button type={"submit"} className="btn btn-error w-full">Deconectare</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="btn btn-outline btn-accent">Autentificare</Link>
                            <Link href="/signup" className="btn btn-accent">Înregistrare</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}