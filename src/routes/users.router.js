import express from 'express';
import userModel from '../dao/models/user.model.js';
import { isPremiumUser } from '../utils.js';

const router = express.Router();

// Cambiar el rol de un usuario (de user a premium y viceversa)
router.put('/premium/:uid', isPremiumUser, async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'user') {
            user.role = 'premium';
        } else if (user.role === 'premium') {
            user.role = 'user';
        }

        await user.save();

        res.json({ message: 'User role updated successfully', updatedUser: user });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
