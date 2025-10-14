"use client";
import { useUser } from '@/services/authservices';

export default function HomeLayout({
                                       auth,
                                       children,
                                   }: Readonly<{
    auth: React.ReactNode;
    children: React.ReactNode;
}>) {
  const {user}= useUser();
  if(!user) return auth
    return children;
}