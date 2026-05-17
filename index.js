const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, REQUIRED_CHANNEL, START_IMAGE_URL, OWNER_ID, AUTO_BACKUP } = require('./config');
const { backupBot } = require("./lib/backup")
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

const fs = require("fs");
const path = require("path");
const https = require("https");

const bot = new Telegraf(BOT_TOKEN);

const session = {}
const {
  buyScriptMenu,
  buyScript
} = require("./lib/buyscript")

//const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
const config = require("./config.json")

const apiLegal = config.panel_legal.api
const urlLegal = config.panel_legal.url

const apiBiasa = config.panel_biasa.api
const urlBiasa = config.panel_biasa.url
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
if (data.startsWith("buy_script_")) {

  const fileName = data.replace("buy_script_", "")

  await buyScript(ctx, fileName, Markup)
}

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
    
    case "setting_panel": {

  await ctx.reply(
    "SETTING PANEL\n\nPilih panel.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "PANEL LEGAL", callback_data: "setting_legal" }
          ],
          [
            { text: "PANEL BIASA", callback_data: "setting_biasa" }
          ]
        ]
      }
    }
  )

}
break

case "setting_panel_legal": {

  await ctx.reply(
    "SETTING PANEL LEGAL",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "SET API", callback_data: "set_api_legal" },
            { text: "SET URL", callback_data: "set_url_legal" }
          ]
        ]
      }
    }
  )

}
break

case "setting_panel_biasa": {

  await ctx.reply(
    "SETTING PANEL BIASA",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "SET API", callback_data: "set_api_biasa" },
            { text: "SET URL", callback_data: "set_url_biasa" }
          ]
        ]
      }
    }
  )

}
break

case "set_api_legal": {

  session[ctx.from.id] = {
    action: "set_api_legal"
  }

  await ctx.reply("Kirim API panel legal.")
}
break

case "set_url_legal": {

  session[ctx.from.id] = {
    action: "set_url_legal"
  }

  await ctx.reply("Kirim URL panel legal.")
}
break

case "set_api_biasa": {

  session[ctx.from.id] = {
    action: "set_api_biasa"
  }

  await ctx.reply("Kirim API panel biasa.")
}
break

case "set_url_biasa": {

  session[ctx.from.id] = {
    action: "set_url_biasa"
  }

  await ctx.reply("Kirim URL panel biasa.")
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

bot.command("buyscript", async (ctx) => {
  await buyScriptMenu(ctx, Markup)
})

bot.command("settingpanel", async (ctx) => {
  if (String(ctx.from.id) !== String(OWNER_ID)) {
  return ctx.reply("Khusus owner utama.")
}

  await ctx.reply(
    "SETTING PANEL\n\nPilih panel yang mau diatur.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "PANEL LEGAL",
              callback_data: "setting_panel_legal"
            }
          ],
          [
            {
              text: "PANEL BIASA",
              callback_data: "setting_panel_biasa"
            }
          ]
        ]
      }
    }
  )

})

bot.command("backup", async (ctx) => {

  if (String(ctx.from.id) !== String(OWNER_ID)) {
    return ctx.reply("Lu siapa anjir")
  }

  await ctx.reply("Sedang backup...")

  const file = await backupBot()

  await ctx.replyWithDocument({
    source: file
  })

})

bot.command("addscript", async (ctx) => {
  const id = ctx.from.id

  if (id != OWNER_ID) {
    return ctx.reply("Lu siapa nyet")
  }

  session[id] = {
    action: "add_script"
  }

  ctx.reply("Kirim file zip script sekarang")
})

bot.on("document", async (ctx) => {
  const id = ctx.from.id

  if (id != OWNER_ID) return

  if (!session[id]) return

  if (session[id].action !== "add_script") return

  const file = ctx.message.document

  if (!file.file_name.endsWith(".zip")) {
    return ctx.reply("Harus file zip goblok")
  }

  const fileLink = await ctx.telegram.getFileLink(file.file_id)

  const filePath = path.join(__dirname, "script", file.file_name)

  https.get(fileLink.href, (res) => {
    const stream = fs.createWriteStream(filePath)

    res.pipe(stream)

    stream.on("finish", () => {
      stream.close()

      delete session[id]

      ctx.reply(`Script berhasil disimpan:\n${file.file_name}`)
    })
  })
})

bot.command("addowner", async (ctx) => {
  if (String(ctx.from.id) !== String(OWNER_ID)) {
  return ctx.reply("Khusus owner utama.")
}

  const input = ctx.message.text.split(" ")[1]

  if (!input) {
    return ctx.reply("Contoh:\n/addowner 123456")
  }

  if (db.owner.includes(input)) {
    return ctx.reply("User sudah jadi owner.")
  }

  db.owner.push(input)

  fs.writeFileSync(
    "./database.json",
    JSON.stringify(db, null, 2)
  )

  ctx.reply(`Berhasil tambah owner:\n${input}`)

})

