import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getJWTfromCookie } from "@/lib/cookies";

export async function GET(req: NextRequest) {
  try {
    const token = getJWTfromCookie()

    if (!token) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    // Gọi API thật sự với token
    const response = await axios.get("https://api.example.com/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
