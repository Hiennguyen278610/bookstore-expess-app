import {LoginForm} from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-screen">
            <div className="hidden md:flex flex-col">
                <Image
                    src="/images/sidebarlogin.png"
                    alt="Login Image"
                    width={515}
                    height={800}
                    className="object-cover h-full"
                />
            </div>
            <div className="flex flex-1 items-center justify-center ">
                <div className="w-full max-w-md px-8 py-10 rounded-2xl">
                    <h1 className="text-3xl font-mono text-center mb-4 bold">Đăng nhập</h1>
                    <LoginForm />
                </div>
            </div>
        </div>

    )
}