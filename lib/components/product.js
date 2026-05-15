async function product(ctx) {
  await ctx.answerCbQuery("Menu Panel")
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: "Buy Panel",
          callback_data: "panel"
        },
        {
          text: "Push ch [V8]",
          callback_data: "pushch"
        }
      ],
      [
        {
          text: "Apk Prem",
          callback_data: "apkprem"
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

module.exports = {
  product
}