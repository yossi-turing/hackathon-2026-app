require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;

// אפשור גישה מכל מקום (CORS) ופיענוח JSON
app.use(cors());
app.use(express.json());

// --- חיבור ל-MongoDB ---
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("Error: MONGODB_URI is missing in .env file");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

// --- הגדרת סכמות (Schemas) ---

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNum: String
});
const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // מזהה ייחודי להזמנה
    category: String,
    details: String,
    aliveTimer: Number,
    phoneNum: String,
    price: { type: Number, default: 0 },
    location: { type: String, default: 'תל אביב' },
    creator: String,
    participants: [String],
    chat: [{ username: String, message: String, timestamp: Date }],
    payments: { type: Map, of: Boolean, default: {} }, // מפת תשלומים
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const notificationSchema = new mongoose.Schema({
    toUser: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

console.log("Server starting...");

// --- נתיבי אימות (Auth) ---

app.post('/signIn', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}`);
    
    try {
        const user = await User.findOne({ username, password });
    
        if (user) {
            res.status(200).json({ message: "התחברת בהצלחה" });
        } else {
            res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/signUp', async (req, res) => {
    const { username, password, phoneNum } = req.body;

    if (!username || !password || !phoneNum) {
        return res.status(400).json({ message: "חסרים נתונים" });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(409).json({ message: "המשתמש כבר קיים" });
        }

        await User.create({ username, password, phoneNum });
        res.status(200).json({ message: "נרשמת בהצלחה" });
    } catch (e) {
        res.status(500).json({ message: "Error creating user" });
    }
});

// --- נתיבי הזמנות (Orders) ---

app.get('/getOrders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.post('/setOrder', async (req, res) => {
    const { category, details, aliveTimer, phoneNum, location, creator, price } = req.body;
    const newOrder = {
        id: Date.now().toString(), // שימוש ב-String ל-ID
        category,
        details,
        aliveTimer,
        phoneNum,
        price: Number(price) || 0,
        location: location || 'תל אביב', // ברירת מחדל
        creator: creator || 'Anonymous',
        participants: [],
        chat: [],
        payments: {}
    };
    
    try {
        await Order.create(newOrder);
        res.status(200).json(newOrder);
    } catch (e) {
        res.status(500).json({ message: "Error creating order" });
    }
});

app.post('/joinOrder', async (req, res) => {
    const { orderId, username } = req.body;
    
    try {
        const order = await Order.findOne({ id: String(orderId) });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (!order.participants.includes(username) && order.creator !== username) {
            order.participants.push(username);
            await order.save();
            
            // יצירת התראה ליוצר ההזמנה
            await Notification.create({
                toUser: order.creator,
                message: `${username} הצטרף להזמנה שלך: ${order.category}`
            });
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "Error joining order" });
    }
});

app.post('/leaveOrder', async (req, res) => {
    const { orderId, username } = req.body;
    
    try {
        const order = await Order.findOne({ id: String(orderId) });
        if (order) {
            order.participants = order.participants.filter(p => p !== username);
            await order.save();
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

app.post('/deleteOrder', async (req, res) => {
    const { orderId } = req.body;
    try {
        await Order.deleteOne({ id: String(orderId) });
        res.status(200).json({ message: "Order deleted" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting" });
    }
});

app.post('/addOrderMessage', async (req, res) => {
    const { orderId, username, message } = req.body;
    
    try {
        const order = await Order.findOne({ id: String(orderId) });
        if (order) {
        order.chat.push({ username, message, timestamp: new Date() });
            await order.save();
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

app.post('/togglePayment', async (req, res) => {
    const { orderId, username } = req.body;
    
    try {
        const order = await Order.findOne({ id: String(orderId) });
        if (order) {
            // שימוש ב-Map של Mongoose
            const currentStatus = order.payments.get(username);
            order.payments.set(username, !currentStatus);
            await order.save();
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

// --- נתיבי משתמשים (פרופיל) ---

app.get('/getUser', async (req, res) => {
    const { username } = req.query;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const { password, ...userWithoutPassword } = user.toObject();
            res.status(200).json(userWithoutPassword);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

app.post('/updateUser', async (req, res) => {
    const { username, phoneNum } = req.body;
    try {
        await User.findOneAndUpdate({ username }, { phoneNum });
        res.status(200).json({ message: "User updated successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

// --- נתיבי התראות ---

app.get('/getNotifications', async (req, res) => {
    const { username } = req.query;
    try {
        const notifications = await Notification.find({ toUser: username });
        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.post('/clearNotifications', async (req, res) => {
    const { username } = req.body;
    try {
        await Notification.deleteMany({ toUser: username });
        res.status(200).json({ message: "Notifications cleared" });
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});