/* ========== PRELOADER ========== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hide');
    setTimeout(() => { preloader.style.display = 'none'; }, 600);
});

/* ========== BACK TO TOP ========== */
const btnBTT = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    btnBTT.classList.toggle('show', window.scrollY > 600);
});
btnBTT.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== TEMA DARK PERMANEN - TIDAK ADA TOGGLE ========== */
// Tidak ada kode untuk mengganti tema karena tema sudah dark permanen di CSS.
// Fungsi theme toggle dihapus agar tidak error.

/* ========== MOBILE MENU ========== */
const btnHamburger = document.getElementById('menu-toggle');
const menuMobile   = document.getElementById('mobile-menu');
if (btnHamburger && menuMobile) {
    btnHamburger.addEventListener('click', () => {
        menuMobile.classList.toggle('open');
        const isMbuka = menuMobile.classList.contains('open');
        btnHamburger.innerHTML = isMbuka ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    menuMobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            menuMobile.classList.remove('open');
            btnHamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

/* ========== ACTIVE NAV LINK ========== */
const semuaSeksi = document.querySelectorAll('section[id]');
const linkNav    = document.querySelectorAll('.nav-links a');
function updateNavAktif() {
    const scrollPos = window.scrollY + 90;
    semuaSeksi.forEach(sec => {
        const top  = sec.offsetTop;
        const high = sec.offsetHeight;
        const id   = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + high) {
            linkNav.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
            });
        }
    });
}
window.addEventListener('scroll', updateNavAktif, { passive: true });

/* ========== SCROLL REVEAL ========== */
const elReveal = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('.prog-bar').forEach(bar => {
            const pct = bar.getAttribute('data-percent');
            setTimeout(() => { bar.style.width = pct + '%'; }, 250);
        });
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
elReveal.forEach(el => observer.observe(el));

/* ========== SKILL PROGRESS BAR ========== */
const kartuSkill = document.querySelectorAll('.skill-card');
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target.querySelector('.prog-bar');
        if (bar) setTimeout(() => { bar.style.width = bar.getAttribute('data-percent') + '%'; }, 300);
    });
}, { threshold: 0.3 });
kartuSkill.forEach(k => skillObs.observe(k));

/* ========== CAROUSEL TESTIMONIALS ========== */
const slider    = document.getElementById('testi-slider');
const dots      = document.querySelectorAll('#c-dots .c-dot');
const btnPrev   = document.getElementById('prev-btn');
const btnNext   = document.getElementById('next-btn');
let slideAktif  = 0;
const totalSlide = 3;
let timerAuto;

