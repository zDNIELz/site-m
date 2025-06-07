// CANVAS MATRIX
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const palavras = ["Teste"];
const fonteSize = 24;
const columnSpacing = 70;
let columns;
let drops;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width <= 400) {
        columns = Math.floor(canvas.width / columnSpacing);
    } else {
        columns = Math.floor((canvas.width / columnSpacing) + 1);
    }

    drops = Array(columns).fill(0).map(() => ({
        y: Math.floor(Math.random() * canvas.height),
        active: Math.random() < 1
    }));
}

function Draw() {
    ctx.fillStyle = `rgba(30, 30, 30, 0.10)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#dd0e0e";
    ctx.font = `${fonteSize}px monospace`;

    drops.forEach((drop, i) => {
        if (!drop.active) return;

        const texto = palavras[Math.floor(Math.random() * palavras.length)];
        const x = i * columnSpacing;
        const y = drop.y;

        ctx.fillText(texto, x, y);
        drop.y += fonteSize;

        if (drop.y > canvas.height) {
            drop.y = 0;
        }
    });
}
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
setInterval(Draw, 60);

// PAGE 1 INTERACTIONS
function Click() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#dd0e0e';
    ctx.textAlign = 'center';


    document.addEventListener('click', (event) => {
        if (event.target !== canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.fillText('Você clicou aqui!', x, y + 20);
    });
}

function PageView(id, btn) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');

    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active-btn');
    });

    if (btn) btn.classList.add('active-btn');
}

// LETTERS INTERACTIONS

async function UploadLetters() {
    try {
        const response = await fetch('./dates.json');
        const Letters = await response.json();

        return Letters;
    } catch (error) {
        console.error('Erro ao carregar JSON', error);
    }
}

UploadLetters().then(Letters => {
    if (Letters) {
        Letters.unshift({ id: 'a' });
        localStorage.setItem("Letters", JSON.stringify(Letters));
    } else {
        console.error("Erro: Dados não carregados corretamente.");
    }
});


const container = document.getElementById("ContainerLetters");
const DataLetters = JSON.parse(localStorage.getItem("Letters"));
let PresentIndice = 0;

let largura = window.innerWidth;
const LetterWidth = 92.8 + 15;

function CreatLetter(title, mensagem, data, tag, imagem) {
    const titulo = document.createElement("h4")
    titulo.textContent = title;
    titulo.className = "TitleCards";

    const div = document.createElement("div");
    div.appendChild(titulo);
    div.className = "Letter";

    const date = document.createElement("p")
    date.textContent = data
    date.className = "Data"
    div.appendChild(date)

    const desc = document.createElement("p")
    desc.textContent = tag
    desc.className = "Tag"
    div.appendChild(desc)

    if (mensagem != "") {
        const msn = document.createElement("p");
        msn.textContent = mensagem;
        msn.className = "Msn";
        div.appendChild(msn);
    } else if (imagem != "") {
        const imagen = document.createElement("img");
        imagen.src = imagem;
        div.appendChild(imagen)
    }

    return div;
}

function LoadAllLetters() {
    container.innerHTML = "";

    DataLetters.forEach((Letter) => {
        if (Letter.id == 'a') {
            const div = CreatLetter(Letter.title, Letter.mensagem, Letter.data, Letter.tag, Letter.imagem);
            div.className = 'SpaceEmpty';
            container.appendChild(div);
        } else if (Letter.id == 'z') {
            const div = CreatLetter(Letter.title, Letter.mensagem, Letter.data, Letter.tag, Letter.imagem);
            div.className = 'SpaceEmpty'
            container.appendChild(div);
        } else {
            const div = CreatLetter(Letter.title, Letter.mensagem, Letter.data, Letter.tag, Letter.imagem);
            container.appendChild(div);
        }
    });

    UpdateStyle();
}

function UpdateStyle() {
    const Letters = container.querySelectorAll(".Letter");

    Letters.forEach((Letter, index) => {
        // Reseta transform de todos
        Letter.style.transform = "scale(1)";

        Letter.classList.remove("central", "lateral");

        if (index === PresentIndice) {
            Letter.classList.add("central");
            Letter.style.transform = "scale(1.3)";
        } else if (
            index === PresentIndice - 2 ||
            index === PresentIndice - 1 ||
            index === PresentIndice + 1 ||
            index === PresentIndice + 2
        ) {
            Letter.classList.add("lateral");
        }
    });
}

// Armazena qual carta está ampliada manualmente
let scaledElement = null;

container.addEventListener("click", (event) => {
    const clicked = event.target.closest(".Letter");

    if (!clicked) return;

    if (clicked.classList.contains("central")) {
        // Se for a mesma carta que já estava ampliada, volta ao normal
        if (scaledElement === clicked) {
            clicked.style.transform = "scale(1.3)";
            scaledElement = null;
        } else {
            // Se for outra carta, desfaz a anterior e amplia a nova
            if (scaledElement) scaledElement.style.transform = "scale(1.3)";
            clicked.style.transform = "scale(2)";
            scaledElement = clicked;
        }
    }
});

function PositionUpdate() {
    container.style.transform = `translateX(-${PresentIndice * LetterWidth}px)`;
    UpdateStyle();
}

function NextLetter() {
    if (PresentIndice + 1 < DataLetters.length - 1) {
        PresentIndice++;
        PositionUpdate();
    }
}

function BackLetter() {
    if (PresentIndice > 0) {
        PresentIndice--;
        PositionUpdate();
    }
}

LoadAllLetters();
PositionUpdate();

/* Music */
const audio = document.getElementById('audio');
const capaMusic = document.getElementById('Capa');
const NomeMsc = document.getElementById('TrackTitle');
const ArtistMsc = document.getElementById('TrackArtist');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('Progress');
let currentSong = 0;

const playlist = [
    {
        capa: "./Imagens/rollinImg.jpeg",
        musica: "./Audios/Rollin.mp3",
        artist: "Limp Bizkit",
        name: "Rollin"
    },
    {
        capa: "./Imagens/toxicityImg.jpeg",
        musica: "./Audios/Toxicity.mp3",
        artist: "System of a Down",
        name: "Toxicity"
    },
];

audio.src = playlist[currentSong].musica;
capaMusic.src = playlist[currentSong].capa;
ArtistMsc.textContent = playlist[currentSong].artist;
NomeMsc.textContent = playlist[currentSong].name;

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

function prevSong() {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    audio.src = playlist[currentSong].musica;
    capaMusic.src = playlist[currentSong].capa;
    ArtistMsc.textContent = playlist[currentSong].artist;
    NomeMsc.textContent = playlist[currentSong].name;
    audio.play();
}

function nextSong() {
    currentSong = (currentSong + 1) % playlist.length;
    audio.src = playlist[currentSong].musica;
    capaMusic.src = playlist[currentSong].capa;
    ArtistMsc.textContent = playlist[currentSong].artist;
    NomeMsc.textContent = playlist[currentSong].name;
    audio.play();
}

audio.addEventListener('ended', () => {
    nextSong();
});

audio.addEventListener('timeupdate', () => {
    const value = (audio.currentTime / audio.duration) * 100;
    progress.value = value;
    progress.style.background = `linear-gradient(to right, #4B4B4B ${value}%, #FFF5F5 ${value}%)`;
});

progress.addEventListener('input', () => {
    const value = progress.value;
    audio.currentTime = (value / 100) * audio.duration;
    progress.style.background = `linear-gradient(to right, #4B4B4B ${value}%, #FFF5F5 ${value}%)`;
});
