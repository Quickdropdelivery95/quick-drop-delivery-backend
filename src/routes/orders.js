import { Router } from 'express';
const router = Router();
router.post('/', async (_req,res) => res.status(501).json({error:'Checkout is not enabled yet.',message:'Implement phone OTP authentication, server-side cart validation, order creation and rate limiting before taking live orders.'}));
router.get('/:id', async (_req,res) => res.status(501).json({error:'Order access requires authenticated customer/rider/admin authorization.'}));
export default router;
