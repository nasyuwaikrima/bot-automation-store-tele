const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, REQUIRED_CHANNEL, START_IMAGE_URL, OWNER_ID } = require('./config');

const bot = new Telegraf(BOT_TOKEN);

//const input = ctx.message.text.split(' ').slice(1).join(' ').trim();

console.log("bot aktif")
// /start — support grup & pribadi + font stylish

async function startCmd(ctx) {
  const user = ctx.from.first_name || "User"
  const id = ctx.from.id
  const runtime = process.uptime()

  const days = Math.floor(runtime / 86400)
  const hours = Math.floor((runtime % 86400) / 3600)
  const minutes = Math.floor((runtime % 3600) / 60)

  const caption = `
Hallo, ${user} 👋

Selamat Datang Di *Mngpedia automation bot*

━━━━━━━━━━━━━━━
🤖 *Informasi Profile Bot*

⌁ Runtime: ${days}d ${hours}h ${minutes}m
⌁ Total User: -
⌁ Version: 1.0.0 Mngpedia automation
⌁ Total Transaksi: 146 transaksi

━━━━━━━━━━━━━━━
🪪 *Informasi Profil Anda*

⌁ ID: ${id}
⌁ Nama Depan: ${ctx.from.first_name || "-"}
⌁ Nama Belakang: ${ctx.from.last_name || "-"}

━━━━━━━━━━━━━━━

Silahkan Pilih Produk Yang Tersedia
Dibawah Ini
  `

  const keyboard = Markup.inlineKeyboard([

    [
      Markup.button.callback("🛍 Buy Produk", "produk"),
      Markup.button.callback("🖥 Buy VPS", "vps")
    ],

    [
      Markup.button.callback("💎 Buy Panel", "panel")
    ],

    [
      Markup.button.callback("📂 Buy Scripts", "script"),
      Markup.button.callback("📱 Buy App Prem", "prem")
    ],

    [
      Markup.button.callback("Admin Contact", "owner"),
    ]

  ])

  if (ctx.callbackQuery) {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: START_IMAGE_URL,
        caption,
        parse_mode: "Markdown"
      },
      {
        reply_markup: keyboard.reply_markup
      }
    )
  } else {
    await ctx.replyWithPhoto(
      START_IMAGE_URL,
      {
        caption,
        parse_mode: "Markdown",
        ...keyboard
      }
    )
  }
}
bot.start(async (ctx) => {
  await startCmd(ctx)
})

bot.command('menu', async (ctx) => {
  await startCmd(ctx)
})

bot.on("callback_query", async (ctx) => {

  const data = ctx.callbackQuery.data

  switch (data) {

    case "produk":
      await ctx.answerCbQuery("Menu Produk")
    break

    case "panel":
      await ctx.answerCbQuery("Menu Panel")
      await ctx.editMessageMedia(
        {
          type: "photo",
          media: "https://picsum.photos/500/302",
          caption: "💎 LIST PANEL"
        },
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "⬅️ Back",
                  callback_data: "menu"
                }
              ]
            ]
          }
        }
      )
    break

    case "script":
      await ctx.answerCbQuery("Menu Script")
    break

    case "next":
      await ctx.answerCbQuery("Next Page")
    break

    case "back":
      await ctx.answerCbQuery("Back")
    break
    
    case "owner":
      await ctx.answerCbQuery("contact owner")
    break
    
    case "menu": {
      await ctx.answerCbQuery("Menu")
      await startCmd(ctx)
    }
    break

  }

})



bot.launch();