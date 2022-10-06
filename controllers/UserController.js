import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save()

        const token = jwt.sign(
        {
            _id: user._id,
        },
            'sectet123',
        {
            expiresIn: '30d'
        } 
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid Register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid password or email'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
                'sectet123',
            {
                expiresIn: '30d'
            } 
            )
    
            const { passwordHash, ...userData } = user._doc
    
            res.json({
                ...userData,
                token
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid Login"
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const { passwordHash, ...userData } = user._doc
    
        res.json({userData})

    } catch (error) {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}