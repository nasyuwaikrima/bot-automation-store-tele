const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, REQUIRED_CHANNEL, START_IMAGE_URL, OWNER_ID } = require('./config');
const {
  panelLegal,
  menu,
  panel,
  product,
  buyFormPanelLegal,
  buyFormAdpLegal,
  panelbiasa,
  buyFormPanelbiasa,
  buyPanelLegal,
  buyPanelLegalOnText,
  buyPanelbiasaOnText,
  buyPanelbiasa,
  buyAdpLegal,
  buyAdpLegalOnText,
  buyFormAdpbiasa,
  buyAdpbiasaOnText,
  buyAdpbiasa
} = require('./lib/module.components')

const bot = new Telegraf(BOT_TOKEN);

const session = {}


//const input = ctx.message.text.split(' ').slice(1).join(' ').trim();

console.log("bot aktif")
// /start — support grup & pribadi + font stylish


bot.start(async (ctx) => {
  await menu(ctx, Markup, START_IMAGE_URL)
})

bot.command('menu', async (ctx) => {
  await menu(ctx, Markup, START_IMAGE_URL)
})

bot.on("callback_query", async (ctx) => {

  const data = ctx.callbackQuery.data

  switch (data) {

    case "produk":
      await ctx.answerCbQuery("Menu Produk")
      await product(ctx)
    break

    case "panel":
      await panel(ctx)
    break
    
    case "panel_legal": {
      await panelLegal(ctx)
    }
    break
    
    case 'batalkan': {
      await ctx.reply("pembayaran dibatalkan")
      await ctx.reply(".................")
      await menu(ctx, Markup, START_IMAGE_URL)
    }
    break
    
    case "buy_panel_legal":
    await buyFormPanelLegal(ctx, session)
    break
    
    case "buy_adp_legal": {
      await buyFormAdpLegal(ctx, session)
    }
    
    case "buy_adp_biasa": {
      await buyFormAdpbiasa(ctx, session)
    }
    
    break
    
    case "panel_biasa": {
     return await panelbiasa(ctx)
    }
    break
    
    case "buy_adp_biasas": {
      const id = ctx.from.id


  if (!session[id]) return
  
  await buyAdpbiasa(ctx, session, Markup)
    }
    
    break
    
    case "buy_adp_legals": {
      const id = ctx.from.id


  if (!session[id]) return
  
  await buyAdpLegal(ctx, session, Markup)
    }
    
    break
    
    
    case "buy_panel_biasa":
    await buyFormPanelbiasa(ctx, session)
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
case "unli": {

  const id = ctx.from.id
  const ram = ctx.callbackQuery.data

  console.log(session)

  if (!session[id]) return

  switch (session[id].action) {

    case "buy_panel_legal": {

      await buyPanelLegal(ctx, session, ram, Markup)
}
    break
    
    case "buy_panel_biasa": {

      await buyPanelbiasa(ctx, session, ram, Markup)
}
    break
  }

}

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
      await menu(ctx, Markup, START_IMAGE_URL)
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

    case "buy_panel_legal": {

      await buyPanelLegalOnText(ctx, session)
    }
    break
    
    case "buy_panel_biasa": {

      await buyPanelbiasaOnText(ctx, session)
    }
    break
    case "buy_adp_legal": {
      await buyAdpLegalOnText(ctx, session)

    }
    break
    
    case "buy_adp_biasa": {
      await buyAdpbiasaOnText(ctx, session)

    }
    break
  }
})



bot.launch();