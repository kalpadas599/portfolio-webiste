// Freelance Mode JS

// Mobile Menu
const sidemenu = document.getElementById("sidemenu");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

function hideSideMenu() {
    if (!sidemenu) return;
    sidemenu.classList.remove("menu-open");
}

if (openMenu) {
    openMenu.addEventListener("click", () => {
        sidemenu.classList.add("menu-open");
    });
}

if (closeMenu) {
    closeMenu.addEventListener("click", () => {
        hideSideMenu();
    });
}

window.addEventListener("resize", hideSideMenu);
document.addEventListener("DOMContentLoaded", hideSideMenu);

// Toggle Back to Personal Portfolio
const personalToggle = document.getElementById("personalToggle");
if (personalToggle) {
    personalToggle.addEventListener("click", function() {
        this.classList.remove("active");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 300);
    });
}

// Form Submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbwLuswz_e6CK_IZyo898X-G1E4wWq50iIoBYFHpF4Sr9Ta5YNW9q-hYTVLDx_BRRQhV9Q/exec'
const form = document.forms['freelance-quote'];
const msg = document.getElementById("msg");

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault()
        const formData = new FormData(form);
        formData.set('Type', 'Contact');

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                msg.innerHTML = "Project Request Sent Successfully!"
                msg.style.color = "#00ffcc";
                setTimeout(function () {
                    msg.innerHTML = ""
                }, 5000)
                form.reset()
            })
            .catch((error) => {
                msg.innerHTML = "Failed to send request.";
                msg.style.color = "#ff004f";
            });
    })
}

// --- Dynamic Rating System ---
function updateRatings() {
    const reviewsContainer = document.getElementById('reviews-list');
    if (!reviewsContainer) return;

    // Fetch ratings from Google Sheet (via Apps Script)
    fetch(scriptURL + '?action=getRatings')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                renderRatings(data);
            } else {
                reviewsContainer.innerHTML = '<p style="text-align: center; color: #ababab;">No reviews yet. Be the first to rate!</p>';
            }
        })
        .catch(err => {
            console.warn('Live ratings fetch failed (likely missing backend setup). Using showcase data.');
            renderRatings(getStaticRatings());
        });
}

function renderRatings(ratings) {
    const reviewsContainer = document.getElementById('reviews-list');
    const avgScoreEl = document.querySelector('.rating-overall h2');
    if(!reviewsContainer || !avgScoreEl) return;

    reviewsContainer.innerHTML = '';
    let totalStars = 0;
    
    // Last 6 reviews
    const recentRatings = ratings.slice(-6).reverse();
    
    recentRatings.forEach(r => {
        totalStars += Number(r.Rating);
        const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(r.Rating)) + 
                          '<i class="fa-regular fa-star"></i>'.repeat(5 - Math.floor(r.Rating));
        
        const reviewEl = document.createElement('div');
        reviewEl.className = 'review-item';
        reviewEl.innerHTML = `
            <span class="client-name">${r.ClientName || 'Anonymous Client'}</span>
            <span class="review-stars">${starsHtml}</span>
            <p>"${r.Review || 'No comment provided.'}"</p>
        `;
        reviewsContainer.appendChild(reviewEl);
    });

    const avg = (totalStars / recentRatings.length).toFixed(1);
    avgScoreEl.innerHTML = `${avg}<span>/5</span>`;
    
    // Animate the bars
    setTimeout(() => {
        document.getElementById('bar-quality').style.width = '98%';
        document.getElementById('bar-comm').style.width = '95%';
        document.getElementById('bar-speed').style.width = '92%';
    }, 500);
}

function getStaticRatings() {
    return [
        { ClientName: "Tech Solutions Inc.", Rating: 5, Review: "Kalpa delivered a high-performance landing page that boosted our leads significantly." },
        { ClientName: "A. Ray (Architect)", Rating: 5, Review: "Perfect eye for design. The architectural portfolio is exactly what I needed." },
        { ClientName: "Start-up Founder", Rating: 4, Review: "Great to work with. Highly skilled in AI and automation." }
    ];
}

// Initialize ratings
document.addEventListener('DOMContentLoaded', updateRatings);
