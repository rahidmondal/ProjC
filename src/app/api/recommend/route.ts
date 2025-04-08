// File: src/app/api/recommend/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json(); // 🔄 Actually use this!
  
      const fastApiRes = await fetch("http://127.0.0.1:8000/magic-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: body.user_id || 1, // 👈 Use sent data
        }),
      });
  
      const recommendations = await fastApiRes.json();
  
      const formatted = recommendations.map((item: any) => ({
        name: item.title,
        link: item.link,
        category: `${item.skill} • ${item.level}`,
        image: "default.png",
      }));
  
      return NextResponse.json({ recommendations: formatted });
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  