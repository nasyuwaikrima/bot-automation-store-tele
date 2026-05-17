const fs = require("fs")
const path = require("path")

const Payment = require("./payment")
const payment = new Payment()

async function buyScriptMenu(ctx, Markup) {

  const scriptPath = path.join(__dirname, "..", "script")

const files = fs.readdirSync(scriptPath)

  const zipFiles = files.filter(v => v.endsWith(".zip"))

  if (zipFiles.length < 1) {
    return ctx.reply("Script kosong")
  }

  const buttons = zipFiles.map(file => {
    return [
      Markup.button.callback(
        `Beli ${file}`,
        `buy_script_${file}`
      )
    ]
  })

  await ctx.reply(
  `List Script:

${zipFiles.map((v, i) => `${i + 1}. ${v}`).join("\n")}`,
  Markup.inlineKeyboard(buttons)
)
}

async function buyScript(ctx, fileName, Markup) {

  const filePath = path.join(__dirname, "..", "script", fileName)

  if (!fs.existsSync(filePath)) {
    return ctx.reply("Script tidak ditemukan")
  }

  const amount = 10000

  await ctx.answerCbQuery("Membuat pembayaran...")

  const pay = await payment.createQris(amount)

  if (!pay.success) {
    return ctx.reply(pay.message)
  }

  const buffer = Buffer.from(
    pay.qr.replace(/^data:image\/png;base64,/, ""),
    "base64"
  )

  const msg = await ctx.replyWithPhoto(
    { source: buffer },
    {
      caption:
`🧾 Invoice: ${pay.invoice}

📦 Script: ${fileName}

💰 Amount: Rp${pay.amount}
📌 Status: ⏳ Pending`,
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "Check Status",
            `cekscript_${pay.invoice}_${fileName}`
          )
        ]
      ]).reply_markup
    }
  )

  let paid = false

  const interval = setInterval(async () => {

    try {

      if (paid) return

     // const check = await payment.status(pay.invoice)
const check = {
  success: true,
  status: "SETTLED",
  invoice: pay.invoice,
  amount: amount
}
      if (!check.success) return

      let statusText = "⏳ Pending"

      if (check.status === "SETTLED") {
        statusText = "✅ Lunas"
      }

      if (check.status === "EXPIRED") {
        statusText = "❌ Expired"
      }

      try {

        await ctx.telegram.editMessageCaption(
          msg.chat.id,
          msg.message_id,
          null,
`🧾 Invoice: ${check.invoice}

📦 Script: ${fileName}

💰 Amount: Rp${check.amount}
📌 Status: ${statusText}`,
          {
            reply_markup: Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "Refresh",
                  `cekscript_${check.invoice}_${fileName}`
                )
              ]
            ]).reply_markup
          }
        )

      } catch (e) {}

      if (check.status === "SETTLED") {

        paid = true

        clearInterval(interval)

        await ctx.reply("✅ Pembayaran diterima")

        await ctx.replyWithDocument({
          source: filePath,
          filename: fileName
        })

      }

      if (check.status === "EXPIRED") {

        clearInterval(interval)

        return ctx.reply("❌ Invoice expired")
      }

    } catch (err) {

      console.log(err)

      clearInterval(interval)

      ctx.reply("❌ Error payment")
    }

  }, 10000)
}

module.exports = {
  buyScriptMenu,
  buyScript
}