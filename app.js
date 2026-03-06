// Elements del DOM
const homeScreen = document.getElementById('home-screen'); // Pantalla de Home
const playerScreen = document.getElementById('player-screen'); // Pantalla de reproduir vídeo
const profileScreen = document.getElementById('profile-screen'); // Pantalla de perfil

// Part inferior
const navHome = document.getElementById('nav-home'); // Nav Home
const navProfile = document.getElementById('nav-profile'); // Nav de perfil

// Elements llistes
const videoList = document.getElementById('video-list'); // tots els vídeos de la web
const recentVideoList = document.getElementById('recent-video-list'); // vídeos vistos
const filtersContainer = document.getElementById('filters-container');  // secció on hi ha els botons per filtrar per categories
const btnBack = document.getElementById('btn-back'); // botó enrere

// Reproductor
const videoEl = document.getElementById('main-video'); // vídeo
const btnPlayPause = document.getElementById('btn-play-pause'); // botó pausa
const progressBar = document.getElementById('progress-bar'); // barra progressiva del vídeo
const currentTimeEl = document.getElementById('current-time'); // temps pel qual passa el vídeo
const totalTimeEl = document.getElementById('total-time'); // duració total del vídeo
const btnMute = document.getElementById('btn-mute'); // botó silenciar 
const volumeSlider = document.getElementById('volume-slider'); // botó volum
const playerTitle = document.getElementById('player-title'); // Títol del vídeo
const playerCategory = document.getElementById('player-category'); // etiqueta de la categoria a sota del vídeo (NOU)
const playerDesc = document.getElementById('player-desc'); // descripció de cada vídeo/recepta
const btnLike = document.getElementById('btn-like'); // botó per donar like

// Perfil
const inputNom = document.getElementById('prof-nom'); // nom usuari
const inputCognom = document.getElementById('prof-cognom'); // cognom usuari
const inputEmail = document.getElementById('prof-email'); // email
const inputData = document.getElementById('prof-data'); // data de naixement
const btnEditProfile = document.getElementById('btn-edit-profile'); // botó editar perfil

let currentVideoId = null;  // Guarda l'ID del vídeo que s'està reproduint en aquest moment
let videosData = []; // les dades obtingudes del js es posen aquí per ser llegides 
let currentCategory = 'Todos';  // diu quina categoria de menjar està activa en cada moment (per defecte tots)
let isEditingProfile = false; // indica si el perfil es pot editar o només llegir les dades


// Quan s'executa aquest arxiu, l'HTML ja ha llegit data/data.js
window.onload = function() {
    // Mira si ja tenim la llista guardada a la memòria del navegador que sigui
    const guardat = localStorage.getItem('videosls');
    
    if (guardat) {
        // si ja hi és, la traduïm i l'agafem aquí
        videosData = JSON.parse(guardat);
    } else {
        // Si és el primer cop que entrem, agafa la informació del fitxer data.
        videosData = videos; 
        // la guarda a la memòria (com a l'esquema de la pissarra)
        localStorage.setItem('videosls', JSON.stringify(videos));
    }

    renderFilters();     // dibuixa els botons de les categories
    renderVideoList();   // dibuixa el bloc de cada vídeo
    loadProfileData();   // mostra les dades del perfil
    mostrarBenvinguda(); //dona la benvinguda
};



navHome.addEventListener('click', () => { // Quan cliquem el botó Home de la barra de sota
    // Mostra el Home
    homeScreen.style.display = 'block'; // ensenya la pantalla principal
    profileScreen.style.display = 'none'; // amaga la pantalla de perfil
    playerScreen.style.display = 'none'; // amaga la pantalla de reproducció de vídeo
    
    // marca el botó de la pàgina en la qual ens trobem 
    navHome.classList.add('active'); // Posa "negreta" el botó de Home perquè sembli seleccionat
    navProfile.classList.remove('active'); // li treu el color de seleccionat al botó de Perfil 
    
    videoEl.pause(); // pausa el vídeo
    renderVideoList();  // torna a dibuixar els blocs dels vídeos (per si hem donat like o hem vist un vídeo nou s'actualitzi)
});

navProfile.addEventListener('click', () => { // event quan cliquem el botó de Perfil a baix de tot
    // Mostrar perfil
    profileScreen.style.display = 'block'; // ensenya la pantalla del perfil
    homeScreen.style.display = 'none'; // amaga la pantalla principal (Home)
    playerScreen.style.display = 'none'; // amaga el reproductor de vídeo (per si estava obert algun vídeo)
    
    // Marca el botó de la pàgina on som
    navProfile.classList.add('active');  // Posa el botó de Perfil en "negreta"
    navHome.classList.remove('active');  // li treu la negreta posada al botó de Home
    
    videoEl.pause(); // pausa el vídeo
    loadProfileData();  // carrega les dades de l'usuari (guardades al localstorage)
});

