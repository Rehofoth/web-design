
// =====================================
// AURORA — JAVASCRIPT
// =====================================


// 1. PRELOADER
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    setTimeout(() => {
        preloader.classList.add("hide");
    }, 1000);
});


// 2. MOBILE NAVIGATION
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");

    menuBtn.textContent = navbar.classList.contains("active")
        ? "✕"
        : "☰";
});

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuBtn.textContent = "☰";
    });
});


// 3. DARK AND LIGHT MODE
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("aurora-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

function updateThemeButton() {
    themeToggle.textContent =
        document.body.classList.contains("dark-mode") ? "☀" : "☾";
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const currentTheme =
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

    localStorage.setItem("aurora-theme", currentTheme);

    updateThemeButton();
});


// 4. DESTINATION FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");
const destinationCards = document.querySelectorAll(".destination-card");
const emptyMessage = document.getElementById("emptyMessage");

let currentCategory = "all";
let currentSearch = "";

function filterDestinations() {
    let visibleCount = 0;

    destinationCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;

        const matchesSearch =
            name.includes(currentSearch.toLowerCase());

        const visible = matchesCategory && matchesSearch;

        card.style.display = visible ? "" : "none";

        if (visible) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.dataset.filter;

        filterDestinations();
    });
});


// 5. DESTINATION SEARCH
const destinationSearch =
    document.getElementById("destinationSearch");

const searchBtn = document.getElementById("searchBtn");

destinationSearch.addEventListener("input", () => {
    currentSearch = destinationSearch.value.trim();

    filterDestinations();
});

searchBtn.addEventListener("click", event => {
    event.preventDefault();

    currentSearch = destinationSearch.value.trim();

    filterButtons.forEach(btn =>
        btn.classList.remove("active")
    );

    document.querySelector('[data-filter="all"]')
        .classList.add("active");

    currentCategory = "all";

    filterDestinations();

    document.getElementById("destinations")
        .scrollIntoView({ behavior: "smooth" });
});


// 6. EXPERIENCE SEARCH
const experienceSelect =
    document.getElementById("experienceSelect");

experienceSelect.addEventListener("change", () => {
    const selected = experienceSelect.value;

    if (!selected) {
        currentSearch = "";
        destinationSearch.value = "";
        currentCategory = "all";

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        document.querySelector('[data-filter="all"]')
            .classList.add("active");

        filterDestinations();
        return;
    }

    const experienceDestinations = {
        Adventure: ["Cape Town"],
        Beach: ["Zanzibar", "Santorini"],
        Culture: ["Tokyo", "Paris"],
        Nature: ["Cape Town", "Zanzibar"],
        Food: ["Tokyo", "Paris", "New York"]
    };

    const matches = experienceDestinations[selected];

    destinationCards.forEach(card => {
        const name = card.querySelector("h3").textContent;

        const visible = matches.includes(name);

        card.style.display = visible ? "" : "none";
    });

    emptyMessage.hidden = matches.length > 0;
});


// 7. FAVOURITE DESTINATIONS
const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

let favorites = JSON.parse(
    localStorage.getItem("aurora-favorites") || "[]"
);

function updateFavorites() {
    favoriteButtons.forEach(button => {
        const card = button.closest(".destination-card");
        const name = card.dataset.name;

        const isFavorite = favorites.includes(name);

        button.classList.toggle("active", isFavorite);
        button.textContent = isFavorite ? "♥" : "♡";
        button.setAttribute("aria-pressed", isFavorite);
    });

    localStorage.setItem(
        "aurora-favorites",
        JSON.stringify(favorites)
    );
}

updateFavorites();

favoriteButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".destination-card");
        const name = card.dataset.name;

        if (favorites.includes(name)) {
            favorites = favorites.filter(item => item !== name);
        } else {
            favorites.push(name);
        }

        updateFavorites();
    });
});


// 8. TRIP PLANNER
const tripForm = document.getElementById("tripForm");
const tripResult = document.getElementById("tripResult");

const tripStart = document.getElementById("tripStart");
const tripEnd = document.getElementById("tripEnd");

tripStart.addEventListener("change", () => {
    tripEnd.min = tripStart.value;
});

tripForm.addEventListener("submit", event => {
    event.preventDefault();

    const destination =
        document.getElementById("tripDestination").value.trim();

    const startDate = tripStart.value;
    const endDate = tripEnd.value;

    const people = Number(
        document.getElementById("tripPeople").value
    );

    if (!destination || !startDate || !endDate || people < 1) {
        alert("Please complete all trip details.");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert("Return date cannot be before departure date.");
        return;
    }

    const trip = {
        destination,
        startDate,
        endDate,
        people,
        createdAt: new Date().toISOString()
    };

    const trips = JSON.parse(
        localStorage.getItem("aurora-trips") || "[]"
    );

    trips.push(trip);

    localStorage.setItem(
        "aurora-trips",
        JSON.stringify(trips)
    );

    tripResult.innerHTML = `
        <h3>✓ Your trip has been saved!</h3>
        <p>Destination: ${escapeHTML(destination)}</p>
        <p>Departure: ${startDate}</p>
        <p>Return: ${endDate}</p>
        <p>Travellers: ${people}</p>
    `;

    tripForm.reset();
});


// 9. BUDGET CALCULATOR
const calculateBudget =
    document.getElementById("calculateBudget");

