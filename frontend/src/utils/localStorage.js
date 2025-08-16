export function fetchLocalStorage(currentSpaceName, musicList, userId) {
    const stringed_data = localStorage.getItem('muzi_user_data')
    let user_data = JSON.parse(stringed_data)
    if (user_data == null) {
        user_data = []
    }

    let tgtUser = user_data.find(user => user.userId == userId)
    let tgtSpace = null
    if (tgtUser) {
        tgtSpace = tgtUser.spaces.find(stored_space => stored_space.name == currentSpaceName)
    }
    if(!tgtUser || !tgtSpace){
        if (!tgtUser) {
            const newUser = {
                userId,
                spaces: []
            }
            user_data.push(newUser)
            tgtUser=newUser
        }
        if (!tgtSpace) {
            const newSpace = {
                name: currentSpaceName,
                votes: []
            }
            tgtUser.spaces.push(newSpace)
        }
    }
    else{//cleaning stale data
        const min_addedAt = Math.min(...musicList.map(space => Date.parse(space.addedAt)))
        tgtUser.spaces = tgtUser.spaces.map(space => {
            if (space.name == currentSpaceName) {
                return {
                    ...space,
                    votes: space.votes.filter((obj) => Date.parse(obj.addedAt) >= min_addedAt)
                }
            }
            return space
        })
    }
    localStorage.setItem('muzi_user_data', JSON.stringify(user_data))
}

export function updateVote(musicId, addedAt, spaceName, myVote, userId) {
    const stringed_data = localStorage.getItem('muzi_user_data')
    const user_data = JSON.parse(stringed_data)
    const tgtUser = user_data.find(user => user.userId == userId)
    const tgtSpace = tgtUser.spaces.find((space) => space.name == spaceName)
    const tgtMusic = tgtSpace.votes.find((obj) => obj.musicId == musicId && obj.addedAt == addedAt)
    if (tgtMusic) {
        tgtMusic.myVote = myVote
    }
    else {
        const obj = {
            musicId,
            addedAt,
            myVote
        }
        tgtSpace.votes.push(obj)
    }
    localStorage.setItem('muzi_user_data', JSON.stringify(user_data))
}

export function getVote(musicId, addedAt, spaceName, userId) {
    const stringed_data = localStorage.getItem('muzi_user_data')
    const user_data = JSON.parse(stringed_data)
    const tgtUser = user_data.find(user => user.userId == userId)
    const tgtSpace = tgtUser.spaces.find((space) => space.name == spaceName)
    const tgtMusic = tgtSpace.votes.find((obj) => obj.musicId == musicId && obj.addedAt == addedAt)
    if (tgtMusic) {
        return tgtMusic.myVote
    }
    return 0;
}

export function clearNonExistingSpaces(spaceList) {
    const stringed_data = localStorage.getItem('muzi_user_data')
    let user_data = JSON.parse(stringed_data)
    if (!user_data) {
        return
    }
    user_data = user_data.map(user => {
        return {
            ...user,
            spaces: user.spaces.filter(stored_space => spaceList.some(space => space.name == stored_space.name))
        }
    })
    localStorage.setItem('muzi_user_data', JSON.stringify(user_data))
}