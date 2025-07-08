import PredictDiabetesForm from "@/components/forms/PredictDiabetesForm";
import PageLayout from "@/components/layout/PageLayout";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export const metadata = {
    title: "Diabetes",
    description: "Page for Diabetes",
};

export default async function Metabolic() {
    const supabase = await createSupabaseServerClient()
    const {data: {user}, error} = await supabase.auth.getUser()
    return (
        <PageLayout>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                Evaluare Riscuri Diabet
            </h1>
            <p className="text-gray-600 mb-6">
                Completează formularul de mai jos pentru a primi o evaluare personalizată a riscului tău de diabet.
            </p>
            <PredictDiabetesForm user={user}/>
        </PageLayout>
    );
}
