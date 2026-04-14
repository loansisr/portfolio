// --- 1. Gestion du Smooth Scroll (Fusionné et optimisé) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- 2. Animation d'apparition au scroll ---
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Déclenche l'animation quand la section est à 100px du bas
        if (sectionTop < windowHeight - 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// --- 3. Typed.js (Texte animé) ---
if (document.querySelector('.typing')) {
    const typed = new Typed('.typing', {
        strings: [
            "Étudiant en BTS SIO SISR", 
            "Futur Administrateur Système et Réseaux", 
            "Optimisation et Sobriété Numérique" // <--- Modification ici
        ],
        typeSpeed: 60,
        backSpeed: 20,
        loop: true
    });
}

// --- 4. Animation des Disques NAS (Indépendants) ---
document.querySelectorAll('.hard-drive').forEach(drive => {
    const terminal = drive.querySelector('.terminal');
    if (!terminal) return; 
    
    // On sauvegarde le contenu HTML initial de CE disque précis
    const originalContent = terminal.innerHTML; 

    drive.addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        
        // Cas 1 : Si le disque est déjà ouvert -> ON FERME
        if (isActive) {
            this.classList.remove('active');
            terminal.innerHTML = originalContent; // Remet le texte statique instantanément
            return;
        }

        // Cas 2 : Si le disque est fermé -> ON OUVRE (sans fermer les autres)
        this.classList.add('active');
        terminal.innerHTML = ''; // On vide pour l'animation

        const parser = new DOMParser();
        const doc = parser.parseFromString(originalContent, 'text/html');
        const lines = doc.querySelectorAll('.terminal-line');

        lines.forEach((line, lineIndex) => {
            setTimeout(() => {
                const lineElement = document.createElement('div');
                lineElement.className = line.className;
                terminal.appendChild(lineElement);

                const text = line.textContent;
                let charIndex = 0;
                
                // Effet de frappe
                const typingInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        lineElement.textContent += text[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                    }
                }, 10); // Vitesse très rapide (10ms)
            }, lineIndex * 150); // Délai entre les lignes réduit
        });
    });
});

// --- Gestion de la Modale PDF ---
const modal = document.getElementById("pdfModal");
const pdfViewer = document.getElementById("pdfViewer");
const spinner = document.getElementById("loadingSpinner");

window.openModal = function(pdfUrl) {
    if (!modal) return;

    // 1. Gestion du bouton "Nouvel onglet"
    const btnNewTab = document.getElementById("btnNewTab");
    if (btnNewTab) {
        btnNewTab.onclick = function(e) {
            e.preventDefault(); 
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            closeModal(); 
        };
    }

    // 2. Gestion de l'affichage (L'ordre est crucial)
    if (pdfViewer) {
        if (spinner) spinner.style.display = "block";
        
        // On cache l'iframe sans le supprimer du flux (évite le bug du onload)
        pdfViewer.style.opacity = "0";
        pdfViewer.style.display = "block"; 

        // On définit l'événement AVANT de changer la source
        pdfViewer.onload = function() {
            if (spinner) spinner.style.display = "none";
            pdfViewer.style.opacity = "1";
        };

        pdfViewer.src = pdfUrl;
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
};

// 3. Fonction de fermeture
function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    if (pdfViewer) {
        pdfViewer.src = ""; // Libère la RAM serveur
        pdfViewer.style.opacity = "0";
    }
    document.body.style.overflow = "auto";
}

// 4. Gestionnaires d'événements (Bouton X et Clic extérieur)
const closeBtn = document.querySelector(".close-btn");
if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) closeModal();
};