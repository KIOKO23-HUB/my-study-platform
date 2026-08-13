import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { phone, plan, userId } = await req.json(); // plan: 'weekly' (50 KES) or 'monthly' (200 KES)
    const amount = plan === 'monthly' ? 200 : 50;

    // 1. Generate Daraja Access Token
    const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${credentials}` }
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Prepare STK Push Request
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || '';
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // Format phone number to 254XXXXXXXXX
    const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: 'StudyPlatform',
        TransactionDesc: `Subscription - ${plan}`
      })
    });

    const stkData = await stkRes.json();
    return NextResponse.json({ success: true, data: stkData });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}