const crypto = require('crypto');

function generateInviteToken(tokenData) {
    // Create a unique, time-limited token
    const payload = {
        ...tokenData,
        createdAt: Date.now(),
        salt: crypto.randomBytes(16).toString('hex')
    };

    // Simple signature generation (replace with more robust method in production)
    const signature = generateSignature(payload);

    // Encode the entire payload
    const encodedToken = Buffer.from(JSON.stringify({
        payload,
        signature
    })).toString('base64');

    return encodedToken;
}

function verifyInviteToken(token) {
    try {
        // Decode the token
        const decodedToken = JSON.parse(
            Buffer.from(token, 'base64').toString('utf-8')
        );

        // Verify signature
        const isValid = validateSignature(
            decodedToken.payload, 
            decodedToken.signature
        );

        if (!isValid) {
            throw new Error('Invalid token signature');
        }

        // Check token expiration (24 hours)
        const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000; // 24 hours
        if (Date.now() - decodedToken.payload.createdAt > MAX_TOKEN_AGE) {
            throw new Error('Token has expired');
        }

        return decodedToken.payload;
    } catch (error) {
        throw new Error('Token verification failed');
    }
}

function generateSignature(payload) {
    // In a real-world scenario, use a proper signing key
    const SECRET_KEY = process.env.INVITE_TOKEN_SECRET || 'fallback-secret';
    
    const payloadString = JSON.stringify(payload);
    return crypto
        .createHmac('sha256', SECRET_KEY)
        .update(payloadString)
        .digest('hex');
}

function validateSignature(payload, signature) {
    const generatedSignature = generateSignature(payload);
    return crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(signature)
    );
}

module.exports = {
    generateInviteToken,
    verifyInviteToken
};