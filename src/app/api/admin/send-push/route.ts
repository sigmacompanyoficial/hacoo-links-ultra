import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export async function POST(request: Request) {
  try {
    const { title, body, url, adminUserId } = await request.json();

    if (!adminUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Verificar que el usuario que llama es un admin real
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', adminUserId)
      .single();

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado: No eres administrador' }, { status: 403 });
    }

    // Obtener tokens
    const { data: subscriptions, error } = await supabaseAdmin.from('push_subscriptions').select('token');
    
    if (error) throw error;
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: false, message: 'No hay usuarios suscritos todavía.' }, { status: 404 });
    }

    const tokens = subscriptions.map(sub => sub.token);

    const payload = {
      notification: { 
        title: title || 'Notificación Hacoo', 
        body: body || 'Tienes una nueva notificación' 
      },
      data: { 
        url: url || 'https://hacoo-ultra.vercel.app' 
      },
    };

    let successCount = 0;
    let failureCount = 0;
    
    // Enviar en bloques de 500 (límite de Firebase)
    for (let i = 0; i < tokens.length; i += 500) {
      const chunk = tokens.slice(i, i + 500);
      const response = await admin.messaging().sendEachForMulticast({ ...payload, tokens: chunk });
      successCount += response.successCount;
      failureCount += response.failureCount;
      
      // Limpieza de tokens inválidos
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errCode = resp.error?.code;
            if (errCode === 'messaging/invalid-registration-token' || errCode === 'messaging/registration-token-not-registered') {
              failedTokens.push(chunk[idx]);
            }
          }
        });
        
        if (failedTokens.length > 0) {
          await supabaseAdmin.from('push_subscriptions').delete().in('token', failedTokens);
        }
      }
    }

    return NextResponse.json({ success: true, sent: successCount, failed: failureCount });
  } catch (error: any) {
    console.error("Error sending admin push:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
