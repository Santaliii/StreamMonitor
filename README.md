## Introduction

Permanently-running background client application that uses Twitch's API to launch a stream in your default browser when it goes live.
Checks if a specified stream(s) is live or not every 5 minutes.

## Prerequisites

You must have the following installed on your machine before trying to run this program locally:

1. nodeJS runtime environment
2. npm
3. git
4. forever npm package

### What to do before running this on your machine.

Firstly, you want to get your own Twitch API client_id key and app token. To do so, follow the instructions provided in the link below:

https://dev.twitch.tv/docs/api/

Once you've gotten a hold of your own client_id key and app token, move on to the step below.


## How to run on your machine

1. Clone this repo using the following command

`` git clone https://github.com/Santaliii/StreamMonitor (desired name) ``

2. Run the following commands in the cloned project

`` npm install ``, to install all required dependencies.

3. Install the forever npm package (important for permanently running this process in the background)

`` npm install forever -g ``

4. Create new file and name it .env , then add your previously given app token and client_id in the following format:

```
TWITCH_APP_TOKEN=YOUR-APP-TOKEN
CLIENT_ID=YOUR-CLIENT-ID
```

5. Edit the streamWatcher.js file to your preferences as specified by the all-uppercase comments in the file. Editable parameters are:

- The ``streamers`` array of objects. Follow the specified format shown below:

*Before adding your streamer(s)*

```js
const streamers = [{
        twitchUsername: 'the_happy_hobb',
        justWentLive: 0
    },
    {
        twitchUsername: 'zoil',
        justWentLive: 0
    }
]
```

*After adding* ~ (justWentLive attribute should always be zero)

```js
const streamers = [{
        twitchUsername: 'the_happy_hobb',
        justWentLive: 0
    },
    {
        twitchUsername: 'zoil',
        justWentLive: 0
    },
    {
        twitchUsername: 'your_streamer',
        justWentLive: 0
    }
]
```



- The interval time at which to check if a streamer(s) is live or not (IN MILLISECONDS):

```js
const INTERVAL_TIME_IN_MILLSECONDS = 300000 // 300000 = 5 Minutes
```

6. Finally, in the cloned project folder, run the program as a permanent background service (using the forever npm package) by issuing the following command:

`` npm run start-forever `` - to start a permanent background process <br>

After that, you can close your dev environment while the process runs in the background permanently

## How to kill/view information about forever tasks

You can view currently running forever processes using:

`` forever list `` 

Or kill a forever process with:

`` forever stop uid `` - *Note*, the uid is provided by the return message of the above command. <br>

A log of the forever process *should* be located in a directory C:/Users/YOUR_USERNAME/.forever, and its name should be the same as the process's uid.

For more information or troubleshooting regarding forever, refer to their documentation:

- https://github.com/foreversd/forever

## How to run after a system reboot

The program does not automatically restart after a system reboot. To run it again:

1. Open a CLI
2. Navigate to the directory where streamWatcher.js is located
3. Run the command `` npm run start-forever ``

## Additional info

- If you close a stream that the program opened, it will not open it again until the stream goes offline for at least `` INTERVAL_TIME_IN_MILLSECONDS ``







