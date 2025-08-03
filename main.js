// OMDB API Configuration
const OMDB_API_KEY = '2e5afb1f';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Global State
let myList = JSON.parse(localStorage.getItem('myList')) || [];
let currentFeaturedMovie = null;

// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingText = document.querySelector('.loading-text');
    const loadingSubtitle = document.querySelector('.loading-subtitle');
    const progressBar = document.querySelector('.loading-progress-bar');
    
    // Enhanced loading animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Add completion effects
            loadingText.style.animation = 'textGlow 0.5s ease-in-out infinite alternate';
            loadingSubtitle.textContent = 'Welcome to SHAWNFLIX!';
            
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
                    initializeApp();
        }, 500);
            }, 1000);
        }
        progressBar.style.width = progress + '%';
    }, 100);
});

// Initialize Application
async function initializeApp() {
    try {
        // Load featured content
        await loadFeaturedContent();
        
        // Load movie rows
        await loadMovieRows();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update my list
        updateMyList();
        
        // Initialize floating elements
        initializeFloatingElements();
        
        // Initialize hero particles
        initializeHeroParticles();
        
        // Add immersive background effects
        addImmersiveEffects();
        
        showNotification('Welcome to SHAWNFLIX!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error loading content', 'error');
    }
}

// Load Featured Content
async function loadFeaturedContent() {
    try {
        // Get a popular movie for featured content
        const featuredMovie = await searchMovies('Avengers');
        if (featuredMovie && featuredMovie.length > 0) {
            const movie = featuredMovie[0];
            currentFeaturedMovie = movie;
            
            // Keep the hero section constant - only update if explicitly requested
            // For now, we'll keep the default SHAWNFLIX branding
            
            console.log('Hero section kept constant with SHAWNFLIX branding');
            
            // Optional: Update meta information only if needed
            // updateFeaturedMeta(movie);
        }
    } catch (error) {
        console.error('Error loading featured content:', error);
        // If API fails, keep the default SHAWNFLIX branding
        console.log('Keeping default SHAWNFLIX hero content');
    }
}

// Update Featured Meta Information (Optional - not used by default)
function updateFeaturedMeta(movie) {
    const metaContainer = document.querySelector('.featured-meta');
    if (!metaContainer) return;
    
    // Only update the first three meta items (rating, runtime, year)
    // Keep CC and AD unchanged
    const metaItems = metaContainer.querySelectorAll('.meta-item');
    
    if (metaItems.length >= 3) {
        // Update rating
        if (metaItems[0]) {
            metaItems[0].innerHTML = `<i class="fas fa-star"></i> ${movie.imdbRating || 'N/A'}/10`;
        }
        
        // Update runtime
        if (metaItems[1]) {
            metaItems[1].innerHTML = `<i class="fas fa-clock"></i> ${movie.Runtime || 'N/A'}`;
        }
        
        // Update year
        if (metaItems[2]) {
            metaItems[2].innerHTML = `<i class="fas fa-calendar"></i> ${movie.Year || 'N/A'}`;
        }
        
        // Keep CC and AD elements unchanged (metaItems[3] and metaItems[4])
    }
}

// Load Movie Rows
async function loadMovieRows() {
    const categories = [
        { id: 'trendingRow', search: 'Marvel' },
        { id: 'popularMoviesRow', search: 'Star Wars' },
        { id: 'actionRow', search: 'Action' },
        { id: 'dramaRow', search: 'Drama' },
        { id: 'comedyRow', search: 'Comedy' },
        { id: 'tvShowsRow', search: 'Breaking Bad' }
    ];
    
    for (const category of categories) {
        try {
            const movies = await searchMovies(category.search);
            populateMovieRow(category.id, movies);
        } catch (error) {
            console.error(`Error loading ${category.id}:`, error);
        }
    }
}

