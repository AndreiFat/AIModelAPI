import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/forms/LoginForm";

export const metadata = {
    title: "Autentifică-te în platformă",
    description: "Page for LoginForm",
};

export default async function LoginPage() {
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <PageLayout>
                <div className="space-y-2 text-center mb-6">
                    <h1 className="text-3xl font-bold">Autentificare</h1>
                    <p className="text-gray-600">
                        Bine ai revenit! Introdu adresa de email și parola pentru a-ți accesa contul.
                    </p>
                </div>
                <LoginForm/>
            </PageLayout>
        </div>
    )
}