calculateBudget.addEventListener("click", () => {

    const fields = [
        "transportCost",
        "hotelCost",
        "foodCost",
        "activityCost"
    ];

    const values = fields.map(id => {
        const input = document.getElementById(id);
        return input.value.trim() === "" ? 0 : Number(input.value);
    });

    if (values.some(value => !Number.isFinite(value) || value < 0)) {
        alert("Enter valid non-negative budget amounts.");
        return;
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    document.getElementById("budgetTotal").textContent =
        "₦" + total.toLocaleString("en-NG");

    localStorage.setItem("aurora-budget", total);
});


// 10. NEWSLETTER
const newsletterForm =
    document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const email =
        document.getElementById("newsletterEmail").value.trim();

    const message =
        document.getElementById("newsletterMessage");

    const subscribers = JSON.parse(
        localStorage.getItem("aurora-subscribers") || "[]"
    );

    if (subscribers.includes(email.toLowerCase())) {
        message.textContent = "This email is already registered.";
        return;
    }

    subscribers.push(email.toLowerCase());

    localStorage.setItem(
        "aurora-subscribers",
        JSON.stringify(subscribers)
    );

    message.textContent =
        "Thank you! Your subscription has been saved locally.";

    newsletterForm.reset();
});


// 11. CONTACT FORM
const contactForm =
    document.getElementById("contactForm");

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name =
        document.getElementById("contactName").value.trim();

    const email =
        document.getElementById("contactEmail").value.trim();

    const subject =
        document.getElementById("contactSubject").value.trim();

    const message =
        document.getElementById("contactMessage").value.trim();

    const feedback =
        document.getElementById("contactFeedback");

    if (!name || !email || !subject || !message) {
        feedback.textContent = "Please complete every field.";
        return;
    }

    const messages = JSON.parse(
        localStorage.getItem("aurora-messages") || "[]"
    );

    messages.push({
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
    });

    localStorage.setItem(
        "aurora-messages",
        JSON.stringify(messages)
    );

    feedback.textContent =
        "Your message has been saved locally. Thank you!";

    contactForm.reset();
});


// 12. SAFE HTML TEXT
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// 13. HEADER SCROLL EFFECT
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");

    header.style.boxShadow =
        window.scrollY > 50
            ? "0 5px 25px rgba(0,0,0,0.08)"
            : "none";
});


// =====================================
// AURORA INITIALIZATION
// =====================================

console.log("AURORA is running successfully!");

// =====================================
// AURORA DESTINATION DETAILS
// =====================================

const destinationModal = document.getElementById("destinationModal");
const closeDestinationModal = document.getElementById("closeDestinationModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalHighlights = document.getElementById("modalHighlights");
const modalPlanBtn = document.getElementById("modalPlanBtn");

const destinationDetails = {
    "Paris": {
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        description: "Explore the romance, architecture, art and unforgettable atmosphere of Paris, France.",
        highlights: ["Eiffel Tower", "Louvre Museum", "Seine River", "Notre-Dame Cathedral"]
    },

    "Cape Town": {
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
        description: "Discover beautiful coastlines, mountain views and vibrant South African culture.",
        highlights: ["Table Mountain", "Cape Point", "Boulders Beach", "V&A Waterfront"]
    },

    "Tokyo": {
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
        description: "Experience a fascinating combination of Japanese tradition and modern technology.",
        highlights: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji Temple", "Shinjuku"]
    },

    "New York": {
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
        description: "Experience the energy, entertainment and iconic landmarks of New York City.",
        highlights: ["Times Square", "Central Park", "Statue of Liberty", "Brooklyn Bridge"]
    },

    "Zanzibar": {
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
        description: "Enjoy tropical beaches, turquoise waters and the rich history of Zanzibar.",
        highlights: ["Nungwi Beach", "Stone Town", "Prison Island", "Mnemba Island"]
    },

    "Santorini": {
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
        description: "Discover beautiful Greek island scenery, coastal villages and spectacular sunsets.",
        highlights: ["Oia Village", "Red Beach", "Fira", "Amoudi Bay"]
    }
};

function openDestinationModal(name) {
    const destination = destinationDetails[name];

    if (!destination) return;

    modalImage.src = destination.image;
    modalImage.alt = name;
    modalTitle.textContent = name;
    modalDescription.textContent = destination.description;

    modalHighlights.innerHTML = "";

    destination.highlights.forEach(highlight => {
        const li = document.createElement("li");
        li.textContent = highlight;
        modalHighlights.appendChild(li);
    });

    destinationModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeDestinationDetails() {
    destinationModal.classList.remove("active");
    document.body.style.overflow = "";
}

document.querySelectorAll(".destination-card").forEach(card => {
    card.addEventListener("click", event => {
        if (event.target.closest(".favorite-btn")) return;

        const name = card.dataset.name ||
            card.querySelector("h3")?.textContent.trim();

        openDestinationModal(name);
    });
});

closeDestinationModal.addEventListener("click", closeDestinationDetails);

destinationModal.addEventListener("click", event => {
    if (event.target === destinationModal) {
        closeDestinationDetails();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeDestinationDetails();
    }
});

modalPlanBtn.addEventListener("click", () => {
    const destination = modalTitle.textContent;

    closeDestinationDetails();

    const planner = document.getElementById("tripDestination");

    if (planner) {
        planner.value = destination;
        document.getElementById("tripForm")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
});