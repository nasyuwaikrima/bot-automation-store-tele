const Payment = require("../payment")
const payment = new Payment()

const config = require("./adp.json")


const config = require("../../config.json")

const apiBiasa = config.panel_biasa.api
const urlBiasa = config.panel_biasa.url


async function buyAdpbiasa(ctx, session, Markup) {

  const id = ctx.from.id
  const username = session[id]?.username

  if (!username) {
    return ctx.reply("❌ Username tidak ditemukan")
  }

  const email = `${username}@gmail.com`
  const password = `${username}001`

  const amount = config.biasa.harga

  await ctx.answerCbQuery("Membuat pembayaran...")

  // ======================
  // CREATE PAYMENT
  // ======================

  const pay = await payment.createQris(amount)

  if (!pay.success) {
    return ctx.reply(pay.message)
  }

  await ctx.editMessageText("✅ QRIS berhasil dibuat")

  const buffer = Buffer.from(
    pay.qr.replace(/^data:image\/png;base64,/, ""),
    "base64"
  )

  // ======================
  // SEND QR
  // ======================

  const msg = await ctx.replyWithPhoto(
    { source: buffer },
    {
      caption:
`🧾 Invoice: ${pay.invoice}
👤 Username: ${username}

💰 Amount: Rp${pay.amount}
⏰ Expired: ${pay.expired}

📌 Status: ⏳ Pending`,
      reply_markup: Markup.inlineKeyboard([
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
      ]).reply_markup
    }
  )

  // ======================
  // AUTO CHECK
  // ======================

  const intervalTime = 10000
  const maxTime = 2 * 60 * 1000

  const startTime = Date.now()

  let paid = false

  const interval = setInterval(async () => {

    try {

      if (paid) return

      // ======================
      // CHECK STATUS
      // ======================

      const check = await payment.status(pay.invoice)
      /*
const check = {
  success: true,
  status: "SETTLED",
  invoice: pay.invoice,
  amount: amount
}
*/
      if (!check.success) return

      let statusText = "UNKNOWN"

      if (check.status === "PENDING") {
        statusText = "⏳ Pending"
      }

      if (check.status === "SETTLED" && !paid) {

  paid = true

  clearInterval(interval)

  await ctx.reply("✅ Pembayaran diterima")
}
      if (check.status === "EXPIRED") {
        statusText = "❌ Expired"
      }

      console.log("STATUS:", check.status)

      // ======================
      // UPDATE CAPTION
      // ======================

      try {

        await ctx.telegram.editMessageCaption(
          msg.chat.id,
          msg.message_id,
          null,
`🧾 Invoice: ${check.invoice}
💰 Amount: Rp${check.amount}

📌 Status: ${statusText}`,
          {
            reply_markup: Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "Refresh Status",
                  `cek_${check.invoice}`
                )
              ]
            ]).reply_markup
          }
        )

      } catch (e) {}

      // ======================
      // PAYMENT SUCCESS
      // ======================

      if (check.status === "SETTLED") {

        paid = true

        clearInterval(interval)

        await ctx.reply(
          "✅ Pembayaran diterima\n⏳ Sedang membuat admin panel..."
        )

        try {

          // ======================
          // CREATE ADMIN
          // ======================

          const createUser = await fetch(
            `${urlBiasa}/api/application/users`,
            {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiLegal}`
              },
              body: JSON.stringify({
                email,
                username,
                first_name: username,
                last_name: "Admin",
                root_admin: true,
                language: "en",
                password
              })
            }
          )

          const dataUser = await createUser.json()

          if (dataUser.errors) {

            return ctx.reply(
              `❌ Gagal create admin\n${dataUser.errors[0].detail}`
            )
          }

          const user = dataUser.attributes

          // ======================
          // SUCCESS
          // ======================

          await ctx.reply(
`✅ ADMIN PANEL BERHASIL DIBUAT

🆔 Admin ID: ${user.id}

👤 Username: ${username}
📧 Email: ${email}
🔑 Password: ${password}

🛡️ Role: Root Admin

🌐 Login: ${urlBiasa}`
          )

        } catch (err) {

          console.log(err)

          ctx.reply(
            "❌ Terjadi kesalahan saat membuat admin"
          )
        }
      }

      // ======================
      // EXPIRED
      // ======================

      if (check.status === "EXPIRED") {

        clearInterval(interval)

        return ctx.reply(
          "❌ Invoice expired"
        )
      }

      // ======================
      // TIMEOUT
      // ======================

      if (Date.now() - startTime > maxTime) {

        clearInterval(interval)

        return ctx.reply(
          "⌛ Auto check dihentikan"
        )
      }

    } catch (err) {

      console.log(err)

      clearInterval(interval)

      ctx.reply("❌ Error auto check payment")
    }

  }, intervalTime)
}

async function buyFormAdpbiasa(ctx, session) {

  session[ctx.from.id] = {
    action: "buy_adp_biasa"
  }

  await ctx.reply(
    "Masukkan username admin panel:",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Batalkan",
              callback_data: "batalkan"
            }
          ]
        ]
      }
    }
  )
}

module.exports = {
  buyAdpbiasa,
  buyFormAdpbiasa
}