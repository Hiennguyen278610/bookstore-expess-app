"use client";
export default function HomeLayout({
                                       auth,
                                       children,
                                   }: Readonly<{
    auth: React.ReactNode;
    children: React.ReactNode;
}>) {
    return (
        // login xong goi children ra trang chu
        auth
    )
}