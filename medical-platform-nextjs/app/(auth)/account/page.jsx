import PageLayout from "@/components/layout/PageLayout";
import AccountForm from "@/components/forms/AccountForm";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import MyEvaluations from "@/components/results/MyEvaluations";

export const metadata = {
    title: "Cont Utilizator",
    description: "Page for Account",
};

export default async function Account() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();

    const {data: evaluations, error: evaluationError} = await supabase
        .from('evaluations')
        .select("type, response, created_at")
        .order('created_at', {ascending: true})

    const userData = {
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
    };

    return (
        <PageLayout>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">Contul Meu</h1>
                <p className="text-base-content/75 mb-6">
                    Aici poți vizualiza și actualiza informațiile contului tău.
                </p></div>
            <div className="flex w-full items-center justify-center">
                <div className="flex w-5xl gap-4">
                    <div className="card shadow w-1/2 h-[294px]">
                        <div className="card-body">
                            <h2 className="text-2xl font-semibold">Informațiile contului</h2>
                            <AccountForm user={user}/>
                        </div>
                    </div>
                    <div className="card shadow w-1/2 h-[590px]">
                        <div className="card-body flex flex-col h-full">
                            <h2 className="text-2xl font-semibold mb-4">Istoric evaluări</h2>
                            <div className="flex-1 overflow-y-auto">
                                <MyEvaluations evaluations={evaluations}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
