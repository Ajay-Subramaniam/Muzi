import { userModel, spaceModel } from './mongooseModel.js'
import jwt from 'jsonwebtoken'

export function socketHandlers(io) {

    const trackPlayingState = {}

    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie?.split(';')
        if (!cookies) {
            return
        }
        const tokenKeyVal = cookies.find(cookie => cookie.trim().startsWith('token'))
        const token = tokenKeyVal?.split('=')[1]
        if (!token) {
            next(new Error('no token found'))
            return
        }
        try {
            const decodeData = jwt.verify(token, process.env.JWT_SECRET)
            const data = {
                id: decodeData._id,
                name: decodeData.name,
                role: decodeData.role,
            }
            socket.userData = data
            next()
        }
        catch (err) {
            console.log("error parsing token", err)
            next(new Error('unable to parse'))
        }
    })

    io.on('connection', (socket) => {

        socket.on('join-room', (space) => {
            socket.join(space)
            console.log(`Socket with ${socket.id} joined ${space}`)
        })

        socket.on('leave-room', (space) => {
            socket.leave(space)
            console.log(`Socket with ${socket.id} left ${space}`)
        })

        socket.on('set-to-play', (spaceName) => {
            socket.to(spaceName).emit('set-to-play')
            trackPlayingState[spaceName] = true
        })

        socket.on('set-to-pause', (spaceName) => {
            io.to(spaceName).emit('set-to-pause')
            trackPlayingState[spaceName] = false
        })

        socket.on('delete-space', async (spaceName) => {
            try {
                await spaceModel.deleteOne({ name: spaceName })
                io.emit('delete-space', spaceName)
            }
            catch (err) {
                console.log('Error in deleting space', err)
            }
        })

        socket.on('fetch-music', async ({ spaceName, musicId }) => {
            let musicInfo = {}
            try {
                const resposne = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${musicId}&key=${process.env.YOUTUBE_API_KEY}`)
                const data = await resposne.json()
                const title = data.items[0].snippet.title
                const thumbnailUrl = data.items[0].snippet.thumbnails.default.url

                musicInfo = {
                    musicId: musicId,
                    title: title,
                    thumbnail: thumbnailUrl,
                    addedBy: socket.userData.id,
                    addedAt: new Date(),
                    lastModifiedAt: Date.now(),
                    score: 0
                }

                await spaceModel.updateOne({ name: spaceName }, { $push: { musicQueue: musicInfo } })
            }
            catch (err) {
                console.log("Error in fetching and updateing music info in db", err)
                socket.emit('error-fetch-music', "Something went wrong in fetching music")
            }
            io.to(spaceName).emit("add-music", musicInfo);
        })

        socket.on('reset-space', async (spaceName) => {
            await spaceModel.updateOne(
                { name: spaceName },
                { $set: { musicQueue: [], currentlyPlaying: null } }
            )
            io.to(spaceName).emit('reset-space')
        })

        socket.on('update-score', async ({ spaceName, musicId, score }) => {
            await spaceModel.updateOne(
                { name: spaceName, "musicQueue.musicId": musicId },
                {
                    $set: {
                        "musicQueue.$.score": score,
                        "musicQueue.$.lastModifiedAt": new Date()
                    }
                }
            );

            io.to(spaceName).emit('update-score', musicId, score)
        })

        socket.on('delete-music', async ({ spaceName, musicId, nextMusicId }) => {
            try {
                console.log("spaceName", spaceName, "musicId", musicId)
                const res = await spaceModel.updateOne({ name: spaceName }, { $pull: { musicQueue: { musicId: musicId } } })
                await spaceModel.updateOne({ name: spaceName }, { $set: { currentlyPlaying: nextMusicId } })

                socket.to(spaceName).emit('delete-music', musicId)
            }
            catch (err) {
                console.log("unable to delete music in db", err)
            }
        })

        socket.on('fetch-musicList', async (spaceName) => {
            let spaceData = []
            try {
                spaceData = await spaceModel.find({ name: `${spaceName}` }, { musicQueue: 1, currentlyPlaying: 1, _id: 0 })

            }
            catch (err) {
                console.log("Error in fetching music queue", err)
                socket.emit('error-fetch-musicList', "Unable to fetch music queue")
            }
            if (spaceData[0].currentlyPlaying) {
                socket.emit('music-started')
            }
            socket.emit("music-queue", {
                musicQueue: spaceData[0]?.musicQueue,
                currentlyPlaying: spaceData[0].currentlyPlaying,
                currentMusicState: trackPlayingState[spaceName]
            })
        })

        socket.on('fetch-spaces', async () => {
            try {
                const spaces = await spaceModel.find({}, { name: 1, _id: 0 })
                socket.emit('spacelist', spaces)
            }
            catch (err) {
                console.log("failed to fetch spaces", err)
                socket.emit('fetch-spaces-error')
            }
        })

        socket.on('add-space', async (spaceName) => {
            const newSpace = {
                name: spaceName,
                createdBy: socket.userData.id,
                currentlyPlaying: null,
                musicQueue: [],
            }
            console.log(newSpace)
            try {
                await spaceModel.insertOne(newSpace)
                io.emit('update-space-add', spaceName)
            }
            catch (err) {
                console.log('unable to add new space', err)
            }
        })

        socket.on('music-started', async ({ spaceName, currentlyPlaying }) => {
            try {
                await spaceModel.updateOne({ name: spaceName }, { $set: { currentlyPlaying } })
                socket.to(spaceName).emit('music-started')
            }
            catch (err) {
                console.log('unable to set the current Playing', err)
            }
        })

        socket.on('fetch-users', async () => {
            try {
                const users = await userModel.find({}, { _id: 0, password: 0 })
                socket.emit('users-list', users)
            }
            catch (err) {
                console.log('unable to fetch users from db', err)
            }
        })

        socket.on('update-user', async ({ email, newRole }) => {
            try {
                await userModel.updateOne({ email }, { $set: { role: newRole } })
                socket.emit('ack-update-role', true)
            }
            catch (err) {
                console.log('unable to change role', err)
                socket.emit('ack-update-role', false)
            }
        })

        socket.on('disconnect', (msg) => {
            console.log(`${socket.id} disconnected due to ${msg}`)
        })

    })
}
