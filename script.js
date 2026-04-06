// --- INIT SAAT LOAD ---
window.onload = function() {
    ambilNamaTamu();
    initMelati();       // Jalankan mesin melati
    animateMelati();    // Animasi melati
};

// --- 1. AMBIL NAMA TAMU ---
function ambilNamaTamu() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');
    
    if (namaTamu) {
        document.getElementById('guest-name').innerText = namaTamu;
    } else {
        document.getElementById('guest-name').innerText = "Tamu Undangan";
    }
}

// --- 2. BUKA UNDANGAN (ANIMASI SLIDE UP) ---
function bukaUndangan() {
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    
    // Efek Slide Up Elegant untuk tema Nusantara
    cover.style.transition = "all 1s cubic-bezier(0.77, 0, 0.175, 1)";
    cover.style.transform = "translateY(-100%)";
    
    setTimeout(() => {
        cover.style.display = 'none';
        mainContent.classList.remove('hidden');
        setTimeout(() => {
             mainContent.classList.remove('opacity-0'); 
             AOS.refresh();
        }, 100);
        
        window.scrollTo(0, 0);
        document.getElementById("tombol-musik").classList.remove("hidden");
        putarLagu(); 
    }, 800);
}

// --- 3. COUNTDOWN (TEMA ADAT - GOLD) ---
const targetDate = new Date("April 19, 2026 08:00:00").getTime(); 

const hitungMundur = setInterval(function() {
    const sekarang = new Date().getTime();
    const selisih = targetDate - sekarang;

    if (selisih < 0) {
        clearInterval(hitungMundur);
        document.getElementById("countdown").innerHTML = "<div class='text-xl font-cinzel text-gold'>Alhamdulillah, Acara Telah Selesai</div>";
        return;
    }

    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);

    const kotakWaktu = (angka, label) => `
        <div class="flex flex-col items-center mx-2">
            <span class="text-3xl md:text-5xl font-cinzel text-gold drop-shadow-sm">${angka}</span>
            <span class="text-[9px] uppercase tracking-widest text-gray-400 mt-2 font-serif border-t border-gray-700 pt-1 w-full text-center">${label}</span>
        </div>
    `;

    const el = document.getElementById("countdown");
    if (el) {
        el.innerHTML = 
            kotakWaktu(hari, "HARI") + 
            "<span class='text-2xl text-gray-600 mt-2'>:</span>" +
            kotakWaktu(jam, "JAM") + 
            "<span class='text-2xl text-gray-600 mt-2'>:</span>" +
            kotakWaktu(menit, "MENIT") + 
            "<span class='text-2xl text-gray-600 mt-2'>:</span>" +
            kotakWaktu(detik, "DETIK");
    }
}, 1000);

// --- 4. MUSIK ---
const lagu = document.getElementById("lagu");
const tombolMusik = document.getElementById("tombol-musik");
let isPlaying = false;

function putarLagu() {
    if(lagu) {
        if (isPlaying) {
            lagu.pause();
            tombolMusik.classList.remove("animate-spin-slow");
            tombolMusik.style.opacity = "0.5";
            isPlaying = false;
        } else {
            lagu.play().catch(e => console.log("Audio block", e));
            tombolMusik.classList.add("animate-spin-slow");
            tombolMusik.style.opacity = "1";
            isPlaying = true;
        }
    }
}

// --- 5. ANIMASI MELATI JATUH (Canvas) ---
const canvas = document.getElementById('melati-fall');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height;
let melatis = [];
const count = 50; // Jumlah bunga jatuh

class Melati {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 3 + 2; 
        this.speedY = Math.random() * 0.5 + 0.2; 
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.rotation += this.rotationSpeed;
        if (this.y > height) this.reset();
    }

    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#fffff0"; // Putih Gading
        
        // Gambar Bunga Melati Sederhana
        for(let i=0; i<4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(0, -this.size/1.5, this.size/3, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#ffd700"; // Putik Kuning
        ctx.beginPath();
        ctx.arc(0, 0, this.size/4, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    }
}

function initMelati() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    melatis = [];
    for (let i = 0; i < count; i++) {
        melatis.push(new Melati());
    }
}

function animateMelati() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    melatis.forEach(m => {
        m.update();
        m.draw();
    });
    requestAnimationFrame(animateMelati);
}

// --- 6. SALIN REKENING ---
function salin(idTeks, idAlert) {
    const elemenTeks = document.getElementById(idTeks);
    if(!elemenTeks) return;
    
    const nomor = elemenTeks.innerText;
    navigator.clipboard.writeText(nomor).then(() => {
        const alertBox = document.getElementById(idAlert);
        if(alertBox) {
            alertBox.classList.remove("hidden");
            setTimeout(() => alertBox.classList.add("hidden"), 2000);
        } else {
            alert("Copied ✅");
        }
    });
}

// --- 7. KIRIM WA (Dual) ---
function kirimKeWA(tujuan) {
    const nama = document.getElementById("nama-pengirim").value;
    const pesan = document.getElementById("pesan-ucapan").value;
    const kehadiran = document.getElementById("status-kehadiran").value;

    // Basic Validation
    if(!nama || !pesan) { 
        alert("Isi nama & pesan dulu ya!"); 
        return; 
    }
    
    // Routing Target
    let nomorHP = tujuan === 'maul' ? '62859106511495' : '6285180643865';
    let panggilan = tujuan === 'maul' ? 'ul' : 'Dita';

    // Logic Transformasi Status Kehadiran
    let teksKehadiran = "";
    const status = kehadiran.toLowerCase();

    if (status.includes("tidak")) {
        teksKehadiran = "Mohon Maaf, Saya *Tidak Bisa Hadir*";
    } else if (status.includes("hadir")) {
        teksKehadiran = "Insya Allah Saya *Akan hadir*";
    } else {
        teksKehadiran = "Saat ini Saya *Masih Ragu-ragu*";
    }

    // Eksekusi Template Literal
    const templatePesan = 
`Halo ${panggilan}!

Saya *${nama}*,
${teksKehadiran} di acara pernikahan kalian.

Doa & Ucapan:
"${pesan}"

Terima kasih!`;

    // Trigger URL Scheme WhatsApp
    window.open(`https://wa.me/${nomorHP}?text=${encodeURIComponent(templatePesan)}`, '_blank');
}

window.addEventListener('resize', initMelati);