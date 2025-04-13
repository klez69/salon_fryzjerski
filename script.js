// Czekaj na załadowanie całej strony przed uruchomieniem skryptów
document.addEventListener("DOMContentLoaded", function () {
  // INSTAGRAM MODAL FUNCTIONALITY
  const instagramItems = document.querySelectorAll(".instagram-item");
  const modals = document.querySelectorAll(".instagram-modal");
  const closeBtns = document.querySelectorAll(".close-modal");

  // Otwieranie modali po kliknięciu na zdjęcie
  instagramItems.forEach((item) => {
    item.addEventListener("click", function () {
      const postId = this.getAttribute("data-post-id");
      const modal = document.getElementById(`${postId}-modal`);
      if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Blokuj przewijanie strony
      }
    });
  });

  // Zamykanie modali
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".instagram-modal");
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Przywróć przewijanie
    });
  });

  // Zamykanie modali po kliknięciu poza zawartością
  window.addEventListener("click", function (event) {
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  });

  // Obsługa akcji w postach (lajki, komentarze)
  const heartIcons = document.querySelectorAll(
    ".instagram-action-icons .heart-icon"
  );
  heartIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      this.classList.toggle("liked");
      const likesElement = this.closest(
        ".instagram-post-actions"
      ).querySelector(".instagram-post-likes");
      let likes = parseInt(likesElement.textContent);

      if (this.classList.contains("liked")) {
        likesElement.textContent = `${likes + 1} polubień`;
      } else {
        likesElement.textContent = `${likes - 1} polubień`;
      }
    });
  });

  // ANIMACJE PRZY PRZEWIJANIU
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .zoom-in"
  );

  // Obserwator elementów - uruchamia animacje kiedy element jest widoczny
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");

          // Jeśli element zawiera licznik, uruchom animację licznika
          const counter = entry.target.querySelector(".counter");
          if (counter) {
            startCounting(counter);
          }

          observer.unobserve(entry.target); // Przestań obserwować po animacji
        }
      });
    },
    {
      threshold: 0.15, // Uruchamia animację gdy 15% elementu jest widoczne
      rootMargin: "0px 0px -50px 0px", // Dodatkowy margines od dolnej krawędzi
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Funkcja do animacji licznika
  function startCounting(counterElement) {
    const target = parseInt(counterElement.getAttribute("data-target"));
    const duration = 2000; // 2 sekundy na animację
    const step = target / (duration / 16); // 60fps (16ms)

    let count = 0;
    const updateCounter = () => {
      count += step;
      if (count < target) {
        counterElement.innerText = Math.floor(count);
        requestAnimationFrame(updateCounter);
      } else {
        counterElement.innerText = target;
      }
    };

    // Rozpocznij animację
    updateCounter();
  }

  // PŁYNNE PRZEWIJANIE
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Offset dla menu
          behavior: "smooth",
        });
      }
    });
  });

  // EFEKT PARALAKSY DLA BANERA - poprawiony
  const banner = document.querySelector(".banner");
  const bannerImg = banner ? banner.querySelector("img") : null;

  if (banner && bannerImg) {
    window.addEventListener("scroll", function () {
      const scrollPosition = window.pageYOffset;
      const translateY = scrollPosition * 0.4; // Zmniejszona wartość dla lepszego efektu
      bannerImg.style.transform = `translateY(${translateY}px)`;
    });
  }

  // INTERAKTYWNA GALERIA
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    // Dodaj opis od razu zamiast używać eventów
    const description = document.createElement("div");
    description.className = "gallery-item-description";
    description.innerHTML = "<p>Kliknij aby powiększyć</p>";
    item.appendChild(description);

    // Dodaj efekt lightbox po kliknięciu
    item.addEventListener("click", function () {
      // Pobierz URL obrazu z tła
      const imgUrl = window
        .getComputedStyle(this)
        .backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");

      // Stwórz lightbox
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgUrl}" alt="Powiększone zdjęcie">
                </div>
            `;

      document.body.appendChild(lightbox);

      // Dodaj klasę po małym opóźnieniu, żeby zapewnić płynną animację
      setTimeout(() => {
        lightbox.classList.add("show");
      }, 10);

      document.body.style.overflow = "hidden"; // Zablokuj przewijanie strony

      // Zamknij lightbox po kliknięciu
      lightbox.addEventListener("click", function (event) {
        if (
          event.target === lightbox ||
          event.target.className === "close-lightbox"
        ) {
          lightbox.classList.remove("show");
          setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = "auto"; // Przywróć przewijanie
          }, 300); // Po animacji fadeOut
        }
      });
    });
  });

  // ANIMOWANY LICZNIK KLIENTÓW - naprawiony, obsługa jest teraz w funkcji startCounting
  // Obserwuj wszystkie liczniki
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    observer.observe(counter.parentElement);
  });

  // DODAJ EFEKTY HOVER DLA USŁUG
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.classList.add("service-hover");
    });

    card.addEventListener("mouseleave", function () {
      this.classList.remove("service-hover");
    });
  });

  // ANIMACJE PRZY ŁADOWANIU STRONY - animuj po małym opóźnieniu
  setTimeout(() => {
    const bannerTitle = document.querySelector(".banner-title");
    const bannerSubtitle = document.querySelector(".banner-subtitle");
    const bannerBtn = document.querySelector(".banner-btn");

    if (bannerTitle) bannerTitle.classList.add("animated", "fadeInDown");
    if (bannerSubtitle) bannerSubtitle.classList.add("animated", "fadeInUp");
    if (bannerBtn) bannerBtn.classList.add("animated", "bounceIn");
  }, 100);

  // PRZYLEPNE MENU PO PRZEWINIĘCIU
  const header = document.querySelector("header");
  if (header) {
    const headerOffset = header.offsetTop;

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > headerOffset) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
  }

  // INSTAGRAM API SIMULATION
  const loadBtn = document.getElementById("load-instagram");
  const statusEl = document.getElementById("instagram-status");
  const spinner = document.getElementById("loading-spinner");
  const instagramGrid = document.getElementById("instagram-grid");
  const modalsContainer = document.getElementById("instagram-modals-container");

  // Dane do symulacji API Instagrama
  // Wykrywanie i używanie dostępnych zdjęć
  // Na podstawie wzorców nazwania zdjęć w projekcie (C1_0.jpg do C8_0.jpg)
  const availableImages = [];
  const imageNames = [
    "C1_0.jpg",
    "C2_0.jpg",
    "C3_0.jpg",
    "C4_0.jpg",
    "C5_0.jpg",
    "C6_0.jpg",
    "C7_0.jpg",
    "C8_0.jpg",
  ];

  // Dynamiczne generowanie komentarzy i opisów
  const commentTemplates = [
    {
      username: "ania_kowalska",
      text: "Przepiękne! Czy są jeszcze wolne terminy na przyszły tydzień? 😍",
    },
    {
      username: "_barbarella12",
      text: "@{user} Tak, mamy kilka wolnych miejsc. Zapraszamy do rezerwacji przez stronę lub telefonicznie 😊",
    },
    {
      username: "monika_style",
      text: "Uwielbiam ten kolor! Idealny na wakacje na plaży ⛱️",
    },
    {
      username: "kasia_nail_lover",
      text: "Jak zawsze perfekcyjne wykonanie 💖 Jestem uzależniona od waszych stylizacji!",
    },
    {
      username: "stylowa_ela",
      text: "Cudowne! Czy to zdobienie jest ręcznie malowane?",
    },
    {
      username: "_barbarella12",
      text: "@stylowa_ela Tak, wszystkie wzory wykonujemy ręcznie 🖌️",
    },
    { username: "nail_queen", text: "Wybiorę taki wzór na mój ślub! 😍" },
    {
      username: "beach_lover",
      text: "Właśnie takie będę chciała na mój wyjazd do Grecji 😍",
    },
    { username: "magda123", text: "Najpiękniejsze paznokcie jakie widziałam!" },
    {
      username: "julka_nails",
      text: "Te kolory są przepiękne, jak się nazywa ten odcień?",
    },
    {
      username: "_barbarella12",
      text: '@{user} To "Ocean Blue" z kolekcji letniej 💙',
    },
    {
      username: "klaudia_style",
      text: "Rewelacja! Na jak długo utrzymuje się to zdobienie?",
    },
    {
      username: "_barbarella12",
      text: "@{user} Przy odpowiedniej pielęgnacji nawet 3-4 tygodnie ✨",
    },
    { username: "fashionista", text: "Idealne do małej czarnej! 🖤" },
    {
      username: "przyszla_panna_mloda",
      text: "Czy jesteście w stanie zrobić podobne ale z odrobiną błękitu? Planuję ślub w lipcu.",
    },
    {
      username: "_barbarella12",
      text: "@{user} Oczywiście! Zapraszamy na konsultację, dostosujemy projekt do Twojej sukni 👰",
    },
    {
      username: "patrycja77",
      text: "Miałam takie na weselu siostry i wszyscy byli zachwyceni! Polecam ten salon z całego serca ❤️",
    },
  ];

  const descriptionTemplates = [
    "Nowość w naszym salonie! Delikatna stylizacja z dodatkiem brokatowego akcentu. ☀️✨ #nails #summernails #paznokcie #manicure #nailart",
    "Elegancja i minimalizm - te paznokcie to klasyk, który nigdy nie wychodzi z mody. 💅 #frenchnails #nailsofinstagram #manicurehybrydowy #salonkosmetyczny",
    "Letnie wzory na specjalne okazje. Taki zestaw rozświetli każdy dzień! 🌸✨ #summernails #naildesign #hybridnails #nailsofinstagram",
    "Delikatne ombre - idealne do sukienki czy na plażę! ☀️🌊 #ombrenails #summerstyle #nailsart #tarnow",
    "Geometryczne wzory nigdy nie wychodzą z mody! 🖤✨ #geometric #nailart #goldandblack",
    "Pastelowe marzenie - delikatne kolory i subtelne zdobienia. Idealne na wesela! 💐 #pastelnails #weddingnails #delikatnepaznokcie",
    "Wiosenne inspiracje prosto z Baraballa 🌷 #springnails #floral #nailart #paznokciehybrydowe",
    "Odważne kolory na lato! Neonowe dodatki to hit tego sezonu 💚💗 #neon #summernails #nailsonfleek",
  ];

  const months = [
    "STYCZNIA",
    "LUTEGO",
    "MARCA",
    "KWIETNIA",
    "MAJA",
    "CZERWCA",
    "LIPCA",
    "SIERPNIA",
    "WRZEŚNIA",
    "PAŹDZIERNIKA",
    "LISTOPADA",
    "GRUDNIA",
  ];

  // Tworzymy dynamicznie posty z dostępnych obrazów
  function createInstagramPosts() {
    const instagramPosts = [];

    // Dla każdego obrazka tworzymy post
    imageNames.forEach((img, index) => {
      // Losowe dane dla postu
      const likes = Math.floor(Math.random() * 200) + 100; // Losowa liczba polubień między 100 a 300
      const commentsCount = Math.floor(Math.random() * 20) + 5; // Losowa liczba komentarzy między 5 a 25

      // Losowa data z ostatnich 6 miesięcy
      const today = new Date();
      const randomDate = new Date(today);
      randomDate.setDate(today.getDate() - Math.floor(Math.random() * 180)); // Losowy dzień z ostatnich 6 miesięcy
      const dateString = `${randomDate.getDate()} ${
        months[randomDate.getMonth()]
      } ${randomDate.getFullYear()}`;

      // Losowy opis z szablonów
      const description =
        descriptionTemplates[
          Math.floor(Math.random() * descriptionTemplates.length)
        ];

      // Generowanie komentarzy
      const userComments = [];
      // Losowa liczba komentarzy, ale maksymalnie tyle ile mamy w tablicy szablonów
      const numComments = Math.min(commentsCount, commentTemplates.length);
      const usedIndexes = new Set();

      // Wybieramy losowe, niepowtarzające się komentarze
      while (
        userComments.length < numComments &&
        usedIndexes.size < commentTemplates.length
      ) {
        const randomIndex = Math.floor(Math.random() * commentTemplates.length);

        if (!usedIndexes.has(randomIndex)) {
          usedIndexes.add(randomIndex);
          let comment = JSON.parse(
            JSON.stringify(commentTemplates[randomIndex])
          ); // Głęboka kopia

          // Jeśli jest to odpowiedź od salonu, zastąp placeholder {user} nazwą poprzedniego użytkownika
          if (
            comment.username === "_barbarella12" &&
            comment.text.includes("@{user}") &&
            userComments.length > 0
          ) {
            const prevUser = userComments[userComments.length - 1].username;
            comment.text = comment.text.replace("{user}", prevUser);
          }

          userComments.push(comment);
        }
      }

      // Tworzymy post
      instagramPosts.push({
        id: `post${index + 1}`,
        imageUrl: img,
        likes: likes,
        comments: userComments.length,
        description: description,
        date: dateString,
        userComments: userComments,
      });
    });

    return instagramPosts;
  }

  // Funkcja do generowania i wyświetlania postów
  function generateInstagramPosts() {
    // Wyświetl spinner podczas ładowania
    spinner.style.display = "flex";

    // Symuluj krótkie opóźnienie ładowania
    setTimeout(() => {
      // Dynamicznie generuj posty z dostępnych obrazów
      const instagramPosts = createInstagramPosts();

      // Generuj HTML dla postów
      let postsHTML = "";
      let modalsHTML = "";

      instagramPosts.forEach((post) => {
        // HTML dla posta
        postsHTML += `
          <div class="instagram-item" data-post-id="${post.id}">
            <img src="${post.imageUrl}" alt="Stylizacja paznokci">
            <div class="instagram-overlay">
              <div class="instagram-likes">
                <span class="heart-icon">❤️</span>
                <span class="likes-count">${post.likes}</span>
              </div>
              <div class="instagram-comments">
                <span class="comment-icon">💬</span>
                <span class="comments-count">${post.comments}</span>
              </div>
            </div>
          </div>
        `;

        // HTML dla modala
        let commentsHTML = "";
        post.userComments.forEach((comment) => {
          commentsHTML += `
            <div class="instagram-comment">
              <span class="instagram-username">${comment.username}</span>
              <span class="instagram-comment-text">${comment.text}</span>
            </div>
          `;
        });

        modalsHTML += `
          <div id="${post.id}-modal" class="instagram-modal">
            <div class="instagram-modal-content">
              <span class="close-modal">&times;</span>
              <div class="instagram-post">
                <div class="instagram-post-header">
                  <div class="instagram-small-avatar">
                    <img src="logo.png" alt="Baraballa avatar">
                  </div>
                  <div class="instagram-username">_barbarella12</div>
                  <div class="instagram-options">•••</div>
                </div>
                <div class="instagram-post-image">
                  <img src="${post.imageUrl}" alt="Stylizacja paznokci">
                </div>
                <div class="instagram-post-actions">
                  <div class="instagram-action-icons">
                    <span class="heart-icon">❤️</span>
                    <span class="comment-icon">💬</span>
                    <span class="share-icon">📤</span>
                    <span class="save-icon">🔖</span>
                  </div>
                  <div class="instagram-post-likes">${post.likes} polubień</div>
                  <div class="instagram-post-caption">
                    <span class="instagram-username">_barbarella12</span>
                    <span class="instagram-caption-text">${post.description}</span>
                  </div>
                  <div class="instagram-post-time">${post.date}</div>
                  <div class="instagram-post-comments">
                    ${commentsHTML}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      // Wstaw HTML do strony
      instagramGrid.innerHTML = postsHTML;
      modalsContainer.innerHTML = modalsHTML;

      // Ukryj spinner i pokaż siatkę
      spinner.style.display = "none";
      instagramGrid.style.display = "grid";

      // Aktualizuj status
      statusEl.textContent = "Połączono z kontem Instagram";
      statusEl.style.color = "#4CAF50";

      // Zmień tekst przycisku i ukryj go (opcjonalnie możemy całkiem usunąć przycisk)
      loadBtn.textContent = "Odśwież zdjęcia";
      loadBtn.style.display = "none";

      // Zainicjuj obsługę kliknięć na posty
      initInstagramInteractions();
    }, 1200); // Krótsze opóźnienie dla lepszego UX
  }

  // Automatycznie ładuj posty po załadowaniu strony
  generateInstagramPosts();

  // Pozostaw obsługę przycisku, gdyby kiedyś był potrzebny do odświeżenia
  loadBtn.addEventListener("click", generateInstagramPosts);

  // Funkcja inicjująca interakcje z postami
  function initInstagramInteractions() {
    const instagramItems = document.querySelectorAll(".instagram-item");
    const modals = document.querySelectorAll(".instagram-modal");
    const closeBtns = document.querySelectorAll(".close-modal");

    // Otwieranie modali po kliknięciu na zdjęcie
    instagramItems.forEach((item) => {
      item.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id");
        const modal = document.getElementById(`${postId}-modal`);
        if (modal) {
          modal.style.display = "block";
          document.body.style.overflow = "hidden"; // Blokuj przewijanie strony
        }
      });
    });

    // Zamykanie modali
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".instagram-modal");
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Przywróć przewijanie
      });
    });

    // Zamykanie modali po kliknięciu poza zawartością
    window.addEventListener("click", function (event) {
      modals.forEach((modal) => {
        if (event.target === modal) {
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }
      });
    });

    // Obsługa akcji w postach (lajki, komentarze)
    const heartIcons = document.querySelectorAll(
      ".instagram-action-icons .heart-icon"
    );
    heartIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        this.classList.toggle("liked");
        const likesElement = this.closest(
          ".instagram-post-actions"
        ).querySelector(".instagram-post-likes");
        let likes = parseInt(likesElement.textContent);

        if (this.classList.contains("liked")) {
          likesElement.textContent = `${likes + 1} polubień`;
        } else {
          likesElement.textContent = `${likes - 1} polubień`;
        }
      });
    });
  }
});
