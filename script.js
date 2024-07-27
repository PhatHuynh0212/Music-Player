/*
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / Prev
    6. Random
    7. Next, Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const nameSong = $("header h2");
const imgSong = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn-toggle-play");

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: "Monster",
            singer: "Katie Sky",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Viva la vida",
            singer: "Coldplay",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Sick Enough To Die - Remix",
            singer: "MC Mong",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
                <div class="song">
                    <div
                        class="thumb"
                        style="background-image: url('${song.image}');"
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        $(".playlist").innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this
        
        // Lấy chiều dài của class cd
        const cdWidth = cd.offsetWidth;

        // Scroll
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        };

        // Xử lý click play
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing');
        }

        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing');
        }
    },
    loadCurrentSong: function () {
        nameSong.textContent = this.currentSong.name;
        imgSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    // getCurrentSong: function() {
    //     return this.songs[this.currentIndex]
    // },
    start: function () {
        // Định nghĩa thuộc tính object
        this.defineProperties();

        // Các events có trong web
        this.handleEvents();

        // Load bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render các bài hát
        this.render();
    },
};

app.start();
