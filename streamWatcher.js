import fetch from "node-fetch"
import open from "open"
import 'dotenv/config'

const TWITCH_APP_TOKEN = process.env.TWITCH_APP_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
    // ENTER ANY AMOUNT OF STREAMERS (THEIR TWITCH DISPLAY NAME) IN THE ARRAY BELOW FOLLOWING THE SAME SHOWN FORMAT.
const streamers = ['the_happy_hobb', 'zoil', 'pokelawls']

const getLivestreamInfo = async streamer => {

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamer}`, {

            method: 'GET',
            headers: {

                // App token - Increases rate limit (num of requests per minute)
                'Authorization': `Bearer ${TWITCH_APP_TOKEN}`,
                'Client-ID': `${CLIENT_ID}`
            }
        })
        const livestreamInfo = await response.json()
        return livestreamInfo
    } catch (err) {
        console.error("API request failed.");
    }

}

const openWhenLive = streamers => {

    console.log(`Monitoring live status of ${streamers}`);
    const FIVE_MINUTES_IN_MILLISECONDS = 1000
    let justWentLive = false

    // Check live status of streamer every 5 minutes
    const interval = setInterval(async() => {


        for (let i = 0; i < streamers.length; i++) {

            const livestreamInfo = await getLivestreamInfo(streamers[i])
            console.log(livestreamInfo);

            // Only open the stream in the browser if it was offline during the last check.
            if (isStreamerLive(livestreamInfo)) {

                if (!justWentLive) {
                    open(`https://twitch.tv/${streamers[i]}`)
                    console.log(`Live now, detected @ ( ${new Date()} )`)
                    justWentLive = true
                } else {
                    console.log(`Streaming session is still ongoing @ ( ${new Date()} )`)
                }

            } else {
                justWentLive = false
                console.log(`Current time is ( ${new Date()} ), ${streamers[i]} is offline :(`)
            }

        }

    }, FIVE_MINUTES_IN_MILLISECONDS)

}

// Check the first element of the returned JSON ('data' array). If it's empty, then the stream is offline.
const isStreamerLive = livestreamInfo => livestreamInfo.data.length !== 0



const validateUsernames = streamers => {
    try {
        for (let i = 0; i < streamers.length; i++) {
            if (streamers[i].length === 0 || typeof streamers[i] !== "string") {
                throw new Error("Twitch username is either empty or of the wrong type. Exiting...")
            }
        }
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

validateUsernames(streamers)
openWhenLive(streamers)