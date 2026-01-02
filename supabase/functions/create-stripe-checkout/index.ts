import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.10.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obter chave do Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY não configurada');
      return new Response(
        JSON.stringify({ error: 'Configuração do Stripe não encontrada' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Parse do body
    const { items, customerInfo, successUrl, cancelUrl } = await req.json();

    // Validação
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum produto foi enviado' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Criar line items para o Stripe
    const lineItems = items.map((item: any) => {
      const unitAmount = Math.round(item.price * 100); // Converter para centavos
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name || 'Produto',
            description: item.description || '',
            images: item.image ? [item.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    console.log('Criando sessão Stripe com:', {
      itemsCount: lineItems.length,
      customerEmail: customerInfo?.email,
    });

    // Criar sessão de checkout
    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/carrinho`,
      shipping_address_collection: {
        allowed_countries: ['LU', 'FR', 'BE', 'NL', 'DE', 'IT', 'GB', 'ES', 'PT', 'AT', 'DK', 'FI', 'NO', 'IE', 'PL', 'CZ', 'GR', 'SE'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    };

    // Adicionar email do cliente se fornecido
    if (customerInfo?.email) {
      sessionParams.customer_email = customerInfo.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Sessão criada com sucesso:', session.id);

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Erro ao criar sessão Stripe:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao processar pagamento',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});