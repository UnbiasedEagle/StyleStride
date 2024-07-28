import prisma from '@/lib/db';
import { redis } from '@/lib/reddis';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    return new Response('Webhook Error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      await prisma.order.create({
        data: {
          amount: session.amount_total as number,
          status: session.status as string,
          userId: session.metadata?.userId,
        },
      });

      await redis.del(`cart-${session.metadata?.userId}`);
    }

    default: {
      console.log('unhandled event');
    }
  }

  return new Response(null, { status: 200 });
};
