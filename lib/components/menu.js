
async function menu(ctx, Markup, img) {
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
      Markup.button.callback("My Profile", "me"),
    ],
    [
      Markup.button.callback("Deposit", "deposit"),
      Markup.button.callback("Cek Saldo", "ceksaldo"),
    ],
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
        media: img,
        caption,
        parse_mode: "Markdown"
      },
      {
        reply_markup: keyboard.reply_markup
      }
    )
  } else {
    await ctx.replyWithPhoto(
      img,
      {
        caption,
        parse_mode: "Markdown",
        ...keyboard
      }
    )
  }
}

module.exports = {
  menu
}