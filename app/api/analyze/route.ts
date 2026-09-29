import { NextResponse } from "next/server";

const categories = {
  safe: "No suicidal thoughts or intent are expressed. This includes ordinary stress, sadness, figurative language, or unrelated content.",
  suicidal_ideation:
    "Suicidal thoughts, a wish to die, or feeling that others would be better off without the person, but no specific plan, method, timing, intent, or preparatory action is expressed.",
  active_suicide_risk:
    "A specific plan, method, timing, access to means, intent to act, preparatory behavior, or a recent attempt is expressed.",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "الرسالة مطلوبة." },
        { status: 400 },
      );
    }
    if (message.length > 4000) {
      return NextResponse.json(
        { error: "الرسالة طويلة جدًا." },
        { status: 413 },
      );
    }
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "مفتاح OPENROUTER_API_KEY غير مُهيّأ." },
        { status: 500 },
      );
    }

    const upstream = await fetch("https://openrouter.ai/api/alpha/decisions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Jev Risk Demo",
      },
      body: JSON.stringify({
        model: "typesafe/jev-1.13",
        state: { message },
        questions: {
          risk: {
            type: "choice",
            instructions:
              "Classify the suicide-related risk expressed in the message. Use the most severe category clearly supported by the text. Do not infer hidden intent.",
            criteria: categories,
          },
        },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "فشل طلب التحليل." },
        { status: upstream.status },
      );
    }

    return NextResponse.json({
      answer: data.answers?.risk,
      usage: data.usage,
    });
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }
}
