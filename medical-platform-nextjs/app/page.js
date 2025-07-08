import Link from "next/link";

export default async function Home() {

    return (
        <main className="bg-base-100 ">
            {/* Hero */}
            <section
                className="text-center min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-primary/90 to-error/90 text-white">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        Prevenția începe <br/>
                        <span>
                          cu tine
                        </span>
                    </h1>
                    <p className="text-lg text-white/90">
                        Diabetul și bolile cardiovasculare pot fi prevenite. Ai la îndemână
                        o platformă care te ajută să înțelegi simptomele și să acționezi din timp.
                    </p>
                    <Link
                        href="/evaluate"
                        className="btn btn-accent btn-lg rounded-full shadow-xl"
                    >
                        Începe evaluarea gratuit
                    </Link>
                </div>
            </section>
        </main>
    );
}