bot.command("addprem", async (ctx) => {
  if (String(ctx.from.id) !== String(OWNER_ID)) {
  return ctx.reply("Khusus owner utama.")
}

  const input = ctx.message.text.split(" ")[1]

  if (!input) {
    return ctx.reply("Contoh:\n/addprem 123456")
  }

  if (db.premium.includes(input)) {
    return ctx.reply("User sudah premium.")
  }

  db.premium.push(input)

  fs.writeFileSync(
    "./database.json",
    JSON.stringify(db, null, 2)
  )

  ctx.reply(`Berhasil tambah premium:\n${input}`)

})

bot.command("delowner", async (ctx) => {
  if (String(ctx.from.id) !== String(OWNER_ID)) {
    return ctx.reply("Khusus owner utama.")
  }

  const input = ctx.message.text.split(" ")[1]

  if (!input) {
    return ctx.reply("Contoh:\n/delowner 123456")
  }

  if (!db.owner.includes(input)) {
    return ctx.reply("User bukan owner.")
  }

  db.owner = db.owner.filter(id => id !== input)

  fs.writeFileSync(
    "./database.json",
    JSON.stringify(db, null, 2)
  )

  ctx.reply(`Berhasil hapus owner:\n${input}`)
})


bot.command("delprem", async (ctx) => {
  if (String(ctx.from.id) !== String(OWNER_ID)) {
    return ctx.reply("Khusus owner utama.")
  }

  const input = ctx.message.text.split(" ")[1]

  if (!input) {
    return ctx.reply("Contoh:\n/delprem 123456")
  }

  if (!db.premium.includes(input)) {
    return ctx.reply("User bukan premium.")
  }

  db.premium = db.premium.filter(id => id !== input)

  fs.writeFileSync(
    "./database.json",
    JSON.stringify(db, null, 2)
  )

  ctx.reply(`Berhasil hapus premium:\n${input}`)
})

const ackages = {
  "1gb": { ram: 1000, disk: 1000, cpu: 40 },
  "2gb": { ram: 2000, disk: 2000, cpu: 60 },
  "3gb": { ram: 3000, disk: 3000, cpu: 80 },
  "4gb": { ram: 4000, disk: 4000, cpu: 100 },
  "5gb": { ram: 5000, disk: 5000, cpu: 120 },
  "6gb": { ram: 6000, disk: 6000, cpu: 140 },
  "7gb": { ram: 7000, disk: 7000, cpu: 160 },
  "8gb": { ram: 8000, disk: 8000, cpu: 180 },
  "9gb": { ram: 9000, disk: 9000, cpu: 200 },
  "unli": { ram: 0, disk: 0, cpu: 0 }
}

async function createPanel(ctx, paket) {

  if (String(ctx.from.id) !== String(OWNER_ID)) {
    return ctx.reply("Khusus owner utama.")
  }

  const args = ctx.message.text.split(" ")
  const username = args[1]

  if (!username) {
    return ctx.reply(`Contoh:\n/${paket} nasyuwa`)
  }

  const email = `${username}@gmail.com`
  const password = `${username}001`

  const { ram, disk, cpu } = packages[paket]

  // ======================
  // CREATE USER
  // ======================

  const createUser = await fetch(
    `${urlBiasa}/api/application/users`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiBiasa}`
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: "Server",
        language: "en",
        password
      })
    }
  )

  const dataUser = await createUser.json()

  if (dataUser.errors) {
    return ctx.reply(
      `❌ Gagal create user\n${dataUser.errors[0].detail}`
    )
  }

  const userId = dataUser.attributes.id

  // ======================
  // CREATE SERVER
  // ======================

  const createServer = await fetch(
    `${urlBiasa}/api/application/servers`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiBiasa}`
      },
      body: JSON.stringify({
        name: username,
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
    }
  )

  const dataServer = await createServer.json()

  if (dataServer.errors) {
    return ctx.reply(
      `❌ Gagal create server\n${dataServer.errors[0].detail}`
    )
  }

  const server = dataServer.attributes

  ctx.reply(
`✅ PANEL BERHASIL DIBUAT

🆔 Server ID: ${server.id}

👤 Username: ${username}
🔑 Password: ${password}

📦 Paket: ${paket}

🧠 RAM: ${ram === 0 ? "Unlimited" : ram + " MB"}
💾 Disk: ${disk === 0 ? "Unlimited" : disk + " MB"}
⚡ CPU: ${cpu === 0 ? "Unlimited" : cpu + "%"}

🌐 Login: ${urlBiasa}`
  )
}

// COMMAND
bot.command("1gb", (ctx) => createPanel(ctx, "1gb"))
bot.command("2gb", (ctx) => createPanel(ctx, "2gb"))
bot.command("3gb", (ctx) => createPanel(ctx, "3gb"))
bot.command("4gb", (ctx) => createPanel(ctx, "4gb"))
bot.command("5gb", (ctx) => createPanel(ctx, "5gb"))
bot.command("6gb", (ctx) => createPanel(ctx, "6gb"))
bot.command("7gb", (ctx) => createPanel(ctx, "7gb"))
bot.command("8gb", (ctx) => createPanel(ctx, "8gb"))
bot.command("9gb", (ctx) => createPanel(ctx, "9gb"))
bot.command("unli", (ctx) => createPanel(ctx, "unli"))