// Search Movies using OMDB API
async function searchMovies(query) {
    try {
        const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
        const data = await response.json();
        
        if (data.Response === 'True' && data.Search) {
            // Get detailed info for each movie
            const detailedMovies = await Promise.all(
                data.Search.slice(0, 10).map(async (movie) => {
                    try {
                        const detailResponse = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`);
                        const detailData = await detailResponse.json();
                        return detailData.Response === 'True' ? detailData : movie;
                    } catch (error) {
                        return movie;
                    }
                })
            );
            return detailedMovies;
        }
        return [];
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

// Populate Movie Row
function populateMovieRow(rowId, movies) {
    const rowContent = document.querySelector(`#${rowId} .movie-row-content`);
    if (!rowContent) return;
    
    rowContent.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        rowContent.appendChild(movieCard);
    });
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.imdbId = movie.imdbID;
    
    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300/333/666?text=No+Poster';
    
    card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}" class="movie-poster">
        <div class="movie-overlay">
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-meta">
                <span>${movie.Year || 'N/A'}</span>
                <span>${movie.Runtime || 'N/A'}</span>
                <span>${movie.imdbRating ? `⭐ ${movie.imdbRating}` : 'N/A'}</span>
            </div>
            <div class="movie-actions">
                <button class="movie-action-btn play-btn" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="movie-action-btn info-btn" title="More Info">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="movie-action-btn add-btn" title="Add to My List">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="movie-action-btn trailer-btn" title="Watch Trailer">
                    <i class="fas fa-film"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playMovie(movie);
    });
    
    card.querySelector('.info-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showMovieDetails(movie);
    });
    
    card.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMyList(movie);
    });
    
    card.querySelector('.trailer-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showTrailer(movie);
    });
    
    card.addEventListener('click', () => {
        showMovieDetails(movie);
    });
    
    return card;
}

