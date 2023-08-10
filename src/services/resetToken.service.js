import ResetToken from "../dao/models/resetToken.model.js";

export async function createResetToken(user) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expira en 1 hora

    const resetToken = new ResetToken({
        user: user._id,
        token,
        expiresAt,
    });

    await resetToken.save();
    return resetToken;
}

export async function findResetTokenByToken(token) {
    return ResetToken.findOne({ token }).populate("user");
}

export async function deleteResetToken(token) {
    return ResetToken.deleteOne({ token });
}
