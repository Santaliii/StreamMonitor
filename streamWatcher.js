// Fetch API for HTTP requests
import fetch from "node-fetch"
// Package to open website on browser
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
            // Developer client ID
            'Client-ID': `${CLIENT_ID}`
        }
    })


    // Livestream information in JSON format.
    const livestreamInfo = await response.json()
    return livestreamInfo

}

const openWhenLive = streamer => {

    console.log(`Monitoring live status of ${streamer}`);
    const FIVE_MINUTES_IN_MILLISECONDS = 1000
    let justWentLive = false

    // Check live status of streamer every 5 minutes
    const interval = setInterval(async() => {

        const livestreamInfo = await getLivestreamInfo(streamer)

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

const isStreamerLive = streamer => (streamer.data.length !== 0)



let parasocialFriend = "the_happy_hobb"
openWhenLive(parasocialFriend)