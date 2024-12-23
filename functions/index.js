const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const admin = require('firebase-admin');

// Firebase'ga ulanish
admin.initializeApp({
    credential: admin.credential.cert(require('./firebase-config.json')), // Firebase konfiguratsiya fayli
});
const db = admin.firestore();

// Telegram bot tokeni
const token = '6710528826:AAGTfY6lXjlr0UrHo2Ce_utZKjixoRZEASI';
const bot = new TelegramBot(token, { polling: true });

// Web App URL
const web_url = 'https://my-online-app-1.web.app/';

// Botga "/start" komandasi yuborilganda ishlaydi
bot.onText(/\/start/, async (msg) => {
    const tg_id = msg.from.id;  // Telegram ID
    const username = msg.from.username;  // Telegram username
    const first_name = msg.from.first_name;  // Telegram first name
    const last_name = msg.from.last_name || '';  // Telegram last name (agar mavjud bo'lsa)

    // Profil rasmini olish
    const profile_photo_url = await getUserProfilePhoto(tg_id);

    // URL-ni kodlash
    const profile_photo_encoded = encodeURIComponent(profile_photo_url || '');
    const web_app_url = `${web_url}/?tg_id=${tg_id}&username=${username}&first_name=${first_name}&last_name=${last_name}&profile_photo=${profile_photo_encoded}`;

    // Inline tugma yaratish
    const webAppButton = {
        text: 'Web App ni ochish',
        web_app: {
            url: web_app_url
        }
    };

    const keyboard = {
        inline_keyboard: [[webAppButton]]
    };

    // Foydalanuvchiga xabar yuborish
    bot.sendMessage(msg.chat.id, `Assalomu alaykum, ${first_name}! Botga xush kelibsiz.\nWeb App yoki bot orqali e'lon berish uchun tugmalardan birini tanlang:`, {
        reply_markup: keyboard
    });

    // Firebase'ga foydalanuvchi ma'lumotlarini saqlash
    await saveUserData(tg_id, username, first_name, last_name, profile_photo_url);
});

// Foydalanuvchining profil rasmini olish
async function getUserProfilePhoto(tg_id) {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getUserProfilePhotos?user_id=${tg_id}`);
        const photos = response.data.result.photos;
        if (photos && photos.length > 0) {
            const file_id = photos[0][0].file_id;
            const file_response = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`);
            const file_path = file_response.data.result.file_path;
            return `https://api.telegram.org/file/bot${token}/${file_path}`;
        }
        return null; // Agar profil rasmi bo'lmasa
    } catch (error) {
        console.error('Error fetching profile photo:', error);
        return null;
    }
}

// Firebasega foydalanuvchi ma'lumotlarini saqlash
async function saveUserData(tgId, username, firstName, lastName, profilePhotoUrl) {
    const userRef = db.collection('users').doc(tgId.toString());
    await userRef.set({
        tgId,
        username,
        firstName,
        lastName,
        profilePhotoUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('User data saved to Firebase!');
}
