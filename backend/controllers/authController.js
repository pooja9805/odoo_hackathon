const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role
    }
  });

  res.json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

exports.forgotPassword = async(req,res)=>{
 res.json({message:"Reset link sent (mock)"});
};

exports.resetPassword = async(req,res)=>{
 res.json({message:"Password reset (mock)"});
};