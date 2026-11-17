# Quick Drop Delivery API — backend foundation

This is a backend starter for the Quick Drop Delivery Android prototype.

## Included
- Express API structure
- PostgreSQL schema for users, shops, products, orders, items, payments and rider GPS locations
- Public product catalogue endpoint
- Database health endpoint
- Safaricom Daraja OAuth helper and STK callback handler foundation
- Environment variable template

## Deliberately not enabled
Checkout creation, STK Push initiation and protected admin/rider/shop operations return HTTP 501 until authentication, authorization, server-side price checks, rate limits and payment reconciliation are completed. Do not expose unfinished payment endpoints to the public.

## Run locally
1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env`; set `DATABASE_URL`.
3. Create a PostgreSQL database named `quickdrop`.
4. Run `npm install`.
5. Run `npm run db:init`.
6. Run `npm run dev`.
7. Test `GET http://localhost:4000/api/health`.

## Daraja setup
Use sandbox credentials in server environment variables only. Deploy behind HTTPS and configure the callback URL. Test callback verification, duplicate-callback handling, reconciliation and refunds before production approval. Never put Daraja secrets in the Android app or commit them to GitHub.

## Required next engineering work
- Phone OTP login and signed access/refresh tokens
- Role-based access control enforced by backend
- Secure order creation transaction with server-side product price and fee calculation
- STK Push initiation with idempotency and amount/phone validation
- Callback idempotency and reconciliation job
- Rider assignment and authorized location updates
- Live tracking and push notifications
- Admin approval workflow and audit log
- Privacy policy, terms, support, cancellation and refund workflow

## Fee policy
Calculate delivery and customer service fees on the server and show both clearly before confirmation. Prototype fee values are not verified market prices.
