import { getSession } from "@/app/lib/auth";
import OnBoardingForm from "./components/onboardingForm"
import { redirect } from "next/navigation";

export default async function OnBoardingPage() {
    const session = await getSession();

    if (!session) redirect("/auth/signin");

    if (session.user.user_metadata.profile_completed) {
        redirect("/dashboard"); 
    }
    return <main className="flex items-center justify-center h-screen w-screen">
        <OnBoardingForm />
    </main>
}