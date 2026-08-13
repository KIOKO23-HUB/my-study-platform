import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Increase max duration for file parsing and AI inference (Next.js config)
export const maxDuration = 60; 

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1' // Groq's OpenAI-compatible base URL
});

export async function POST(req: Request) {
  try {
    const { message, fileContent, fileName, isReportWriter } = await req.json();

    // 1. Authenticate user from request headers / Supabase session
    const authHeader = req.headers.get('authorization');
    let userId = null;
    let userMeta: any = {};

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
        userMeta = user.user_metadata || {};
      }
    }

    // Fallback check if auth header isn't passed directly, get user using cookies/session helper
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userId = session.user.id;
        userMeta = session.user.user_metadata || {};
      }
    }

    const subscription = userMeta.subscription || 'free';
    const tokensLeft = userMeta.ai_tokens_left ?? 3; // Default free tier gets 3 tokens

    // 2. Gating Check: AI Report Writer is PRO ONLY
    if (isReportWriter && subscription !== 'pro') {
      return NextResponse.json({ 
        reply: "🔒 **PRO Feature Locked**\n\nThe AI Report Writer is exclusive to PRO subscribers. Upgrade to PRO (Weekly KSh 50 or Monthly KSh 200) via M-Pesa to unlock unlimited research assistance and report generation!" 
      }, { status: 403 });
    }

    // 3. Gating Check: Free Tier Token Depletion Limit
    if (subscription !== 'pro' && tokensLeft <= 0) {
      return NextResponse.json({ 
        reply: "⚡ **Free Trial Tokens Depleted**\n\nYou have used up your free AI searches. Please upgrade to a PRO subscription (Weekly KSh 50 / Monthly KSh 200) to continue using AI features without limits." 
      }, { status: 403 });
    }

    let fullMessage = message;
    if (fileContent) {
      const safeFileContent = fileContent.length > 15000 ? fileContent.substring(0, 15000) + "\n[Content Truncated due to size]" : fileContent;
      fullMessage = `[Attached File: ${fileName}]\n${safeFileContent}\n\nUser Request: ${message}`;
    }

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant for university students." },
        { role: "user", content: fullMessage }
      ],
      stream: false,
    });

    // 4. Decrement free token count if user is on free tier
    if (userId && subscription !== 'pro') {
      const newTokensLeft = Math.max(0, tokensLeft - 1);
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { ...userMeta, ai_tokens_left: newTokensLeft }
      });
    }

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ reply: `Error: ${error.message || 'Server terminated request'}` }, { status: 500 });
  }
}