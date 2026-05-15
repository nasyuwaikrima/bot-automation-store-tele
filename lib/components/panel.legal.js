async function panelLegal(ctx) {
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

async function buyFormPanelLegal(ctx, session) {
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

}

async function buyPanelLegal(ctx, session, data) {
  const id = ctx.from.id
      const username = session[id]?.username

      if (!username) {
        return ctx.reply("Username tidak ditemukan")
      }
const panelConfig = {
    "1gb": { price: 2000, ram: "1000", disk: "1000", cpu: "40" },
    "2gb": { price: 3000, ram: "2000", disk: "2000", cpu: "60" },
    "3gb": { price: 4000, ram: "3000", disk: "3000", cpu: "80" },
    "4gb": { price: 5000, ram: "4000", disk: "4000", cpu: "100" },
    "5gb": { price: 6000, ram: "5000", disk: "5000", cpu: "120" },
    "6gb": { price: 7000, ram: "6000", disk: "6000", cpu: "140" },
    "7gb": { price: 8000, ram: "7000", disk: "7000", cpu: "160" },
    "8gb": { price: 9000, ram: "8000", disk: "8000", cpu: "180" },
    "9gb": { price: 10000, ram: "9000", disk: "9000", cpu: "200" },
    "unli": { price: 15000, ram: "0", disk: "0", cpu: "0" }
  }

  const config = panelConfig[data]

  if (!config) {
    return ctx.reply("Paket tidak valid")
  }

  const { ram, disk, cpu, price } = config

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
      
      const maxTime = 2 * 60 * 1000 // 2 menit
const intervalTime = 10000 // cek tiap 10 detik

const startTime = Date.now()

const checker = setInterval(async () => {

  const check = await payment.status(invoice)
 /*
 const check = {
  success: true,
  status: "SETTLED",
  invoice: "TESTING123",
  amount: 1000
}*/

  if (!check.success) return

  let statusText = "UNKNOWN"

  if (check.status === "PENDING") {
    statusText = "⏳ Pending"
  }

  if (check.status === "SETTLED") {
    statusText = "✅ Lunas"
  }

  if (check.status === "EXPIRED") {
    statusText = "❌ Expired"
  }

  console.log("STATUS:", statusText)

  // update caption
  try {
    await ctx.editMessageCaption(
`🧾 Invoice: ${check.invoice}
💰 Amount: Rp${check.amount}
📌 Status: ${statusText}`, {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "Refresh Status",
            `cek_${check.invoice}`
          )
        ]
      ])
    })
  } catch (e) {}

  // =========================
  // PAYMENT SUCCESS
  // =========================
  if (check.status === "SETTLED") {

    clearInterval(checker)

    await ctx.reply("✅ Pembayaran diterima\n⏳ Sedang membuat panel...")

    // ======================
    // CREATE USER
    // ======================

    const createUser = await fetch("https://alluffystore.alluffystore.my.id/api/application/users", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ptla_u6FGXOhvWXwKsDbRnLshR3n3Qh78j5jweickYH2fkvP"
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: "Server",
        language: "en",
        password
      })
    })

    const dataUser = await createUser.json()

    if (dataUser.errors) {
      return ctx.reply(`❌ Gagal create user\n${dataUser.errors[0].detail}`)
    }

    const userId = dataUser.attributes.id

    // ======================
    // CREATE SERVER
    // ======================

    const createServer = await fetch("https://alluffystore.alluffystore.my.id/api/application/servers", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer ptla_u6FGXOhvWXwKsDbRnLshR3n3Qh78j5jweickYH2fkvP"
      },
      body: JSON.stringify({
        name,
        user: userId,
        egg: 15,
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
        startup: "npm start",

        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },

        limits: {
          memory: ram,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu
        },

        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 5
        },

        deploy: {
          locations: [1],
          dedicated_ip: false,
          port_range: []
        }
      })
    })

    const dataServer = await createServer.json()

    if (dataServer.errors) {
      return ctx.reply(`❌ Gagal create server\n${dataServer.errors[0].detail}`)
    }

    const server = dataServer.attributes

    await ctx.reply(
`✅ PANEL BERHASIL DIBUAT

🆔 Server ID: ${server.id}

👤 Username: ${username}
🔑 Password: ${password}

📦 Paket: ${data}

🧠 RAM: ${ram} MB
💾 Disk: ${disk} MB
⚡ CPU: ${cpu}%

🌐 Login:
https://alluffystore.alluffystore.my.id`
    )
  }

  // =========================
  // STOP JIKA EXPIRED
  // =========================
  if (check.status === "EXPIRED") {
    clearInterval(checker)

    return ctx.reply("❌ Invoice expired")
  }

  // =========================
  // STOP SETELAH 2 MENIT
  // =========================
  if (Date.now() - startTime > maxTime) {
    clearInterval(checker)

    return ctx.reply("⌛ Auto check dihentikan")
  }

}, intervalTime)
}

module.exports = {
  panelLegal,
  buyFormPanelLegal,
  buyPanelLegal
}