import fetch from "node-fetch"
import open from "open"
import 'dotenv/config'

let TWITCH_APP_TOKEN = process.env.TWITCH_APP_TOKEN
let CLIENT_ID = process.env.CLIENT_ID

const getLivestreamInfo = async streamer => {


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

}

const openWhenLive = streamer => {

    console.log(`Monitoring live status of ${streamer}`);
    const FIVE_MINUTES_IN_MILLISECONDS = 300000
    let justWentLive = false

    // Check live status of streamer every 5 minutes
    const interval = setInterval(async() => {

        const livestreamInfo = await getLivestreamInfo(streamer)

        // Only open the stream in the browser if it was offline during the last check.
        if (isStreamerLive(livestreamInfo)) {

            if (!justWentLive) {
                open(`https://twitch.tv/${streamer}`)
                console.log(`Live now, detected @ ( ${new Date()} )`)
                justWentLive = true
            } else {
                console.log(`Streaming session is still ongoing @ ( ${new Date()} )`)
            }

        } else {
            justWentLive = false
            console.log(`Current time is ( ${new Date()} ), parasocial friend is offline :(`)
        }
    }, FIVE_MINUTES_IN_MILLISECONDS)

}

// Check the first element of the returned JSON ('data' array). If it's empty, then the stream is offline.
const isStreamerLive = livestreamInfo => (livestreamInfo.data.length !== 0)


// ENTER THE TWITCH STREAMER'S DISPLAY NAME BETWEEN THE QUOTES BELOW
let parasocialFriend = ""
openWhenLive(parasocialFriend)