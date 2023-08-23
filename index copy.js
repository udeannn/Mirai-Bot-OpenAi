// Menampahkan Dependencies
const {
    default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const { state, saveState } = useSingleFileAuthState("./login.json");



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
    console.log(response.data.choices[0].text)
    return response.data.choices[0].text;

}






// Fungsi Utama Mirai Bot
async function connectToWhatsApp() {

    //Buat sebuah koneksi baru ke WhatsApp
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        defaultQuertTimeoutMs: undefined
    });

    //Fungsi untuk Mantau Koneksi Update
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

    //Fungsi Untuk Mantau Pesan Masuk
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        console.log("Tipe Pesan: ", type);
        console.log(messages);
        if (type === "notify" && !messages[0].key.fromMe) {
            try {

                //Dapatkan nomer pengirim dan isi pesan
                const senderNumber = messages[0].key.remoteJid;
                let incomingMessages = messages[0].message.conversation;
                if (incomingMessages === "") {
                    incomingMessages = messages[0].message.extendedTextMessage.text;
                }
                incomingMessages = incomingMessages.toLowerCase();

                //Dapatkan Info Pesan dari Grup atau Bukan 
                //Dan Pesan Menyebut bot atau Tidak
                const isMessageFromGroup = senderNumber.includes("@g.us");
                const isMessageMentionBot = incomingMessages.includes("@6282126083338");
                const prefix = incomingMessages.startsWith('halo mirai')

                //Tampilkan nomer pengirim dan isi pesan
                console.log("Nomer Pengirim:", senderNumber);
                console.log("Isi Pesan:", incomingMessages);

                //Tampilkan Status Pesan dari Grup atau Bukan
                //Tampilkan Status Pesan Mengebut Bot atau Tidak
                console.log("Apakah Pesan dari Grup? ", isMessageFromGroup);
                console.log("Apakah Pesan Menyebut Bot? ", isMessageMentionBot);

                //Kalo misalkan nanya langsung ke Bot / JAPRI
       


                //Kalo misalkan nanya via Group
                // if (isMessageFromGroup && isMessageMentionBot) {
                if (prefix && isMessageFromGroup) {
                    //Jika ada yang mengirim pesan mengandung kata 'siapa'
                    if (incomingMessages.includes('siapa') && incomingMessages.includes('kamu')) {
                        await sock.sendMessage(
                            senderNumber,
                            { text: "Saya Mirai Istrinya Syafa" },
                            { quoted: messages[0] },
                            2000
                        );
                    } else {

                        
                    async function main() {
                        try {
                            const result = await generateResponse(incomingMessages);
                            console.log(result);
                            await sock.sendMessage(
                                senderNumber,
                                { text: result + "\n\n" },
                                { quoted: messages[0] },
                                2000
                            );
                        } catch (error) {
                            console.log('error di function main')
                            console.log(error)
                        }
                    }
                        
                       await main();
                    }
                }



            } catch (error) {
                console.log('=====')
                console.log(error);
            }
        }
    });

}

connectToWhatsApp().catch((err) => {
    console.log("Ada Error: " + err);
});
