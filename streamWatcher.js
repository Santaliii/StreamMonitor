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
    },
    {
        twitchUsername: 'xqcow',
        justWentLive: 0
    },
    {
        twitchUsername: 'dinossindgeil',
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

    // CHANGE TO DESIRED INTERVAL TIME AT WHICH TO CHECK LIVE STATUS
    const FIVE_MINUTES_IN_MILLISECONDS = 1000

    // Check live status of streamer every 5 minutes
    const interval = setInterval(async() => {


        for (let i = 0; i < streamers.length; i++) {

            const livestreamInfo = await getLivestreamInfo(streamers[i].twitchUsername)

            // Only open the stream in the browser if it was offline during the last check.
            if (isStreamerLive(livestreamInfo)) {

                if (!streamers[i].justWentLive) {
                    open(`https://twitch.tv/${streamers[i].twitchUsername}`)
                    const now = new Date()
                    console.log(`${formatDate(now)} ${streamers[i].twitchUsername} is live.\n`)
                    streamers[i].justWentLive = true
                }

            } else {
                streamers[i].justWentLive = false
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

const formatDate = date => date.toUTCString().substring(5, date.toUTCString().length - 3).replace(/ /g, '')

validateUsernames(streamers)
openWhenLive(streamers)