import PageLayout from "@/components/layout/PageLayout";
import SignupForm from "@/components/forms/SignUpForm";

export const metadata = {
    title: "Inregistrează-te în platformă",
    description: "Page for Inregistrare",
};

export default function Signup() {
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <PageLayout>
                <div className="space-y-2 text-center mb-6">
                    <h1 className="text-3xl font-bold">Înregistrare</h1>
                    <p className="text-gray-600">
                        Creează un cont nou pentru a beneficia de toate funcționalitățile aplicației.
                    </p>
                </div>
                <SignupForm></SignupForm>
            </PageLayout>
        </div>
    );
}
