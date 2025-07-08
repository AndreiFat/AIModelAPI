export const metadata = {
    title: "",
    description: "Page for ",
};

export default function ChooseCondition() {
    return (
        <div className="h-screen flex">
            {/* Boli Metabolice */}
            <div className="w-1/2 relative group overflow-hidden">
                {/* Imagine de fundal */}
                <div
                    className="absolute inset-0 bg-[url('/images/metabolic.jpg')] bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-500"
                ></div>

                {/* Overlay colorat */}
                <div
                    className="absolute inset-0 bg-black/30 transition-colors duration-300"
                ></div>
                <div
                    className="absolute inset-0 bg-secondary/35 group-hover:bg-secondary/50 transition-colors duration-300"
                ></div>

                {/* Conținut */}
                <div
                    className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-center text-white">
                    <h1 className="text-4xl font-bold mb-4 group-hover:text-orange-100 transition-colors">Boli
                        Metabolice</h1>
                    <p className="mb-6 text-lg max-w-md">
                        Află dacă ești în risc de prediabet, diabet zaharat tip 2, sau rezistență la insulină.
                    </p>
                    <a
                        href="/evaluate/metabolic"
                        className="bg-secondary text-white px-6 py-3 rounded-xl shadow hover:bg-amber-600 transition"
                    >
                        Evaluează Riscul
                    </a>
                </div>
            </div>

            {/* Boli Cardiovasculare */}
            <div className="w-1/2 relative group overflow-hidden">
                {/* Imagine de fundal */}
                <div
                    className="absolute inset-0 bg-[url('/images/cardio.jpg')] bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-500"
                ></div>

                {/* Overlay colorat */}
                <div
                    className="absolute inset-0 bg-error/30 group-hover:bg-error/50 transition-colors duration-300"
                ></div>

                {/* Conținut */}
                <div
                    className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-center text-white">
                    <h1 className="text-4xl font-bold mb-4 group-hover:text-red-200 transition-colors">Boli
                        Cardiovasculare</h1>
                    <p className="mb-6 text-lg max-w-md">
                        Verifică dacă simptomele tale pot indica un risc crescut de afecțiuni cardiace.
                    </p>
                    <a
                        href="/evaluate/cardio"
                        className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
                    >
                        Verifică Riscul
                    </a>
                </div>
            </div>
        </div>
    );
}