// Show Movie Details Modal
async function showMovieDetails(movie) {
    try {
        // Get detailed movie info if not already available
        let detailedMovie = movie;
        if (!movie.Plot) {
            const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`);
            detailedMovie = await response.json();
        }
        
        // Populate modal
        document.getElementById('modalPoster').src = detailedMovie.Poster && detailedMovie.Poster !== 'N/A' ? detailedMovie.Poster : 'https://via.placeholder.com/300x450/333/666?text=No+Poster';
        document.getElementById('modalTitle').textContent = detailedMovie.Title;
        document.getElementById('modalYear').textContent = detailedMovie.Year || 'N/A';
        document.getElementById('modalRuntime').textContent = detailedMovie.Runtime || 'N/A';
        document.getElementById('modalRating').textContent = detailedMovie.imdbRating ? `⭐ ${detailedMovie.imdbRating}` : 'N/A';
        document.getElementById('modalPlot').textContent = detailedMovie.Plot || 'No plot available.';
        
        // Populate genres
        const genresContainer = document.getElementById('modalGenres');
        genresContainer.innerHTML = '';
        if (detailedMovie.Genre) {
            detailedMovie.Genre.split(', ').forEach(genre => {
                const span = document.createElement('span');
                span.textContent = genre;
                genresContainer.appendChild(span);
            });
        }
        
        // Populate cast
        const castContainer = document.getElementById('modalCast');
        castContainer.innerHTML = '';
        if (detailedMovie.Actors) {
            detailedMovie.Actors.split(', ').slice(0, 5).forEach(actor => {
                const span = document.createElement('span');
                span.textContent = actor;
                castContainer.appendChild(span);
            });
        }
        
        // Update add to list button
        const addBtn = document.getElementById('addToListBtn');
        const isInList = myList.some(item => item.imdbID === detailedMovie.imdbID);
        addBtn.innerHTML = isInList ? '<i class="fas fa-check"></i> Remove from My List' : '<i class="fas fa-plus"></i> Add to My List';
        addBtn.onclick = () => toggleMyList(detailedMovie);
        
        // Show modal
        const modal = document.getElementById('movieModal');
        modal.classList.add('active');
        
    } catch (error) {
        console.error('Error showing movie details:', error);
        showNotification('Error loading movie details', 'error');
    }
}

// Play Movie
function playMovie(movie) {
    const modal = document.getElementById('videoModal');
    modal.classList.add('active');
    
    showNotification(`Playing ${movie.Title}`, 'success');
    
    // In a real app, this would start the actual video player
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}

// Show Trailer
function showTrailer(movie) {
    const modal = document.getElementById('trailerModal');
    modal.classList.add('active');
    
    showNotification(`Loading trailer for ${movie.Title}`, 'info');
    
    // In a real app, this would load the actual trailer
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}

// Toggle My List
function toggleMyList(movie) {
    const index = myList.findIndex(item => item.imdbID === movie.imdbID);
    
    if (index > -1) {
        myList.splice(index, 1);
        showNotification(`Removed ${movie.Title} from My List`, 'success');
    } else {
        myList.push(movie);
        showNotification(`Added ${movie.Title} to My List`, 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('myList', JSON.stringify(myList));
    
    // Update my list display
    updateMyList();
    
    // Update modal button if open
    const addBtn = document.getElementById('addToListBtn');
    if (addBtn) {
        const isInList = myList.some(item => item.imdbID === movie.imdbID);
        addBtn.innerHTML = isInList ? '<i class="fas fa-check"></i> Remove from My List' : '<i class="fas fa-plus"></i> Add to My List';
    }
}

// Update My List Display
function updateMyList() {
    const myListRow = document.querySelector('#myListRow .movie-row-content');
    if (!myListRow) return;
    
    myListRow.innerHTML = '';
    
    if (myList.length === 0) {
        myListRow.innerHTML = '<p style="color: var(--gray); padding: 2rem; text-align: center;">Your list is empty. Add some movies!</p>';
        return;
    }
    
    myList.forEach(movie => {
        const movieCard = createMovieCard(movie);
        myListRow.appendChild(movieCard);
    });
}

// Enhanced Search Functionality
async function performSearch(query) {
    if (!query.trim()) {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    try {
        showNotification('Searching...', 'info');
        const movies = await searchMovies(query);
        showSearchResults(movies, query);
    } catch (error) {
        console.error('Error performing search:', error);
        showNotification('Error performing search', 'error');
    }
}

// Enhanced Show Search Results
function showSearchResults(movies, query) {
    const searchResults = document.getElementById('searchResults');
    const modal = document.getElementById('searchModal');
    
    searchResults.innerHTML = '';
    
    if (movies.length === 0) {
        searchResults.innerHTML = `
            <div style="color: var(--gray); padding: 2rem; text-align: center; grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No results found for "${query}"</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try searching for a different movie or TV show</p>
            </div>
        `;
    } else {
        movies.forEach(movie => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/180x250/333/666?text=No+Poster';
            
            resultItem.innerHTML = `
                <img src="${poster}" alt="${movie.Title}">
                <div class="search-result-info">
                    <div class="search-result-title">${movie.Title}</div>
                    <div class="search-result-year">${movie.Year || 'N/A'}</div>
                    <div class="search-result-rating">${movie.imdbRating ? `⭐ ${movie.imdbRating}/10` : 'No rating'}</div>
                </div>
            `;
            
            resultItem.addEventListener('click', () => {
                modal.classList.remove('active');
                showMovieDetails(movie);
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    modal.classList.add('active');
}

// Initialize Floating Elements
function initializeFloatingElements() {
    const floatingElements = document.querySelector('.floating-elements');
    if (!floatingElements) return;
    
    // Create additional floating elements with subtle colors
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 8 + 's';
        element.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        // Use subtle colors
        const colors = ['rgba(229, 9, 20, 0.3)', 'rgba(255, 255, 255, 0.2)', 'rgba(192, 192, 192, 0.2)'];
        element.style.background = colors[Math.floor(Math.random() * colors.length)];
        element.style.boxShadow = '0 0 10px rgba(229, 9, 20, 0.1)';
        
        floatingElements.appendChild(element);
    }
}

// Initialize Hero Particles
function initializeHeroParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Create additional particles with subtle colors
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        
        // Use subtle colors instead of red
        const colors = ['rgba(255, 215, 0, 0.4)', 'rgba(255, 255, 255, 0.3)', 'rgba(192, 192, 192, 0.3)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.2)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 4 + 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.pointerEvents = 'none';
        heroParticles.appendChild(particle);
    }
}

// Add Immersive Background Effects
function addImmersiveEffects() {
    // Add subtle background animations
    document.body.style.background = 'linear-gradient(135deg, var(--dark) 0%, #000 100%)';
    
    // Add subtle glow to the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.boxShadow = '0 0 30px rgba(229, 9, 20, 0.1)';
    }
    
    // Add subtle animations to movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease both';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Enhanced Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Search input focus effects
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.classList.remove('focused');
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Row navigation arrows with enhanced mobile support
    document.querySelectorAll('.row-arrow').forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            e.preventDefault();
            const row = arrow.closest('.movie-row');
            const content = row.querySelector('.movie-row-content');
            const scrollAmount = 300;
            
            if (arrow.classList.contains('row-arrow-left')) {
                content.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                content.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
        
        // Touch events for mobile
        arrow.addEventListener('touchstart', (e) => {
            e.preventDefault();
            arrow.style.transform = 'scale(0.95)';
        });
        
        arrow.addEventListener('touchend', (e) => {
            e.preventDefault();
            arrow.style.transform = 'scale(1)';
        });
    });
    
    // Enhanced movie row scrolling for mobile
    document.querySelectorAll('.movie-row-content').forEach(content => {
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        
        // Touch events for mobile scrolling
        content.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - content.offsetLeft;
            scrollLeft = content.scrollLeft;
            content.style.cursor = 'grabbing';
        });
        
        content.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - content.offsetLeft;
            const walk = (x - startX) * 2;
            content.scrollLeft = scrollLeft - walk;
        });
        
        content.addEventListener('touchend', () => {
            isScrolling = false;
            content.style.cursor = 'grab';
        });
        
        // Mouse events for desktop
        content.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - content.offsetLeft;
            scrollLeft = content.scrollLeft;
            content.style.cursor = 'grabbing';
        });
        
        content.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
    e.preventDefault();
            const x = e.pageX - content.offsetLeft;
            const walk = (x - startX) * 2;
            content.scrollLeft = scrollLeft - walk;
        });
        
        content.addEventListener('mouseup', () => {
            isScrolling = false;
            content.style.cursor = 'grab';
        });
        
        content.addEventListener('mouseleave', () => {
            isScrolling = false;
            content.style.cursor = 'grab';
        });
    });
    
    // Hero section buttons
    const playBtn = document.querySelector('.btn-play');
    const infoBtn = document.querySelector('.btn-info');
    const trailerBtn = document.querySelector('.btn-trailer');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            showNotification('Playing featured content...', 'info');
        });
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            showNotification('Loading more information...', 'info');
        });
    }
    
    if (trailerBtn) {
        trailerBtn.addEventListener('click', () => {
            showNotification('Loading trailer...', 'info');
        });
    }
    
    // User menu dropdown
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
            userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            userDropdown.style.transform = userDropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
            userDropdown.style.transform = 'translateY(-10px)';
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Spacebar for playing featured content
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            if (playBtn) playBtn.click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Enhanced scroll effects
    let ticking = false;
    
    function updateScrollEffects() {
        const nav = document.querySelector('.nav');
        const scrolled = window.pageYOffset > 50;
        
        if (scrolled) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Mouse movement for floating elements
    const floatingElements = document.querySelector('.floating-elements');
    if (floatingElements) {
        document.addEventListener('mousemove', (e) => {
            const elements = floatingElements.querySelectorAll('.floating-element');
            elements.forEach((element, index) => {
                const speed = element.dataset.speed || 1;
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }
    
    // Enhanced touch feedback
    document.querySelectorAll('.btn, .movie-action-btn, .nav-link').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
    });
    
    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Enhanced loading screen removal
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Error handling for API calls
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An error occurred. Please try again.', 'error');
});

// Export functions for debugging
window.SHAWNFLIX = {
    searchMovies,
    showMovieDetails,
    toggleMyList,
    myList,
    performSearch,
    showTrailer,
    playMovie
}; 