// Funció que carrega les dades del perfil (nom, cognom, correu, i data de naixement)
function loadProfileData() {
    inputNom.value = localStorage.getItem('prof_nom') || '';
    inputCognom.value = localStorage.getItem('prof_cognom') || '';
    inputEmail.value = localStorage.getItem('prof_email') || '';
    inputData.value = localStorage.getItem('prof_data') || '';
    // Agafa les dades guardades a la memòria (localStorage) i les posa al lloc que li toca.
    // el || '' és perquè si és el primer cop que entrem i no hi ha res guardat, la caixa agafi el que li diem a l'HTML (exemple) en comptes de null.
}



btnEditProfile.addEventListener('click', () => { // quan es clica el botó editar (del perfil)
    if (!isEditingProfile) {// si no estàvem editant, es posa per editar 
        isEditingProfile = true;
        // canviem el text del botó i afegim la classe per canviar-lo de color
        btnEditProfile.textContent = 'Desar Canvis';
        btnEditProfile.classList.add('save-mode');
        
        // totes les caixetes es desbloqueixen per poder escriure
        inputNom.disabled = false;
        inputCognom.disabled = false;
        inputEmail.disabled = false;
        inputData.disabled = false;
        
        inputNom.focus(); // això fa que el ratolí es posi directament al lloc per escriure
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // per validar el correu electronic
        
        // Comprovem si el text introduit compleix el format
        if (!emailRegex.test(inputEmail.value)) { //sino ho fa
            alert("Por favor, introduce un correo electrónico válido (ejemplo@correo.com).");
            // Torna el "ratoli"  a la caixa del correu per corregir
            inputEmail.focus(); 
            return; //no guarda ni tanca el mode edició
        }
        // si quan es clica ja estàvem editant guardem i tanquem el mode editar
        isEditingProfile = false;
        btnEditProfile.textContent = 'Editar Perfil'; // tornem a posar el text normal al botó
        btnEditProfile.classList.remove('save-mode'); // li treu el color verd
        
        // totes les caixetes tenen el disabled perquè es puguin llegir però no editar
        inputNom.disabled = true;
        inputCognom.disabled = true;
        inputEmail.disabled = true;
        inputData.disabled = true;
        
        // guarda les noves dades escrites al LocalStorage
        localStorage.setItem('prof_nom', inputNom.value);
        localStorage.setItem('prof_cognom', inputCognom.value);
        localStorage.setItem('prof_email', inputEmail.value);
        localStorage.setItem('prof_data', inputData.value);
    }
});

// aquesta funció dibuixa els botons de les categories
function renderFilters() {
    // llista amb els noms de totes les categories de la web (Hem afegit la de M'agrada!)
    const categories = ['Todos', 'Me gusta', 'Cenas Rápidas', 'Vegetariano', 'Pasta', 'Postres', 'Clásicos'];
    filtersContainer.innerHTML = ''; // buida espais buits
    
    // for que passa per cada paraula de la llista per fer-ne un botó.
    categories.forEach(cat => { 
        const btn = document.createElement('button'); // Crea l'etiqueta button
        btn.className = `filter-btn ${cat === currentCategory ? 'active' : ''}`; // Li posa la classe d'estil. Si és la categoria que estem mirant, li afegeix active perquè es pinti de fosc.
        btn.textContent = cat; // posa la paraula a dins del botó
        
        
        btn.addEventListener('click', () => { // quan es clica el botó
            currentCategory = cat; // guarda quina categoria hem clicat
            renderFilters(); // torna a dibuixar botons (la categoria actual fosca i la resta clara)
            renderVideoList(); // Torna a dibuixar les caixetes de les receptes perquè només surtin les de la categoria triada
        });
        filtersContainer.appendChild(btn); // quan el botó està creat amb tot el que volem el posa a la pantalla. 
        });
    }