async function createPanelV2(ctx, paket) {

  if (String(ctx.from.id) !== String(OWNER_ID)) {
    return ctx.reply("Khusus owner utama.")
  }

  const args = ctx.message.text.split(" ")
  const username = args[1]

  if (!username) {
    return ctx.reply(`Contoh:\n/${paket} nasyuwa`)
  }

  const email = `${username}@gmail.com`
  const password = `${username}001`

  const { ram, disk, cpu } = packages[paket]

  // ======================
  // CREATE USER
  // ======================

  const createUser = await fetch(
    `${urlLegal}/api/application/users`,
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
        last_name: "Server",
        language: "en",
        password
      })
    }
  )

  const dataUser = await createUser.json()

  if (dataUser.errors) {
    return ctx.reply(
      `❌ Gagal create user\n${dataUser.errors[0].detail}`
    )
  }

  const userId = dataUser.attributes.id

  // ======================
  // CREATE SERVER
  // ======================

  const createServer = await fetch(
    `${urlLegal}/api/application/servers`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiLegal}`
      },
      body: JSON.stringify({
        name: username,
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
    }
  )

  const dataServer = await createServer.json()

  if (dataServer.errors) {
    return ctx.reply(
      `❌ Gagal create server\n${dataServer.errors[0].detail}`
    )
  }

  const server = dataServer.attributes

  ctx.reply(
`✅ PANEL BERHASIL DIBUAT

🆔 Server ID: ${server.id}

👤 Username: ${username}
🔑 Password: ${password}

📦 Paket: ${paket}

🧠 RAM: ${ram === 0 ? "Unlimited" : ram + " MB"}
💾 Disk: ${disk === 0 ? "Unlimited" : disk + " MB"}
⚡ CPU: ${cpu === 0 ? "Unlimited" : cpu + "%"}

🌐 Login: ${urlLegal}`
  )
}

// COMMAND
bot.command("1gbv2", (ctx) => createPanelV2l(ctx, "1gb"))
bot.command("2gbv2", (ctx) => createPanelV2(ctx, "2gb"))
bot.command("3gbv2", (ctx) => createPanelV2(ctx, "3gb"))
bot.command("4gbv2", (ctx) => createPanelV2(ctx, "4gb"))
bot.command("5gbv2", (ctx) => createPanelV2(ctx, "5gb"))
bot.command("6gbv2", (ctx) => createPanelV2(ctx, "6gb"))
bot.command("7gbv2", (ctx) => createPanelV2(ctx, "7gb"))
bot.command("8gbv2", (ctx) => createPanelV2(ctx, "8gb"))
bot.command("9gbv2", (ctx) => createPanelV2(ctx, "9gb"))
bot.command("unliv2", (ctx) => createPanelV2(ctx, "unli"))

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
    
    case "set_api_legal": {

  configPanel.panel_legal.api = ctx.message.text

  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configPanel, null, 2)
  )

  delete session[id]

  await ctx.reply("API panel legal berhasil disimpan.")
}
break

case "set_url_legal": {

  configPanel.panel_legal.url = ctx.message.text

  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configPanel, null, 2)
  )

  delete session[id]

  await ctx.reply("URL panel legal berhasil disimpan.")
}
break

case "set_api_biasa": {

  configPanel.panel_biasa.api = ctx.message.text

  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configPanel, null, 2)
  )

  delete session[id]

  await ctx.reply("API panel biasa berhasil disimpan.")
}
break

case "set_url_biasa": {

  configPanel.panel_biasa.url = ctx.message.text

  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configPanel, null, 2)
  )

  delete session[id]

  await ctx.reply("URL panel biasa berhasil disimpan.")
}
break
  }
})


if (!fs.existsSync("./config.json")) {

  fs.writeFileSync("./config.json", JSON.stringify({
    panel_legal: {
      api: "",
      url: ""
    },
    panel_biasa: {
      api: "",
      url: ""
    }
  }, null, 2))

}

const configPanel = require("./config.json")


setInterval(async () => {

  try {

    const file = await backupBot()

    await bot.telegram.sendDocument(
      OWNER_ID,
      {
        source: file
      },
      {
        caption: "Auto backup berhasil."
      }
    )

  } catch (err) {

    console.log(err)

  }

}, AUTO_BACKUP * 60 * 60 * 1000)


if (!fs.existsSync("./script")) {
  fs.mkdirSync("./script");
}


// ===============================
// CREATE DATABASE
// ===============================

if (!fs.existsSync("./database.json")) {

  fs.writeFileSync("./database.json", JSON.stringify({
    owner: [],
    premium: []
  }, null, 2))

}

const db = require("./database.json")


bot.launch();