if (slider && dots.length) {
    function pindahSlide(idx) {
        slideAktif = (idx + totalSlide) % totalSlide;
        slider.style.transform = `translateX(-${slideAktif * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === slideAktif));
    }
    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => { pindahSlide(slideAktif - 1); resetAuto(); });
        btnNext.addEventListener('click', () => { pindahSlide(slideAktif + 1); resetAuto(); });
    }
    dots.forEach(d => d.addEventListener('click', () => {
        pindahSlide(parseInt(d.getAttribute('data-i')));
        resetAuto();
    }));
    function mulaiAuto()  { timerAuto = setInterval(() => pindahSlide(slideAktif + 1), 5000); }
    function resetAuto()  { clearInterval(timerAuto); mulaiAuto(); }
    mulaiAuto();
}

/* ========== COUNTER ANIMATION ========== */
const counterEls = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 20);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target + (target > 5 ? '+' : '');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 20);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ========== FILTER PROJECT ========== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* ========== CONTACT FORM ========== */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        btn.disabled = true;
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                form.reset();
                form.style.display = 'none';
                successMsg.style.display = 'block';
            } else {
                alert('Gagal mengirim. Coba lagi.');
            }
        } catch (error) {
            alert('Error jaringan.');
        } finally {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
            btn.disabled = false;
        }
    });
}

/* ========== ROBOT ANIMATION (Lottie) ========== */
const robotContainer = document.getElementById('hero-robot');
if (robotContainer && typeof lottie !== 'undefined') {
    lottie.loadAnimation({
        container: robotContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets10.lottiefiles.com/packages/lf20_xyadoh9h.json'
    });
}

/* ========== TYPING EFFECT ========== */
const listKata = ['Full-Stack Developer', 'UI / UX Designer', 'Problem Solver', 'Creative Thinker', 'Freelancer Berpengalaman'];
let idxKata = 0, idxChar = 0, hapus = false;
const elKetik = document.getElementById('typed-text');
if (elKetik) {
    function animasiKetik() {
        const kata = listKata[idxKata];
        if (hapus) {
            elKetik.textContent = kata.substring(0, idxChar - 1);
            idxChar--;
            if (idxChar === 0) {
                hapus = false;
                idxKata = (idxKata + 1) % listKata.length;
                setTimeout(animasiKetik, 380);
                return;
            }
            setTimeout(animasiKetik, 55);
        } else {
            elKetik.textContent = kata.substring(0, idxChar + 1);
            idxChar++;
            if (idxChar === kata.length) {
                hapus = true;
                setTimeout(animasiKetik, 1900);
                return;
            }
            setTimeout(animasiKetik, 88);
        }
    }
    setTimeout(animasiKetik, 800);
}

/* ========== AI CHATBOT (LOCAL ONLY - NO API, NO GROQ) ========== */
(function() {
    const toggle = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const close = document.getElementById('chat-close');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const badge = document.querySelector('.chat-badge');
    
    if (!toggle || !panel) return;
    
    let isOpen = false;
    
    // Database pengetahuan (SEMUA JAWABAN LANGSUNG DARI SINI)
    const info = {
        nama: 'Mohamad Rosyadi',
        panggilan: 'Rosyad atau Bos',
        umur: '22 tahun',
        domisili: 'Jakarta, Indonesia',
        skill: 'HTML, CSS, JavaScript, React.js, Node.js, UI/UX Design (Figma), Database SQL/NoSQL, Full-stack Developer',
        pengalaman: '5+ tahun di bidang web development & UI/UX design',
        proyek: '1. Toko Online Modern (React + Node.js + MongoDB)\n2. Dashboard Analitik (Vue.js + D3.js)\n3. Aplikasi Manajemen Tugas (React Native + Firebase)',
        kontak: 'Email: mohamadrosyad1927@gmail.com\nTelepon/WA: +62 898 4515 022',
        status: 'Tersedia untuk project baru'
    };
    
    function getResponse(msg) {
        const t = msg.toLowerCase();
        
        // Kata kunci dan respons
        if (/(hai|halo|hi|pagi|siang|malam|assalam|helo|hello|hy|hey)/.test(t)) 
            return 'Halo Bos! 👋 Ada yang bisa gue bantu? Tanyain aja tentang skill, proyek, atau kontak portfolio ini.';
        
        if (/(nama|siapa|kamu siapa|pemilik|owner|rosyad)/.test(t)) 
            return `Pemilik website ini ${info.nama} (${info.panggilan}). Keren kan Bos? 😎`;
        
        if (/(umur|usia|berapa umur|umurmu)/.test(t)) 
            return `${info.nama} umur ${info.umur}. Masih muda tapi jagoan! 💪`;
        
        if (/(skill|bisa|kuasai|keahlian|kemampuan|bisa apa)/.test(t)) 
            return `Skill andalan: ${info.skill}. Siap bikin project apapun Bos! 🚀`;
        
        if (/(proyek|project|portofolio|kerjaan|pernah buat|tunjukin)/.test(t)) 
            return `Proyek unggulan:\n${info.proyek}\n\nCek detailnya di bagian Projects ya Bos!`;
        
        if (/(kontak|email|wa|telepon|hubungi|gmail|whatsapp)/.test(t)) 
            return `📧 ${info.kontak}\n\nFast response, Bos! Langsung chat aja. 💬`;
        
        if (/(lokasi|tinggal|kota|domisili|dimana)/.test(t)) 
            return `Bos tinggal di ${info.domisili}. Siap kerja remote/WFO! 🇮🇩`;
        
        if (/(pengalaman|tahun|pengalaman kerja|exp)/.test(t)) 
            return info.pengalaman;
        
        if (/(tersedia|available|order|jasa|freelance|butuh)/.test(t)) 
            return `${info.status}. Langsung hubungi kontak di atas ya Bos! 🎯`;
        
        if (/(tentang|website ini|dibuat|portfolio ini|about)/.test(t)) 
            return `Website portfolio ini dibuat oleh ${info.nama} dengan bantuan AI (termasuk gue). Kolaborasi manusia & mesin! 🤝🤖`;
        
        if (/(terima kasih|makasih|thanks|thank|ok|oke|sip)/.test(t)) 
            return `Sama-sama Bos! Senang bisa bantu. Kapan-kapan cobain project saya ya 😎`;
        
        if (/(lucu|joke|lawak|gokil|humor|ngakak)/.test(t)) 
            return `Kenapa developer suka kopi? Karena kopi bikin mereka "java" jadi lancar! ☕😂\n\nEh tapi serius, tanya tentang portfolio aja ya Bos.`;
        
        // Default response
        return `Wah Bos, saya kurang paham tentang "${msg}". Coba tanya tentang: nama, skill, proyek, kontak, atau ketersediaan saya ya. 📌 Atau langsung email ke ${info.kontak.split('\n')[0]} untuk diskusi lebih lanjut!`;
    }
    
    function addMessage(text, role) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'message bot typing';
        typing.innerHTML = '<div class="message-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        return typing;
    }
    
    function removeTyping(typingEl) {
        if (typingEl && typingEl.parentNode) typingEl.remove();
    }
    
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;
        send.disabled = true;
        
        const typing = showTyping();
        
        setTimeout(() => {
            removeTyping(typing);
            const reply = getResponse(text);
            addMessage(reply, 'bot');
            input.disabled = false;
            send.disabled = false;
            input.focus();
        }, 300);
    }
    
    // Event listeners
    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.remove('chat-hidden');
            if (badge) badge.style.display = 'none';
            input.focus();
            if (messages.children.length === 0) {
                addMessage('Halo Bos! 👋 Gue RsdAI, asisten virtual portfolio Mohamad Rosyadi. Tanya aja tentang skill, proyek, kontak, atau apapun tentang portfolio ini!', 'bot');
            }
        } else {
            panel.classList.add('chat-hidden');
        }
    });
    
    if (close) {
        close.addEventListener('click', () => {
            isOpen = false;
            panel.classList.add('chat-hidden');
        });
    }
    
    if (send) send.addEventListener('click', sendMessage);
    if (input) input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();


/* ========== PROJECT SLIDESHOW ========== */
const projectImages = {
    'slideshow-proj1': [
        'https://picsum.photos/seed/proj1a/400/300',
        'https://picsum.photos/seed/proj1b/400/300',
        'https://picsum.photos/seed/proj1c/400/300'
    ],
    'slideshow-proj2': [
        'https://picsum.photos/seed/proj2a/400/300',
        'https://picsum.photos/seed/proj2b/400/300'
    ],
    'slideshow-proj3': [
        'https://picsum.photos/seed/proj3a/400/300',
        'https://picsum.photos/seed/proj3b/400/300',
        'https://picsum.photos/seed/proj3c/400/300'
    ]
};

Object.keys(projectImages).forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    const images = projectImages[id];
    let currentIndex = 0;
    images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Project image ${i+1}`;
        if (i === 0) img.classList.add('active');
        container.appendChild(img);
    });
    setInterval(() => {
        const imgs = container.querySelectorAll('img');
        imgs[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % imgs.length;
        imgs[currentIndex].classList.add('active');
    }, 3000);
});

