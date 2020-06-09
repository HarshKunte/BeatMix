class DrumKit {
    constructor() {
        this.pads = document.querySelectorAll('.pad');
        this.kickPad = document.querySelectorAll('.kick-pad');
        this.snarePad = document.querySelectorAll('.snare-pad');
        this.hihatPad = document.querySelectorAll('.hihat-pad');
        this.playBtn = document.querySelector('.play')
        this.selects = document.querySelectorAll('.controls select');
        console.log(this.selects)
        this.currentKick = "./sounds/kick-classic.wav";
        this.currentSnare = "./sounds/snare-acoustic01.wav";
        this.currentHihat = "./sounds/hihat-acoustic01.wav";
        this.kickAudio = document.querySelector('.kick-sound')
        this.snareAudio = document.querySelector('.snare-sound')
        this.hihatAudio = document.querySelector('.hihat-sound')
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null;
        this.tempoText = document.querySelector('.tempo-nr')

        this.muteBtns = document.querySelectorAll('.mute');
        this.tempoSlider = document.querySelector('.tempo-slider');
        this.save = document.querySelector('#save');
        this.saveForm = document.querySelector('.saveform')
        this.trackNameForm = document.querySelector('.saveform form');
        this.savedTracksSelect = document.querySelector('.saved-tracks')
        this.deleteTrackBtn = document.querySelector('.del-track');
        this.resetBtn = document.querySelector('.reset');

        this.kickTrack = [];
        this.snareTrack = [];
        this.hihatTrack = [];
        this.savedTracks = [];



    }
    getSavedTracks() {
        let tracks = `<option value="default">Select Track</option>`;
        if (localStorage.getItem('tracks') != undefined) {

            this.savedTracks = JSON.parse(localStorage.getItem('tracks'))
            this.savedTracks.forEach(track => {

                tracks += `<option value="${track.name}">${track.name}</option>`;
            })
            this.savedTracksSelect.innerHTML = tracks
        }
        console.log(tracks)
    }
    activePad() {
        this.classList.toggle("active")
    }
    repeat() {
        let step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`);
        //Loop over pads
        activeBars.forEach(bar => {
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
            if (bar.classList.contains('active')) {
                if (bar.classList.contains('kick-pad')) {
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play()

                }
                if (bar.classList.contains('snare-pad')) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play()

                }
                if (bar.classList.contains('hihat-pad')) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play()

                }
            }
        })


        this.index++;
    }
    start() {
        const interval = (60 / this.bpm) * 1000;
        if (!this.isPlaying) {
            this.isPlaying = setInterval(() => {
                this.repeat();

            }, interval)
        } else {
            clearInterval(this.isPlaying)
            this.isPlaying = null;
        }
    }

    updateBtn() {
        if (!this.isPlaying) {
            this.playBtn.classList.add('active');
            this.playBtn.innerText = "Stop"
        }
        else {
            this.playBtn.classList.remove('active');
            this.playBtn.innerText = "Play"
        }
    }

    changeSound(e) {
        const selectionName = e.target.name;
        const selectionValue = e.target.value;
        switch (selectionName) {
            case "kick-select":
                this.kickAudio.src = selectionValue;
                break;
            case "snare-select":
                this.snareAudio.src = selectionValue;
                break;
            case "hihat-select":
                this.hihatAudio.src = selectionValue;
                break;
        }
    }

    changeTempo(e) {

        this.bpm = e.target.value;
        this.tempoText.innerText = e.target.value
    }

    updateTempo() {
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if (playBtn.classList.contains('active')) {
            this.start();
        }
    }

    mute(e) {

        const muteIndex = e.target.getAttribute('data-track');
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) {
            switch (muteIndex) {
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;

            }
        }
        else {
            switch (muteIndex) {
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }

    savetrack() {
        let kickTrack = [];
        let snareTrack = [];
        let hihatTrack = [];


        const setPads = document.querySelectorAll('.pad')
        setPads.forEach(pad => {
            if (pad.classList.contains('active')) {
                const paidindex = pad.classList[2].split('')[1]
                if (pad.classList.contains('kick-pad')) {
                    kickTrack.push(paidindex)

                }
                if (pad.classList.contains('snare-pad')) {
                    snareTrack.push(paidindex)

                }
                if (pad.classList.contains('hihat-pad')) {
                    hihatTrack.push(paidindex)

                }
            }
        })
        console.log(this.saveForm)
        this.saveForm.style.display = "block";
        this.kickTrack = kickTrack
        this.snareTrack = snareTrack
        this.hihatTrack = hihatTrack




    }

    saveWithTrackName(e) {
        e.preventDefault();
        if (this.kickTrack.length == 0 && this.snareTrack.length == 0 && this.hihatTrack == 0) {
            document.querySelector('.msg').innerText = "There are no pads selected."
        }
        else {
            const value = e.target.children[0].value;
            let newtrack = {
                "name": value,
                "kick": {
                    "pads": this.kickTrack,
                    "source": this.selects[0].value
                },
                "snare": {
                    "pads": this.snareTrack,
                    "source": this.selects[1].value
                },


                "hihat": {
                    "pads": this.hihatTrack,
                    "source": this.selects[2].value
                },


                "tempo": this.bpm
            }
            this.savedTracks.push(newtrack);
            localStorage.setItem('tracks', JSON.stringify(this.savedTracks));
            this.saveForm.style.display = "none";
            document.querySelector('.msg').innerText = "Track saved successfully!!"
            setTimeout(() => {
                document.querySelector('.msg').innerText = ""
            }, 2000);

            this.getSavedTracks()

        }
    }

    playSavedTracks(e) {
        this.deleteTrackBtn.style.display = "block"
        this.resetBtn.style.display = "block"
        const name = e.target.value;
        console.log(name)
        const track = this.savedTracks.find(track => track.name === name);
        const kick = track.kick;
        const snare = track.snare;
        const hihat = track.hihat;

        this.bpm = track.tempo;
        this.tempoText.innerText = track.tempo
        this.tempoSlider.value = track.tempo
        this.selects[0].value = kick.source
        this.selects[1].value = snare.source;
        this.selects[2].value = hihat.source;
        this.kickAudio.src = kick.source;
        this.snareAudio.src = snare.source;
        this.hihatAudio.src = hihat.source;
        console.log(kick)
        for (let i = 0; i < 8; i++) {

            if (kick.pads.includes(String(i % 8))) {
                this.kickPad[i].classList.add('active');

            }
            else {
                if (this.kickPad[i].classList.contains('active')) {
                    this.kickPad[i].classList.remove('active');
                }
            }

            if (snare.pads.includes(String(i % 8))) {
                this.snarePad[i].classList.add('active');

            }
            else {
                if (this.snarePad[i].classList.contains('active')) {
                    this.snarePad[i].classList.remove('active');
                }
            }
            if (hihat.pads.includes(String(i % 8))) {
                this.hihatPad[i].classList.add('active');


            }
            else {
                if (this.hihatPad[i].classList.contains('active')) {
                    this.hihatPad[i].classList.remove('active');
                }
            }
        }
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if (playBtn.classList.contains('active')) {
            this.start();
        }

    }

    deleteTrack() {
        if (confirm("Do you want to delete this track?")) {
            this.savedTracks = this.savedTracks.filter((track) => {
                return track.name != this.savedTracksSelect.value
            })
            localStorage.setItem('tracks', JSON.stringify(this.savedTracks))
            this.getSavedTracks()
            this.resetSequencer()
        }
    }
    resetSequencer() {
        this.pads.forEach(pad => {
            if (pad.classList.contains('active')) {
                pad.classList.remove('active')
            }
        })
        this.deleteTrackBtn.style.display = "none"
        this.resetBtn.style.display = "none"
        this.savedTracksSelect.value = "default"
        this.bpm = 150;
        this.tempoSlider.innerText = 150;
        this.tempoSlider.value = 150;
        this.selects[0].value = this.currentKick;
        this.selects[1].value = this.currentSnare;
        this.selects[2].value = this.currentHihat;
    }
}

const drumkit = new DrumKit();

drumkit.pads.forEach(pad => {
    pad.addEventListener('click', drumkit.activePad);
    pad.addEventListener('animationend', function () {
        this.style.animation = "";
    })
})

drumkit.playBtn.addEventListener('click', () => {
    drumkit.updateBtn()
    drumkit.start();

})

drumkit.selects.forEach(select => {
    select.addEventListener('change', function (e) {
        drumkit.changeSound(e)
    })
})
drumkit.muteBtns.forEach(button => {
    button.addEventListener('click', function (e) {
        drumkit.mute(e)
    })
})
drumkit.tempoSlider.addEventListener('input', function (e) {
    drumkit.changeTempo(e);
})
drumkit.tempoSlider.addEventListener('change', function () {
    drumkit.updateTempo();
})

drumkit.save.addEventListener('click', function () {
    drumkit.savetrack();
})

drumkit.trackNameForm.addEventListener('submit', function (e) {
    drumkit.saveWithTrackName(e);
})

drumkit.savedTracksSelect.addEventListener('change', function (e) {
    drumkit.playSavedTracks(e);
})
drumkit.deleteTrackBtn.addEventListener('click', function () {
    drumkit.deleteTrack();
})
drumkit.resetBtn.addEventListener('click', function () {
    drumkit.resetSequencer();
})
document.addEventListener('DOMContentLoaded', function () {
    drumkit.getSavedTracks()
})