import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'failed to sign up',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'wrong login or password',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Wrong lodin or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(error);
    res.status(500).json({
      message: 'failed to sign in',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    res.status(500).json({
      message: 'No access',
    });
  }
};

export const userEdit = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    let hash;

    password && `${(hash = await bcrypt.hash(password, salt))}`;

    await userModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      },
    );

    res.json({
      message: 'success',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to update user info',
    });
  }
};
