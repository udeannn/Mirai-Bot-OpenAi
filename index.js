//Adding Dependencies
require('./settings')
const {
    default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState,
    downloadMediaMessage 
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const chalk = require('chalk');
const { state, saveState } = useSingleFileAuthState("./login.json");
const fs = require('fs')
const axios = require('axios')

//Bagian Koding ChatGPT
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: 'YOUR API KEY',
});
const openai = new OpenAIApi(configuration);

//Fungsi OpenAI ChatGPT untuk Mendapatkan Respon
async function generateResponse(text) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });
    //console.log(response.data.choices[0].text)
    return response.data.choices[0].text;

}

//Main Functions of Mirai WA Bot
async function connectToWhatsApp() {

    //Create a new connection to WhatsApp
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        defaultQuertTimeoutMs: undefined
    });

    //Function to Monitor Connection Updates
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Koneksi terputus karena ", lastDisconnect.error, ", hubugkan kembali!", shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === "open") {
            console.log("Koneksi tersambung!")
        }
    });
    sock.ev.on("creds.update", saveState);

    //Function To Monitor Incoming Messages
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        // console.log("Tipe Pesan: ", type);
        // console.log(messages);
        if (type === "notify" && !messages[0].key.fromMe) {
            try {

                //Get the sender's number and message content
                const senderNumber = messages[0].key.remoteJid;
                let incomingMessages = messages[0].message.conversation;
                if (incomingMessages === "") {
                    incomingMessages = messages[0].message.extendedTextMessage.text;
                }
                incomingMessages = incomingMessages.toLowerCase();
		console.log(messages[0]);
                
                //Get the sender number name
                const senderName = messages[0].pushName;

                //Get Message Info from Group or No
                let isMessageFromGroup = senderNumber.includes("@g.us");
                let senderNumberparticipant = ''
                if (isMessageFromGroup) {
                    senderNumberparticipant = messages[0].key.participant;
                }

                //prefix
                let cmdAi = incomingMessages.startsWith(prefixAi)
                let cmd = incomingMessages.startsWith(prefix)

                //join prefix with command
                let command = cmd ? incomingMessages.slice(1).trim().split(' ')[0].toLowerCase() : ''

                //Show Message in Console
                console.log("=> Time", new Date + '\n' + chalk.black(chalk.bgWhite("=> Message")), incomingMessages + '\n' + "=> From ", senderName, isMessageFromGroup ? "(Group Chat)" : "(Private Chat)", senderNumber)

                //--------------------Bagian Utama Coding Dibawah Ini---------------------------

                //For example, ask via Group
                if (isMessageFromGroup) {

                    switch (command) {
                        //✦ *MAIN* ✦
                        case 'menu':{
                            await sock.sendMessage(
                                senderNumber,
                                { 
                                    image: thumbnail, 
                                    caption: `
✦━━ *ALL COMMANDS* ━━✦

✦ *MAIN* ✦
> ❀ ${prefix}menu

✦ *CONVERT* ✦
> ❀ ${prefix}sticker (Working)

✦ *ANIME* ✦
> ❀ ${prefix}waifu

✦ *FUN* ✦
> ❀ ${prefix}stress <character> <country>
> ❀ ${prefix}stress2 <character>

✦ *AI* ✦
> Silakan kirim pesan dengan mengandung kata "mirai" di dalam pesan tersebut 

                                    `
                                },
                                { quoted: messages[0] },
                                2000
                            );
                        }
                            break;

                        //✦ *CONVERT* ✦
                        case 'sticker':{
                            await sock.sendMessage(
                                senderNumber,
                                { text: "Maaf kak " + senderName + " fitur ini masih tahap pengerjaan" },
                                { quoted: messages[0] },
                                2000
                            );
                        }
                    
                        //✦ *ANIME* ✦
                        case 'waifu':{
                            let image = await axios.get('https://api.waifu.pics/sfw/waifu')
                            await sock.sendMessage(
                                senderNumber,
                                { 
                                    image: {url: image.data.url}, 
                                    caption: `Wangy wangy...`
                                },
                                { quoted: messages[0] },
                                2000
                            );
                        }

                        // case 'nsfwwaifu':{
                        //     let image = await axios.get('https://waifu.pics/api/nsfw/waifu')
                        //     await sock.sendMessage(
                        //         senderNumber,
                        //         { 
                        //             image: {url: image.data.url}, 
                        //             caption: `Wangy wangy...`
                        //         },
                        //         { quoted: messages[0] },
                        //         2000
                        //     );
                        // }
                        
                        //✦ *FUN* ✦
                        case 'stress':{
                            let getCharacter = incomingMessages.split(' ')[1].toUpperCase()
                            let getCountry = incomingMessages.split(' ')[2].toUpperCase()

                            let m = `
WAH INI DIAAAAAA SISTEM ALAT TEMPUR MUTAKHIR DARI *${getCountry}* YANG DAPAT MEMPORAK-PORANDAKAN KETAHANAN SYAHWAT REPUBLIK INDONESIA 🇮🇩🇮🇩 😍😍😍😍😍!!!!

APABILA KALIAN PERHATIKAN 👀 NIH YA GAYSHH, SECARA ONDERDIL 👙 BIBIT BEBET BOBOT DARI SEORANG GADIS 😱😱😱 BERNAMA *${getCharacter}* ITU MEMANG DICIPTAKAN SEBAGAI SALAH SATU BENTUK KESEMPURNAAN ILAHI!! ITU LAH MENGAPA DUNIA INI BEGITU KEJAM, KARENA DUNIA DICIPTAKAN SEIMBANG DAN INI LAH KESUCIAN ALAM YANG BEGITU RANUM DAN SEMOK UNTUK MENGIMBANGI KERASNYA DUNIA FANA!

ADUHHHHHHHHHHH ADUHHHHHHHH  HAMIL GAK LUUUUU 🤰🤰🤰🤰🤰 !!!!!!!!!!! ANJINGGGGGGGGGGGGGGGGGG 🥵🥵🥵🥵🥵🥵🥵!!!!!!!!!!!! BREKETEK WEKEWEK WEK HYAHHHH JURUS POMPA HAMIL 😭😭😭😭😭😭😭😭😭😭!!!!!!!!!
                            `
                            await sock.sendMessage(
                                senderNumber,
                                { text: m},
                                { quoted: messages[0] },
                                2000
                            );
                        }
                            break;

                        case 'stress2':{
                            let getCharacter = incomingMessages.split(' ')[1].toUpperCase()

                            let m = `
Lu lihat karakter fiksi ini?
Gue tidak takut untuk mengakui bahwa gue telah kehilangan belasan liter calon anak gueh karena karakter fantasi belaka.
Bukankah lucu bagaimana bahkan gadis sungguhan pun tidak membuat gue bergairah seperti halnya *${getCharacter}*? Gue telah membunuh jutaan calon keturunan gue dengan pemikiran melakukan hubungan badan dengan tokoh kartun, tokoh yang dibentuk oleh pemikiran manusia. Siapa tahu, mungkin saja ada calon ilmuwan yang bisa menyembuhkan kanker, seorang insinyur yang bisa mendemonstrasikan terraforming di planet Mars, atau bahkan calon presiden Amerika Serikat di masa depan di antara mereka yang sekarang menempel pada sehelai tisu ini.
Tak perlu dikatakan, gue TIDAK menyesal sama sekali. Dia adalah perwujudan dari kesempurnaan literal. Gue sanggup meyakinkan lu semua bahwa gue akan terus berfantasi tentang dia dan tidak akan berhenti dalam waktu dekat. Apa menurut lu fakta bahwa dia tidak nyata sebenarnya adalah penghalang terbesar bagi gue? Hell no. Gue telah melatih lucid dreaming dan proyeksi astral untuk menyeberang antara dunia manusia dan dimensi anime untuk akhirnya bertemu dengannya. Kami pergi ke McDonalds selama perjalanan lintas dimensi gue baru-baru ini, tetapi sayangnya gue harus bangun dan pergi ke pekerjaan gue yang berupah minimum. Saat ini, gue sedang merancang tulpa untuk membawanya ke dunia manusia. *${getCharacter}* mungkin tidak nyata bagi lu, tapi dia akan segera hadir untuk gue seorang.
                            `
                            await sock.sendMessage(
                                senderNumber,
                                { text: m},
                                { quoted: messages[0] },
                                2000
                            );
                        }
                            break;

                        case 'mirai':{
                            await sock.sendMessage(
                                senderNumber,
                                { 
                                    video: fs.readFileSync("assets/mirai.mp4"), 
                                    caption: "hello aku Mirai istrinya Syafa",
                                    gifPlayback: true
                                },
                                2000
                            );
                        }
                            break;

			 //*AI* ✦
			//case 'ai':{
			    //const result = await generateResponse(incomingMessages);
                            //await sock.sendMessage(
                            	//senderNumber,
                            	//{ text: result + "\n\n" },
                            	//{ quoted: messages[0] },
                            //2000
                        //);
                        //}
                            //break;
                    
                        default:
                            // await sock.sendMessage(
                            //     senderNumber,
                            //     { text: "no comments " + senderName },
                            //     { quoted: messages[0] },
                            //     2000
                            // );
			if (incomingMessages.includes('mirai')) {
			    incomingMessages = incomingMessages.replace("mirai", "");
                            const result = await generateResponse(incomingMessages);
                            await sock.sendMessage(
                            	senderNumber,
                            	{ text: result + "\n\n" },
                            	{ quoted: messages[0] },
                            	2000
                            );
                    	}
                            break;
                    }
                   
                }

            //untuk bagian error
            } catch (error) {
                console.log(error);
            }
        }
    });

}

connectToWhatsApp().catch((err) => {
    console.log("Ada Error: " + err);
});


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
