'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createSupabaseServerClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/account')
}

export async function signup(formData) {
    const supabase = await createSupabaseServerClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/account')
}

export async function signInWithGoogle() {
    const supabase = await createSupabaseServerClient();
    console.log(getURL())

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
    revalidatePath('/')
    redirect(data.url)
}

const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ??
        'http://localhost:3000/'

    url = url.startsWith('http') ? url : `https://${url}`
    url = url.endsWith('/') ? url : `${url}/`
    return url
}