import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();
router.get('/', async (req,res) => { try { const {category,search}=req.query; const values=[]; let where='WHERE p.active = TRUE AND s.approved = TRUE'; if(category && category!=='all'){values.push(category);where+=` AND p.category = $${values.length}`;} if(search){values.push(`%${String(search).slice(0,80)}%`);where+=` AND (p.name ILIKE $${values.length} OR s.name ILIKE $${values.length})`;} const result=await pool.query(`SELECT p.id,p.name,p.category,p.description,p.price_kes,s.id AS shop_id,s.name AS shop_name FROM products p JOIN shops s ON s.id=p.shop_id ${where} ORDER BY p.created_at DESC LIMIT 100`,values); res.json({products:result.rows}); } catch { res.status(500).json({error:'Could not load products.'}); } });
export default router;