// aquesta funció s'encarrega de dibuixar totes les caixetes de receptes dels vídeos
function renderVideoList() {
    videoList.innerHTML = '';
    recentVideoList.innerHTML = '';
    let hasRecent = false;

    // Creem una llista de vídeos vistos amb la seva data per poder ordenar-los ---
    const vistosAmbData = [];
    
    videosData.forEach(video => {
        const tempsVist = localStorage.getItem(`vist_${video.id}`);
        if (tempsVist) {
            vistosAmbData.push({ ...video, dataVista: parseInt(tempsVist) });
        }
    });

    // Ordenem els vídeos vistos: el que té la data més gran (més recent) va primer
    vistosAmbData.sort((a, b) => b.dataVista - a.dataVista);

    // Dibuixem el slider horitzontal amb l'ordre correcte
    vistosAmbData.forEach(video => {
        hasRecent = true;
        const isLiked = localStorage.getItem(`like_${video.id}`);
        const likeIcon = isLiked ? '<i class="fa-solid fa-heart icona-like"></i>' : '';
        const textCategories = Array.isArray(video.categoria) ? video.categoria.join(', ') : video.categoria;

        const bigCard = document.createElement('div');
        bigCard.className = 'video-card-big';
        bigCard.innerHTML = `
            <img src="${video.miniatura}" alt="${video.titol}">
            <div class="card-content">
                <h3>${video.titol}</h3>
                <div class="category">${textCategories} • ${video.durada_total} ${likeIcon}</div>
                <p class="desc-preview">${video.descripcio}</p>
            </div>
        `;
        bigCard.addEventListener('click', () => openPlayer(video));
        recentVideoList.appendChild(bigCard); // Aquí fem appendChild perquè la llista ja està ordenada de més nou a més vell
    });

    // Llista vertical (la de sota, filtrada)
    videosData.forEach(video => {
        const isVist = localStorage.getItem(`vist_${video.id}`);
        const isLiked = localStorage.getItem(`like_${video.id}`);
        const vistIcon = isVist ? '<i class="fa-regular fa-eye icona-vist"></i>' : '';
        const likeIcon = isLiked ? '<i class="fa-solid fa-heart icona-like"></i>' : '';
        const textCategories = Array.isArray(video.categoria) ? video.categoria.join(', ') : video.categoria;

        if (currentCategory === 'Todos' || (currentCategory === "Me gusta" && isLiked) || video.categoria.includes(currentCategory)) { 
            const smallCard = document.createElement('div');
            smallCard.className = 'video-card-small';
            smallCard.innerHTML = `
                <img src="${video.miniatura}" alt="${video.titol}">
                <div class="card-content">
                    <h3>${video.titol}</h3>
                    <div class="category">${textCategories} • ${video.durada_total} ${vistIcon} ${likeIcon}</div>
                    <p class="desc-preview">${video.descripcio}</p>
                </div>
            `;
            smallCard.addEventListener('click', () => openPlayer(video));
            videoList.appendChild(smallCard);
        }
    });

    recentVideoList.style.display = hasRecent ? 'flex' : 'none';

    const recentTitle = document.getElementById('recent-title');

    if (recentTitle) {
        recentTitle.style.display = hasRecent ? 'block' : 'none';
    }
    
    recentVideoList.style.display = hasRecent ? 'flex' : 'none';
}

// aquesta funció s'executa quan cliquem una de les caixetes dels vídeos per obrir-lo
function openPlayer(video) {
    currentVideoId = video.id; // guardem a la memòria quin vídeo estem veient
    
    // amaguem tot i mostrem només el reproductor
    homeScreen.style.display = 'none';
    profileScreen.style.display = 'none';
    playerScreen.style.display = 'block';

    // posem el títol i la descripció del vídeo que hem clicat
    playerTitle.textContent = video.titol;
    playerCategory.textContent = video.categoria;
    playerDesc.innerHTML = video.descripcio; // aquest es inerHTML perque accepti salts de linea, la resta no calen
    videoEl.src = video.url;
    videoEl.poster = video.miniatura; //afegir l'imatge del plat abans de que s'inici el video
    
    // Ho posem tot al principi i botó per posar play
    videoEl.currentTime = 0;
    progressBar.value = 0;
    btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    // ajusta el volum i l'emoji de l'altaveu
    volumeSlider.value = videoEl.volume;
    btnMute.innerHTML = videoEl.volume === 0 ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';

    const savedTime = localStorage.getItem(`temps_${video.id}`); // mira si ja havíem començat a veure aquest vídeo abans
    if (savedTime) {
        videoEl.currentTime = parseFloat(savedTime); // si ja el vam començar està guardat al localstorage i avancem el vídeo fins aquell moment
    }
    
    // si li havíem donat "like" es pinta el cor vermell i sinó de blanc
    const isLiked = localStorage.getItem(`like_${video.id}`);
    if (isLiked) {
        btnLike.innerHTML = '<i class="fa-solid fa-heart"></i> Me Gusta';
        btnLike.classList.add('liked'); // pinta el botó vermell
    } else {
        btnLike.innerHTML = '<i class="fa-regular fa-heart"></i> Me Gusta';
        btnLike.classList.remove('liked');
    }

    // marquem el vídeo que hem vist perquè surti a vistos recentment.
    localStorage.setItem(`vist_${video.id}`, Date.now()); 
}

