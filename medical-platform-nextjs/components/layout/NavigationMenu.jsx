import React from 'react';
import {createSupabaseServerClient} from '@/utils/supabase/server';
import NavigationClient from "@/components/layout/NavigationClient";

export default async function NavigationMenu() {
    const supabase = await createSupabaseServerClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    return (
        <NavigationClient user={user}/>
    );
}