/* ========== DEMO VIDEO MODAL ========== */
const demoModal = document.getElementById('demo-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

if (demoModal && modalBody && modalClose) {
    document.querySelectorAll('.btn-demo-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = btn.getAttribute('data-video');
            modalBody.innerHTML = `
                <h3>Demo Proyek</h3>
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
                    <iframe src="${videoUrl}?autoplay=1" 
                            style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
                <p style="margin-top:16px;text-align:center;">Klik di luar untuk menutup.</p>
            `;
            demoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose.addEventListener('click', () => {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
        modalBody.innerHTML = '';
    });
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            demoModal.classList.remove('active');
            document.body.style.overflow = '';
            modalBody.innerHTML = '';
        }
    });
}

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const tujuan = document.querySelector(this.getAttribute('href'));
        if (!tujuan) return;
        e.preventDefault();
        window.scrollTo({ top: tujuan.offsetTop - 76, behavior: 'smooth' });
    });
});

/* ========== 3D TILT EFFECT ========== */
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
});

/* ========== BACKGROUND 3D (Three.js) ========== */
if (document.getElementById('bg-3d') && window.innerWidth > 768) { // Jalanin cuma di desktop biar enteng
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparan
    document.getElementById('bg-3d').appendChild(renderer.domElement);

    // Warna aksen oranye portfolio
    const accentColor = new THREE.Color('#f97316');

    // --- Objek 3D: Torus (Cincin) ---
    const torusGeo = new THREE.TorusGeometry(2.2, 0.8, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.25 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(2, -1.2, -5);
    scene.add(torus);

    // --- Objek 3D: Icosahedron (Bola Segi 20) ---
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const icoMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.18 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-2.8, 1.6, -4);
    scene.add(ico);

    // --- Objek 3D: Octahedron (Diamond) ---
    const octGeo = new THREE.OctahedronGeometry(1.1);
    const octMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.28 });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(0.5, 2.4, -3);
    scene.add(oct);

    // --- Partikel Bintang ---
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 800;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
        starsPos[i] = (Math.random() - 0.5) * 15;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starsGeo, starsMat);
    stars.position.set(0, -1, -2);
    scene.add(stars);

    camera.position.z = 6;

    // Animasi
    function animate() {
        requestAnimationFrame(animate);

        // Putar objek perlahan
        torus.rotation.x += 0.0008;
        torus.rotation.y += 0.0015;
        ico.rotation.x -= 0.0005;
        ico.rotation.y -= 0.0012;
        oct.rotation.x += 0.001;
        oct.rotation.y += 0.0007;

        // Partikel melayang
        stars.rotation.y += 0.0003;

        renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Modal untuk lihat sertifikat
document.querySelectorAll('.cert-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = link.getAttribute('data-cert-img');
        
        const modalContent = `
            <div style="text-align:center;">
                <h3 style="margin-bottom:20px;">Sertifikat</h3>
                <img src="${imgSrc}" alt="Certificate" style="max-width:100%; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                <button class="btn btn-primary" style="margin-top:24px;" onclick="closeModal()">Tutup</button>
            </div>
        `;
        
        const modal = document.getElementById('demo-modal');
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = modalContent;
        modal.style.display = 'flex';
        
        // Sembunyiin tombol close bawaan kalo perlu
        const closeBtn = document.querySelector('#modal-close');
        if(closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }
    });
});

function closeModal() {
    document.getElementById('demo-modal').style.display = 'none';
}