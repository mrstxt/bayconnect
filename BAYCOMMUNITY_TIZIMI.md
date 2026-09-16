# BayConnect obuna va BayCommunity tizimi

## Asosiy model

BayConnect’da ikki xil pullik yo'nalish bor:

1. Mutaxassislar obunasi: `Start`, `Pro`, `Premium`
2. Oddiy foydalanuvchilar uchun `BayCommunity` obunasi

Mutaxassis obunasiga ulangan har bir provider BayCommunity yopiq guruhiga ham kirishi mumkin. Oddiy foydalanuvchi esa `/community` sahifasi orqali bitta community tarifiga ulanadi.

## Mutaxassis oqimi

1. Foydalanuvchi `Hamkor bo'lish` sahifasiga kiradi.
2. `Start`, `Pro`, `Premium` tariflaridan birini tanlaydi.
3. Promokod bo'lsa kiritadi.
4. Profil ma'lumotlarini to'ldiradi.
5. Agar kategoriya `Transfer` bo'lsa, avtomobil turi majburiy tanlanadi:
   - Yengil avto
   - Minivan
   - Yo'ltanlamas
   - Avtobus
   - Aeroport transfer
6. Profil `providers` jadvaliga, obuna esa `subscriptions` jadvaliga yoziladi.
7. Promokod to'g'ri bo'lsa obuna `active`, bo'lmasa `payment_required` bo'ladi.

## Community oqimi

1. Oddiy foydalanuvchi `/community` sahifasiga kiradi.
2. Ism, telefon, Telegram username va promokod kiritadi.
3. Promokod to'g'ri bo'lsa `community_access_requests.status = approved` bo'ladi.
4. Foydalanuvchi yopiq Telegram guruhiga join request yuboradi.
5. Bot `chat_join_request` update oladi.
6. Bot username va obuna muddatini bazadan tekshiradi.
7. Ruxsat bo'lsa `approveChatJoinRequest`, bo'lmasa `declineChatJoinRequest` qiladi.

## Muhim Telegram cheklovi

Telegram’da foydalanuvchini guruhdan chiqib ketolmaydigan qilishning rasmiy texnik yo'li yo'q. To'g'ri daromad modeli quyidagicha bo'ladi:

- Guruh yopiq bo'ladi.
- Link ochiq tarqatilmaydi yoki join request yoqiladi.
- Bot faqat faol obuna yoki tasdiqlangan promokod egasini kiritadi.
- Obuna muddati tugasa cron/admin jarayon foydalanuvchini guruhdan chiqaradi yoki keyingi join requestni rad etadi.
- Chiqib ketgan odam qayta kirishi uchun yana faol obuna talab qilinadi.

## Kerakli env sozlamalar

`TELEGRAM_COMMUNITY_CHAT_ID` yopiq BayCommunity guruh ID’si bo'lishi kerak. Bot shu guruhda admin bo'lishi va quyidagi huquqlarga ega bo'lishi kerak:

- join requestlarni tasdiqlash
- memberlarni chiqarish, agar keyin muddat tugaganda avtomatik chiqarish qo'shilsa

## Keyingi bosqichlar

- Payme/Click to'lov callback endpointi qo'shiladi.
- Admin panelda subscription statusini `active`, `expired`, `canceled` qilish qo'shiladi.
- Cron job muddati tugagan obunalarni tekshiradi.
- Telegram guruhdan chiqib ketganlar uchun `my_chat_member` update orqali status yangilanadi.
