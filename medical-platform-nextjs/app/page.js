import Image from "next/image";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const {data: {user}, error} = await supabase.auth.getUser();

  if (!user){
    return "User not found! Please authenticate first";
  }
  console.log(user)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <pre>{JSON.stringify(user.email, null, 2)}</pre>
    </div>
  );
}
