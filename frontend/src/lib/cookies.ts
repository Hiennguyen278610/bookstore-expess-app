"use server";

import { cookies } from "next/headers";

export async function setJWTtoCookie(data: string) {
    const cookieStore = await cookies();

    cookieStore.set({
        name: "access_token",
        value: data,
        httpOnly: false,
        secure: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: "/",
    });
}

export async function removeJWTfromCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
}

export async function getJWTfromCookie() {
    const cookieStore = await cookies();

    return cookieStore.get("access_token")?.value;
}

