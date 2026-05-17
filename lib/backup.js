const fs = require("fs")
const archiver = require("archiver")

async function backupBot() {

  return new Promise((resolve, reject) => {

    const output = fs.createWriteStream("./backup.zip")

    const archive = archiver("zip", {
      zlib: { level: 9 }
    })

    output.on("close", () => {
      resolve("./backup.zip")
    })

    archive.on("error", (err) => {
      reject(err)
    })

    archive.pipe(output)

    archive.glob("**/*", {
      ignore: [
        "node_modules/**",
        ".git/**",
        "backup.zip"
      ]
    })

    archive.finalize()

  })

}

module.exports = {
  backupBot
}