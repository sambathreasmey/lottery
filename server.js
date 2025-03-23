const express = require("express");
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const TelegramBot = require('node-telegram-bot-api');

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


// Initialize the Telegram bot
const TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Add your Telegram bot token to .env
const bot = new TelegramBot(TOKEN, { polling: true });

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the bot! Use /help to see available commands.');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/help - List commands');
});

bot.onText(/\/schedule/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Scheduling a task every 15 minutes.');

    // Schedule a task to run every 15 minutes
    cron.schedule('*/15 * * * *', () => {
        try {
            bot.sendMessage(chatId, 'This message is sent every 15 minutes!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
});


app.use("/api/users", require("./routes/system/userRoutes"));
app.use("/api/user_detail", require("./routes/userDetailRoutes"));
app.use("/api/group_member", require("./routes/groupMemberRoutes"));
app.use("/api/number_detail", require("./routes/numberDetailsRoutes"));
app.use("/api/result_number_detail", require("./routes/resultNumberDetailsRoutes"));
app.use("/api/post_category_detail", require("./routes/postCategoryRoutes"));
app.use("/api/post_sub_category_detail", require("./routes/postSubCategoryRoutes"));
app.use("/api/permission", require("./routes/permissionRoutes"));
app.use("/api/shortcut", require("./routes/shortcutRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});