const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { supabase } = require("../config/supabase");

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, phone, password")
      .eq("phone", phone)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

module.exports = router;