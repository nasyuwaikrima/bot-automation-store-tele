const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, REQUIRED_CHANNEL, START_IMAGE_URL, OWNER_ID } = require('./config');

const bot = new Telegraf(BOT_TOKEN);

const session = {}

const prices = {
  "1gb": 2000,
  "2gb": 3000,
  "3gb": 4000,
  "4gb": 5000,
  "5gb": 6000,
  "6gb": 7000,
  "7gb": 8000,
  "8gb": 9000,
  "9gb": 10000,
  "unli": 15000
}

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
      case "panel":
  await ctx.answerCbQuery("Menu Panel")

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: "📦 Panel Legal",
          callback_data: "panel_legal"
        }
      ],
      [
        {
          text: "📦 Panel Biasa",
          callback_data: "panel_biasa"
        }
      ],
      [
        {
          text: "Back",
          callback_data: "menu"
        }
      ]
    ]
  })
    break
    
    case "panel_legal": {
      await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: "📦 Buy Panel Legal",
          callback_data: "buy_panel_legal"
        }
      ],
      [
        {
          text: "📦 Buy Admin Panel Legal",
          callback_data: "buy_admin_panel_legal"
        }
      ],
            [
        {
          text: "📦 Buy Reseller Legal",
          callback_data: "buy_reseller_legal"
        }
      ],
      [
        {
          text: "Back",
          callback_data: "panel"
        }
      ]
    ]
  })
    }
    break
    
    case "buy_panel_legal":

  session[ctx.from.id] = {
    action: "buy_panel_legal"
  }

  await ctx.reply("Masukkan username panel:", {
  reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Batalkan",
                callback_data: "menu"
              }
            ]
          ],
        }
  })

break
    
    case "script":
      await ctx.answerCbQuery("Menu Script")
    break
    
    case "1gb":
    case "2gb":
    case "3gb":
    case "4gb":
    case "5gb":
    case "6gb":
    case "7gb":
    case "8gb":
    case "9gb":
    case "unli":

      const id = ctx.from.id
      const username = session[id]?.username

      if (!username) {
        return ctx.reply("Username tidak ditemukan")
      }

      const amount = prices[data]

      await ctx.answerCbQuery("Membuat pembayaran...")

      const pay = await payment.create(amount)

      if (!pay.success) {
        return ctx.reply(pay.message)
      }
      
      await ctx.editMessageText("Memproses Pembayaran")

      const buffer = Buffer.from(
        pay.qr.replace(/^data:image\/png;base64,/, ""),
        "base64"
      )

      await ctx.replyWithPhoto(
        { source: buffer },
        {
          caption: `
🧾 Invoice: ${pay.invoice}
👤 Username: ${username}
📦 Paket: ${data}
💰 Amount: Rp${pay.amount}
⏰ Expired: ${pay.expired}
          `,
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "Check Status",
                `cek_${pay.invoice}`
              )
            ],
            [
              Markup.button.callback(
                "Batalkan",
                "menu"
              )
            ]
          ])
        }
      )

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

const Payment = require("./lib/payment");

const payment = new Payment();

bot.command("pay", async (ctx) => {

  const amount = ctx.message.text.split(" ")[1];

  if (!amount) {
    return ctx.reply("Masukin nominal lah");
  }

  const pay = await payment.create(amount);
console.log(pay)
  if (!pay.success) {
    return ctx.reply(pay.message);
  }

  // base64 -> buffer
  const buffer = Buffer.from(
    pay.qr.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
console.log(pay)
  await ctx.replyWithPhoto(
    { source: buffer },
    {
      caption: `
🧾 Invoice: ${pay.invoice}
💰 Amount: Rp${pay.amount}
⏰ Expired: ${pay.expired}
`,
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "Check Status",
            `cek_${pay.invoice}`
          )
        ]
      ])
    }
  );

});

bot.action(/^cek_(.+)$/, async (ctx) => {

  const invoice = ctx.match[1];

  const check = await payment.status(invoice);

  if (!check.success) {
    return ctx.answerCbQuery("Gagal cek status");
  }

  let statusText = "UNKNOWN";

  if (check.status === "PENDING") {
    statusText = "⏳ Pending";
  }

  if (check.status === "SETTLED") {
    statusText = "✅ Lunas";
  }

  if (check.status === "EXPIRED") {
    statusText = "❌ Expired";
  }

  await ctx.answerCbQuery(statusText);

  await ctx.editMessageCaption(`
🧾 Invoice: ${check.invoice}
💰 Amount: Rp${check.amount}
📌 Status: ${statusText}
  `, {
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Refresh Status",
          `cek_${check.invoice}`
        )
      ]
    ]).reply_markup
  });

});

bot.on("text", async (ctx) => {
  const id = ctx.from.id

  if (!session[id]) return

  switch (session[id].action) {

    case "buy_panel_legal":

      const username = ctx.message.text

      // simpan username
      session[id].username = username

      await ctx.reply(`Username: ${username}`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "1gb - 2000", callback_data: "1gb" }],
            [{ text: "2gb - 3000", callback_data: "2gb" }],
            [{ text: "3gb - 4000", callback_data: "3gb" }],
            [{ text: "4gb - 5000", callback_data: "4gb" }],
            [{ text: "5gb - 6000", callback_data: "5gb" }],
            [{ text: "6gb - 7000", callback_data: "6gb" }],
            [{ text: "7gb - 8000", callback_data: "7gb" }],
            [{ text: "8gb - 9000", callback_data: "8gb" }],
            [{ text: "9gb - 10000", callback_data: "9gb" }],
            [{ text: "unli - 15000", callback_data: "unli" }],
            [{ text: "Back", callback_data: "menu" }]
          ]
        }
      })
    break
  }
})




bot.launch();