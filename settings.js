const fs = require('fs')
const chalk = require('chalk')

//prefix
global.prefixAi = 'halo mirai'
global.prefix = '-'

//Bot theme media
global.thumbnail = fs.readFileSync("./assets/mirails.jpg") //ur thumbnail pic


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})