import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase Admin para leer todos los tokens (ignorando RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesitas añadir esto en .env.local
);

// Inicializar Firebase Admin
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
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

export async function GET(request: Request) {
  // Verificación de seguridad para asegurar que solo Vercel Cron pueda llamar a esta ruta
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // 1. Obtener todos los tokens almacenados en Supabase
    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('token');

    if (error) throw error;
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No hay usuarios suscritos para enviar notificaciones' });
    }

    const tokens = subscriptions.map(sub => sub.token);

    // 2. Crear el contenido del mensaje
    const payload = {
      notification: {
        title: '¡Oferta Flash en Hacoo Ultra! 🔥',
        body: 'Usa el código ULTRA14 para conseguir un descuento exclusivo hoy.',
      },
      data: {
        url: 'https://hacoo-ultra.vercel.app',
      },
      // tokens se añadirá en los lotes
    };

    // 3. Enviar notificaciones en lotes (FCM admin max: 500 tokens por petición)
    const chunkSize = 500;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      
      const response = await admin.messaging().sendEachForMulticast({
        ...payload,
        tokens: chunk,
      });
      
      successCount += response.successCount;
      failureCount += response.failureCount;
      
      // Limpiar tokens inválidos o expirados de la base de datos
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
          await supabaseAdmin
            .from('push_subscriptions')
            .delete()
            .in('token', failedTokens);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    });

  } catch (error: any) {
    console.error('Error fatal enviando push notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
