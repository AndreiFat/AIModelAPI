'use server'

import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

import {createSupabaseServerClient} from '@/utils/supabase/server'

import * as z from "zod/v4";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const User = z.object({
    email: z
        .string()
        .min(1, {error: "Emailul este obligatoriu"})
        .email({error: "Adresa de email nu este validă"}),

    password: z
        .string()
        .min(8, {error: "Parola trebuie să aibă cel puțin 8 caractere"})
        .regex(passwordRegex, {
            error:
                "Parola trebuie să conțină litere mari, litere mici, o cifră și un caracter special",
        }),
});

const SignupUser = z.object({
    name: z.string().min(2, {error: 'Numele este obligatoriu'}),
    email: z
        .string()
        .min(1, {error: 'Emailul este obligatoriu'})
        .email({error: 'Adresa de email nu este validă'}),
    password: z
        .string()
        .min(8, {error: 'Parola trebuie să aibă cel puțin 8 caractere'})
        .regex(passwordRegex, {
            error:
                'Parola trebuie să conțină litere mari, litere mici, o cifră și un caracter special',
        }),
})

const UpdateUserSchema = z.object({
    name: z.string().min(2, {error: 'Numele trebuie să aibă cel puțin 2 caractere'}).optional(),
    email: z.string().email({error: 'Emailul nu este valid'}).optional(),
});


export async function login(prevState, formData) {
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const result = User.safeParse(data)

    if (!result.success) {
        // return formatted field errors to client
        return {
            success: false,
            errors: result.error.format(),
        }
    }
    const supabase = await createSupabaseServerClient()
    const {error} = await supabase.auth.signInWithPassword(result.data)

    if (error) {
        return {
            success: false,
            errors: {
                _form: error.message, // general auth error
            },
        }
    }

    revalidatePath('/', 'layout')
    return redirect("/")
}

export async function signup(prevState, formData) {
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const result = SignupUser.safeParse(data)

    if (!result.success) {
        return {
            success: false,
            errors: result.error.format(),
        }
    }

    const supabase = await createSupabaseServerClient()

    const {error} = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
            data: {
                full_name: result.data.name, // se salvează în profilul utilizatorului
            },
        },
    })

    if (error) {
        return {
            success: false,
            errors: {
                _form: error.message,
            },
        }
    }

    revalidatePath('/', 'layout')
    return {success: true}
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

export async function changeUserDetails(prevState, formData) {
    const data = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
    };

    const result = UpdateUserSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.format(),
        };
    }

    const supabase = await createSupabaseServerClient();

    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            success: false,
            errors: {
                _form: 'Nu s-a putut prelua utilizatorul autentificat.',
            },
        };
    }

    const updates = {};
    if (result.data.name) updates.name = result.data.name;
    if (result.data.email) updates.email = result.data.email;

    const {error} = await supabase.auth.updateUser({
        email: updates.email,
        data: {
            full_name: updates.name,
        },
    });

    if (error) {
        return {
            success: false,
            errors: {
                _form: error.message,
            },
        };
    }

    revalidatePath('/account', 'layout');
    return {success: true};
}

export async function saveEvaluation(formData) {
    const supabase = await createSupabaseServerClient();

    const {data: {user}, error} = await supabase.auth.getUser()
    const response = formData.get('response')
    const type = formData.get('type')

    const data = {
        user_id: user.id,
        type: type,
        response: JSON.parse(response),
    }

    const {evaluations, evaluationsError} = await supabase
        .from('evaluations')
        .insert(data)
        .select()


    console.log(data)
}