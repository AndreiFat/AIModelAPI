import PageLayout from "@/components/layout/PageLayout";
import PredictCardioForm from "@/components/forms/PredictCardioForm";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export const metadata = {
    title: "Cardiovascular",
    description: "Page for Cardiovascular",
};

export default async function Cardiovascular() {
    const supabase = await createSupabaseServerClient()
    const {data: {user}, error} = await supabase.auth.getUser()
    
    return (
        <PageLayout>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                Evaluare Riscuri Cardiovasculare
            </h1>
            <p className="text-gray-600 mb-6">
                Completează formularul pentru a afla riscul tău de a dezvolta boli cardiovasculare în viitor.
            </p>
            <PredictCardioForm user={user}/>
        </PageLayout>
    );
}
