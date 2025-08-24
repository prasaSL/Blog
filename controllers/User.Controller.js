const User =  require('../models/User.model');



exports.signUp = async (req, res, next)=>{

    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Email, password, and username are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }


       // Check if username already exists
       const existingUsername = await User.findOne({ where: { name: username } });
       if (existingUsername) {
           return res.status(409).json({ message: 'Username already exists' });
       }

        // Create user
        const user = await User.create({ name: username, email, password });
        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
}


exports.login = async (req, res, next)=>{
    try {
       
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ where: { email
            , role: 'user'
         } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await User.prototype.comparePassword.call(user, password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //generate jwt
        const token = user.generateJWT();
        const refreshToken = user.generateRefreshToken();

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name

            }
        });
    } catch (error) {
        next(error);
    }
}


exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ where: { email
            , role: 'admin'
         } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await User.prototype.comparePassword.call(user, password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //generate jwt
        const token = user.generateJWT();
        const refreshToken = user.generateRefreshToken();

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        next(error);
    }
}