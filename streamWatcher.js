import fetch from "node-fetch"
import open from "open"
import 'dotenv/config'

const TWITCH_APP_TOKEN = process.env.TWITCH_APP_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
    // ENTER ANY AMOUNT OF STREAMERS (THEIR TWITCH DISPLAY NAME) IN THE ARRAY BELOW FOLLOWING THE SAME SHOWN FORMAT.
    // ** ONLY ENTER NON-EMPTY STRINGS IN THE twitchUsername FIELD, ALWAYS SET THE justWentLive ATTRIBUTE TO 0
const streamers = [{
        twitchUsername: 'the_happy_hobb',
        justWentLive: 0
    },
    {
        twitchUsername: 'zoil',
        justWentLive: 0
    },
    {
        twitchUsername: 'pokelawls',
        justWentLive: 0
    }
]

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
        console.error("API request failed. Trying again...");
    }

}

const openWhenLive = streamers => {

    console.log(`Monitoring live status of ${JSON.stringify(streamers)}`);
    // CHANGE TO DESIRED INTERVAL TIME AT WHICH TO CHECK LIVE STATUS
    const FIVE_MINUTES_IN_MILLISECONDS = 5000

    // Check live status of streamer every 5 minutes
    const interval = setInterval(async() => {


        for (let i = 0; i < streamers.length; i++) {

            const livestreamInfo = await getLivestreamInfo(streamers[i].twitchUsername)

            // Only open the stream in the browser if it was offline during the last check.
            if (isStreamerLive(livestreamInfo)) {

                if (!streamers[i].justWentLive) {
                    open(`https://twitch.tv/${streamers[i].twitchUsername}`)
                    console.log(`${streamers[i].twitchUsername} is live now @ ( ${new Date().toDateString()} )\n`)
                    streamers[i].justWentLive = true
                } else {
                    console.log(`${streamers[i].twitchUsername} is still streaming @ ( ${new Date()} )\n`)
                }

            } else {
                streamers[i].justWentLive = false
                console.log(`Current time is ( ${new Date()} ), ${streamers[i].twitchUsername} is offline :(\n`)
            }

        }

    }, FIVE_MINUTES_IN_MILLISECONDS)

}

// Check the first element of the returned JSON ('data' array). If it's empty, then the stream is offline.
const isStreamerLive = livestreamInfo => livestreamInfo.data.length !== 0



const validateUsernames = streamers => {
    try {
        for (let i = 0; i < streamers.length; i++) {
            if (streamers[i].twitchUsername.length === 0 || typeof streamers[i].twitchUsername !== "string") {
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