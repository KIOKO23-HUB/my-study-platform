import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultCode = body?.Body?.stkCallback?.ResultCode;

    if (resultCode === 0) {
      // Payment Successful! Extract metadata
      const callbackItems = body.Body.stkCallback.CallbackMetadata.Item;
      const amountPaid = callbackItems.find((i: any) => i.Name === 'Amount')?.Value;
      const phonePaid = callbackItems.find((i: any) => i.Name === 'PhoneNumber')?.Value;

      // TODO: Match phone or checkout request ID to user and update Supabase auth metadata to PRO
      // Example:
      // await supabase.auth.admin.updateUserById(userId, {
      //   user_metadata: { subscription: 'pro', ai_tokens_left: 99999 }
      // });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 500 });
  }
}