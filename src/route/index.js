// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}
// ================================================================
Track.create(
  'Інь Ян',
  'MONATIK і ROXOLANA',
  'img/spotify/monatik.jpg',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez і Rauw Alejandro',
  './img/spotify/selena.jpg',
)
Track.create(
  'Shameless',
  'Camila Cabello ',
  './img/spotify/cabello.jpg',
)
Track.create(
  'DÁKITI',
  'BAD BUNNY і JHAY',
  './img/spotify/badbunny.jpg',
)
Track.create('11 PM', 'Maluma', './img/spotify/maluma.jpg')
Track.create(
  'Інша любов',
  'Enleo',
  './img/spotify/enleo.jpg',
)
// console.log(Track.getList())

// ================================================================
class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrackById(trackId) {
    this.tracks.push(Track.getById(trackId))
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================

router.get('/', function (req, res) {
  const playlists = Playlist.getList()
  res.render('spotify-all-playlists', {
    style: 'spotify-all-playlists',

    data: {
      playlists: playlists.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
  })
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})
// ================================================================
router.post('/spotify-create', function (req, res) {
  console.log(req.body, req.query)

  const isMix = !!req.query.isMix
  const name = req.body.playlistName

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        status: 'Unsuccessful ❌',
        info: 'Write name for playlist',
        openPage: 'Create playlist',
        href: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  //   res.render('alert', {
  //     style: 'alert',

  //     data: {
  //       status: 'Successful ✅',
  //       info: 'Playlist created',
  //       openPage: 'Playlist',
  //       href: `/spotify-playlist?id=${playlist.id}`,
  //     },
  //   })
})
// ================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  console.log(id)
  const playlist = Playlist.getById(id)
  console.log(playlist)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Unsuccessful ❌',
        info: 'Cann`t find this playlist',
        openPage: 'Home page',
        href: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  console.log(playlistId, trackId, playlist)

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  console.log(playlistId, trackId, playlist)
})
// ================================================================
router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  console.log(playlistId)
  const playlist = Playlist.getById(playlistId)
  console.log(playlist)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  console.log(playlistId, trackId, playlist)

  playlist.addTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  console.log(Track.getList())
  console.log(playlistId, trackId, playlist)
})

// ================================================================
// console.log(Track.getList())
// console.log(Playlist.getList())

router.get('/spotify-search', function (req, res) {
  const value = ''

  const playlist = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      playlists: playlist.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
  //   console.log(playlist)
})
// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      playlists: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
