async function panel(ctx) {
  
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
}

async function buyPanelLegalOnText(ctx, session) {

  const id = ctx.from.id

  // USER INPUT USERNAME
  if (ctx.message) {

    const username = ctx.message.text

    session[id] = {
      action: "buy_panel_legal",
      username
    }

    console.log(session)

    return await ctx.reply(`Username: ${username}`, {
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
          [{ text: "unli - 15000", callback_data: "unli" }]
        ]
      }
    })
  }

  // CALLBACK BUTTON
  if (ctx.callbackQuery) {

    const ram = ctx.callbackQuery.data

    console.log("RAM:", ram)
    console.log("USERNAME:", session[id].username)

    return await ctx.reply(
      `Menuju Pembayaran\n\nUsername: ${session[id].username}\nRam: ${ram}`
    )
  }
}

async function buyPanelbiasaOnText(ctx, session) {

  const id = ctx.from.id

  // USER INPUT USERNAME
  if (ctx.message) {

    const username = ctx.message.text

    session[id] = {
      action: "buy_panel_biasa",
      username
    }

    console.log(session)

    return await ctx.reply(`Username: ${username}`, {
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
          [{ text: "unli - 15000", callback_data: "unli" }]
        ]
      }
    })
  }

  // CALLBACK BUTTON
  if (ctx.callbackQuery) {

    const ram = ctx.callbackQuery.data

    console.log("RAM:", ram)
    console.log("USERNAME:", session[id].username)

    return await ctx.reply(
      `Menuju Pembayaran\n\nUsername: ${session[id].username}\nRam: ${ram}`
    )
  }
}



module.exports = {
  panel,
  buyPanelLegalOnText,
  buyPanelbiasaOnText
}