// botó play-pause
btnPlayPause.addEventListener('click', () => { // quan el cliquem
    if (videoEl.paused) { // si el vídeo està aturat el posem en marxa i posem la icona que toca
        videoEl.play();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else { // si el vídeo estava funcionant s'atura i posa la icona que toca
        videoEl.pause();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});

// barra volum
volumeSlider.addEventListener('input', () => { // quan es mou la barra
    videoEl.volume = volumeSlider.value; // posem el valor on hem posat la barra a l'àudio
    btnMute.innerHTML = videoEl.volume === 0 ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>'; // si es posa a 0 es canvia la icona del botó a silenciat
});

// botó silenciat
btnMute.addEventListener('click', () => {  // quan es pressiona
    if (videoEl.volume > 0) { // si s'està escoltant guardem el volum que té en el moment, el posem a 0, i canviem la icona
        videoEl.dataset.oldVolume = videoEl.volume;
        videoEl.volume = 0;
        volumeSlider.value = 0;
        btnMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {  // si el volum estava silenciat, tornem a posar el volum anterior, i canviem la icona un altre cop
        const restoreVol = videoEl.dataset.oldVolume || 1;
        videoEl.volume = restoreVol;
        volumeSlider.value = restoreVol;
        btnMute.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});

// botó m'agrada
btnLike.addEventListener('click', () => { // quan es clica
    const isLiked = localStorage.getItem(`like_${currentVideoId}`); // mira a la memòria si aquest vídeo ja tenia like
    
    // si tenia like el traiem, posem el cor blanc i li posem el color habitual
    if (isLiked) {
        localStorage.removeItem(`like_${currentVideoId}`);
        btnLike.innerHTML = '<i class="fa-regular fa-heart"></i> Me Gusta';
        btnLike.classList.remove('liked');
    } else { // si no tenia like el guardem a la memòria, posem el cor ple, i se li aplica la classe
        localStorage.setItem(`like_${currentVideoId}`, 'true');
        btnLike.innerHTML = '<i class="fa-solid fa-heart"></i> Me Gusta';
        btnLike.classList.add('liked');
    }
});

// el temps s'actualitza mentre avança el vídeo, 
videoEl.addEventListener('timeupdate', () => { // s'actualitza contínuament mentre el vídeo es reprodueix
    // converteix els segons en format minuts:segons
    const currentMins = Math.floor(videoEl.currentTime / 60);
    let currentSecs = Math.floor(videoEl.currentTime % 60);
    if (currentSecs < 10) currentSecs = '0' + currentSecs; // si és menys de 10 segons, se li posa un 0 davant (exemple: 1:05)
    
    if (!isNaN(videoEl.duration)) { // si l'ordinador ja té quant dura el vídeo sencer, actualitzem el temps total i la barra.
        const totalMins = Math.floor(videoEl.duration / 60);
        let totalSecs = Math.floor(videoEl.duration % 60);
        if (totalSecs < 10) totalSecs = '0' + totalSecs;
        totalTimeEl.textContent = `${totalMins}:${totalSecs}`; // escriu el total a la pantalla
        
        // Calcula quin percentatge del vídeo s'ha vist i mou la barra fins allà
        const progress = (videoEl.currentTime / videoEl.duration) * 100;
        progressBar.value = progress;
    }

    currentTimeEl.textContent = `${currentMins}:${currentSecs}`;

    if (currentVideoId) { // només guarda el temps a la memòria si hi ha un vídeo obert
        // recorda per on ens havíem quedat si sortim del vídeo
        localStorage.setItem(`temps_${currentVideoId}`, videoEl.currentTime);
    }
});

progressBar.addEventListener('input', () => { // quan movem manualment la barra del temps
    const newTime = (progressBar.value / 100) * videoEl.duration; // calcula a quin segon es queda
    videoEl.currentTime = newTime; // posa el vídeo en aquell segon
});

btnBack.addEventListener('click', () => { // botó enrere es clica
    videoEl.pause(); // atura el vídeo 
    homeScreen.style.display = 'block'; // torna a ensenyar el home
    playerScreen.style.display = 'none'; // amaga la pantalla del reproductor
    renderVideoList(); // torna a posar els blocs amb els vídeos per si hem vist o donat like a un s'actualitzi
});


function mostrarBenvinguda() {
    const welcomeEl = document.getElementById('welcome-message');
    const nom = localStorage.getItem('prof_nom');
    
    if (nom && nom.trim() !== "") {
        welcomeEl.innerHTML = `Bienvenido/a <strong>${nom}</strong>, nos alegra verte. ¿Preparado/a para cocinar un plato delicioso?`;
        welcomeEl.style.display = 'block';
    } else {
        welcomeEl.style.display = 'none';
    }
}