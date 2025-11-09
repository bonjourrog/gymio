'use server'

import SigninForm from "./components/signinForm"

export default async function SignInPage() {
    return <main className="flex items-center justify-center h-screen">
        <SigninForm/>
    </main>
}