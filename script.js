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
const progress = $("#progress");
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
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
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}">
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
        $(".playlist").innerHTML = htmls.join("");
    },
    // Tạo thêm 1 obj property để app.currentSong trả về obj bài hát thứ 1
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        // _this = app
        const _this = this;

        // Lấy chiều dài của class cd
        const cdWidth = cd.offsetWidth;

        // Xử lý quay cd
        const rotateCD = imgSong.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        rotateCD.pause()

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
        // Xử lý phát nhạc
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            rotateCD.play()
        };
        // Xử lý khi bị dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            rotateCD.pause()
        };

        // Xử lý thay đổi tiến độ bài hát
        audio.ontimeupdate = function () {
            if (audio.duration){
                const timePercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = timePercent
            }
        };

        // Xử lý tua nhạc
        progress.onchange = function (e) {
            if(audio.duration) {
                const changPercent = audio.duration * e.target.value / 100
                audio.currentTime = changPercent
            }
        }

        // Xử lý chuyển next song
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lý chuyển previous song
        prevBtn.onclick = function() {
            if (_this.isRandom){
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lý bật tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý bật tắt repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý chuyển next song khi kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
    },
    loadCurrentSong: function () {
        nameSong.textContent = this.currentSong.name;
        imgSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
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
