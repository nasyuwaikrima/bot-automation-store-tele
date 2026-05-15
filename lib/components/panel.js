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
          callback_data: "tek"
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
  panel
}