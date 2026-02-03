import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { Logo } from '@/components/ui/logo';
import { Spinner } from '@/components/ui/spinner';
import AuthForm from "@/components/loginpage/auth-form";
import { SectionHeader, SectionSubHeader } from '@/components/ui/section-header';

export default function Login() {
    return (
        <div className="relative flex h-screen font-sans overflow-y-hidden">
            <div className="flex w-full h-full xl:mx-12">
                <div className={cn(
                    "relative hidden lg:flex lg:w-1/2 py-5 px-14 flex-col items-start",
                    "before:absolute before:inset-y-0 before:-left-[100vw] before:right-0 before:bg-gray-50 before:-z-10"
                )}>
                    <Logo className="mb-8" />
                    <div className="py-10 flex flex-col gap-2">
                        <SectionHeader as="h1">
                            Transform Your
                            <span className="text-primary"> Data</span>
                            <br />
                            into <span className="text-primary">AI-Driven</span> Actions
                        </SectionHeader>
                        <SectionSubHeader className="max-w-lg">
                            Instantly query, analyze, and automate across your databases with AI that runs locally or in the cloud, fully private and under your control.
                        </SectionSubHeader>
                        <Image
                            src={"/dotted-world-map.svg"}
                            width={600}
                            height={600}
                            alt='Dotted Map'
                            className="mt-10"
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-4 px-6">
                    <Logo className="lg:hidden mb-8" />
                    <Suspense fallback={<div className="h-dvh flex items-center justify-center"><Spinner size="large" /></div>}>
                        <AuthForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}