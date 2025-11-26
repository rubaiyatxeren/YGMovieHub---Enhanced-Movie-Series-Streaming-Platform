// CONFIGURATION
const TMDB_API_KEY = "YOUR_API_KEY_HERE";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";

// EMBED SERVERS
const EMBED_SOURCES = [
  {
    name: "VidSrc.to",
    url: (type, id) => `https://vidsrc.to/embed/${type}/${id}`,
  },
  {
    name: "2Embed",
    url: (type, id) => `https://www.2embed.skin/embed/${id}`,
  },
  {
    name: "VidRock",
    url: (type, id) => `https://vidrock.net/embed/${type}/${id}`,
  },
  {
    name: "VidStorm",
    url: (type, id) => `https://vidstorm.ru/embed/${type}/${id}`,
  },
  {
    name: "VidSrc.pro",
    url: (type, id) => `https://vidsrc.pro/embed/${type}/${id}`,
  },
  {
    name: "VidSrc.me",
    url: (type, id) => `https://vidsrc.me/embed/${type}?tmdb=${id}`,
  },
  {
    name: "SuperEmbed",
    url: (type, id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
];

// GLOBAL VARIABLES
let currentContentId = null;
let currentContentType = null;
let currentServerIndex = 0;
let currentTvShowData = null;

// INITIALIZE WHEN PAGE LOADS
document.addEventListener("DOMContentLoaded", function () {
  loadAllContent();
  setupEventListeners();
});

function setupEventListeners() {
  const input = document.getElementById("searchInput");

  input.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && searchContent()
  );
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && closeModal()
  );
}

// API TMDB DATASET
async function fetchTMDB(endpoint) {
  try {
    const joiner = endpoint.includes("?") ? "&" : "?";

    const url = `${TMDB_BASE_URL}${endpoint}${joiner}api_key=${TMDB_API_KEY}`;

    const response = await fetch(url);

    return response.json();
  } catch (error) {
    console.log(`TMDB API FETCING FAILED BEACAUSE OF: ${error}`);
    return { results: [] };
  }
}

async function loadAllContent() {
  try {
    const [trending, popular, tvShows, recent] = await Promise.all([
      fetchTMDB("/trending/movie/week"),
      fetchTMDB("/movie/popular"),
      fetchTMDB("/tv/popular"),
      fetchTMDB("/movie/now_playing"),
    ]);

    displayContent(trending.results, "trendingGrid");
    displayContent(popular.results, "popularGrid");
    displayContent(tvShows.results, "tvShowsGrid", "tv");
    displayContent(recent.results, "recentGrid");
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

// Display content in grid
function displayContent(items, gridId, type = "movie") {
  const grid = document.getElementById(gridId);

  if (!items || items.length === 0) {
    grid.innerHTML =
      '<p class="col-span-full text-center text-gray-400 py-8">No content found.</p>';
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const title = item.title || item.name;
      const date = item.release_date || item.first_air_date;
      const mediaType = type === "tv" ? "tv" : item.media_type || "movie";

      return `
                    <div class="movie-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-purple-500/20" 
                         onclick="openContent(${item.id}, '${mediaType}')">
                        <img src="${
                          item.poster_path
                            ? TMDB_IMG_BASE + item.poster_path
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }" 
                             alt="${title}" 
                             class="w-full h-48 object-cover"
                             onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                        <div class="p-3">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-semibold text-sm truncate flex-1">${title}</h3>
                                <span class="bg-purple-600 text-white text-xs px-1 py-0.5 rounded ml-1 whitespace-nowrap">
                                    ${mediaType === "tv" ? "TV" : "Movie"}
                                </span>
                            </div>
                            <div class="flex justify-between items-center text-xs text-gray-400">
                                <span>${
                                  date ? date.split("-")[0] : "N/A"
                                }</span>
                                <span class="flex items-center">
                                    <i class="fas fa-star text-yellow-500 mr-1"></i>
                                    ${
                                      item.vote_average
                                        ? item.vote_average.toFixed(1)
                                        : "N/A"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                `;
    })
    .join("");
}

// Search movies and TV shows
async function searchContent() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  const searchSection = document.getElementById("searchResults");
  const searchGrid = document.getElementById("searchGrid");
  const searchTitle = document.getElementById("searchTitle");

  searchGrid.innerHTML =
    '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-purple-500 text-2xl"></i><p class="text-gray-400 mt-2">Searching...</p></div>';
  searchSection.classList.remove("hidden");
  searchTitle.textContent = `Search Results for: "${query}"`;

  searchSection.scrollIntoView({ behavior: "smooth" });

  try {
    const searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&include_adult=false`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    if (results.results && results.results.length > 0) {
      const filtered = results.results.filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path
      );

      if (filtered.length > 0) {
        searchGrid.innerHTML = filtered
          .map((item) => {
            const title = item.title || item.name;
            const date = item.release_date || item.first_air_date;
            const mediaType = item.media_type;

            return `
                                <div class="movie-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-purple-500/20" 
                                     onclick="openContent(${
                                       item.id
                                     }, '${mediaType}')">
                                    <img src="${
                                      item.poster_path
                                        ? TMDB_IMG_BASE + item.poster_path
                                        : "https://via.placeholder.com/300x450?text=No+Image"
                                    }" 
                                         alt="${title}" 
                                         class="w-full h-48 object-cover"
                                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                                    <div class="p-3">
                                        <div class="flex justify-between items-start mb-1">
                                            <h3 class="font-semibold text-sm truncate flex-1">${title}</h3>
                                            <span class="bg-purple-600 text-white text-xs px-1 py-0.5 rounded ml-1 whitespace-nowrap">
                                                ${
                                                  mediaType === "tv"
                                                    ? "TV"
                                                    : "Movie"
                                                }
                                            </span>
                                        </div>
                                        <div class="flex justify-between items-center text-xs text-gray-400">
                                            <span>${
                                              date ? date.split("-")[0] : "N/A"
                                            }</span>
                                            <span class="flex items-center">
                                                <i class="fas fa-star text-yellow-500 mr-1"></i>
                                                ${
                                                  item.vote_average
                                                    ? item.vote_average.toFixed(
                                                        1
                                                      )
                                                    : "N/A"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `;
          })
          .join("");
      } else {
        searchGrid.innerHTML =
          '<p class="col-span-full text-center text-gray-400 py-8">No movies or TV shows found.</p>';
      }
    } else {
      searchGrid.innerHTML =
        '<p class="col-span-full text-center text-gray-400 py-8">No results found.</p>';
    }
  } catch (error) {
    console.error("Search error:", error);
    searchGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-400 py-8">Search failed. Please try again.</p>';
  }
}

// Open content modal
async function openContent(id, type) {
  currentContentId = id;
  currentContentType = type;
  currentServerIndex = 0;
  currentTvShowData = null;

  const modal = document.getElementById("movieModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Show loading
  document.getElementById("playerContent").innerHTML =
    '<div class="w-full h-full flex items-center justify-center bg-gray-900"><i class="fas fa-spinner fa-spin text-purple-500 text-2xl"></i></div>';

  document.getElementById("movieDetailsContent").innerHTML =
    '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-purple-500 text-2xl"></i><p class="text-gray-400 mt-2">Loading details...</p></div>';

  document.getElementById("additionalDetails").innerHTML =
    '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-purple-500"></i></div>';

  document.getElementById("castSection").innerHTML =
    '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-purple-500"></i></div>';

  document.getElementById("downloadSection").innerHTML =
    '<div class="text-center"><i class="fas fa-spinner fa-spin text-purple-500"></i></div>';

  // Initialize server selector
  initializeServerSelector();

  // Load content
  loadPlayer(currentServerIndex);
  loadContentDetails(id, type);
  loadAdditionalDetails(id, type);
  loadCastAndCrew(id, type);
}

// Initialize server selector
function initializeServerSelector() {
  const serverSelector = document.getElementById("serverSelector");
  const serverButtons = document.getElementById("serverButtons");

  serverSelector.classList.remove("hidden");

  // Create server buttons
  serverButtons.innerHTML = EMBED_SOURCES.map(
    (source, index) => `
            <button 
              class="server-btn px-3 py-2 rounded border border-gray-600 text-sm ${
                index === currentServerIndex
                  ? "active"
                  : "bg-gray-700 hover:bg-gray-600"
              }" 
              onclick="switchServer(${index})"
            >
              ${source.name}
            </button>
          `
  ).join("");
}

// Switch server
function switchServer(serverIndex) {
  if (serverIndex === currentServerIndex) return;

  currentServerIndex = serverIndex;

  // Update active button
  document.querySelectorAll(".server-btn").forEach((btn, index) => {
    if (index === serverIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Reload player with new server
  loadPlayer(serverIndex);
}

// Load player
function loadPlayer(serverIndex) {
  const source = EMBED_SOURCES[serverIndex];
  const embedUrl = source.url(currentContentType, currentContentId);

  document.getElementById("playerContent").innerHTML = `
                <iframe src="${embedUrl}" class="player-iframe" allowfullscreen></iframe>
            `;
}

// Load content details
async function loadContentDetails(id, type) {
  try {
    const data = await fetchTMDB(`/${type}/${id}`);

    // Store TV show data for episode selection
    if (type === "tv") {
      currentTvShowData = data;
    }

    // Content details
    document.getElementById("movieDetailsContent").innerHTML = `
                    <h2 class="text-2xl font-bold mb-2">${
                      data.title || data.name
                    }</h2>
                    <p class="text-gray-300 mb-4">${
                      data.overview || "No description available."
                    }</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Rating</p>
                            <p class="font-semibold flex items-center">
                                <i class="fas fa-star text-yellow-500 mr-1"></i>
                                ${
                                  data.vote_average
                                    ? data.vote_average.toFixed(1)
                                    : "N/A"
                                }/10
                            </p>
                        </div>
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">${
                              type === "movie" ? "Release Date" : "First Air"
                            }</p>
                            <p class="font-semibold">${
                              data.release_date || data.first_air_date || "N/A"
                            }</p>
                        </div>
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">${
                              type === "movie" ? "Runtime" : "Seasons"
                            }</p>
                            <p class="font-semibold">
                                ${
                                  type === "movie"
                                    ? data.runtime
                                      ? data.runtime + " min"
                                      : "N/A"
                                    : data.number_of_seasons
                                    ? data.number_of_seasons + " seasons"
                                    : "N/A"
                                }
                            </p>
                        </div>
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Genres</p>
                            <p class="font-semibold">${
                              data.genres
                                ? data.genres.map((g) => g.name).join(", ")
                                : "N/A"
                            }</p>
                        </div>
                    </div>
                `;

    // Download options
    let downloadHtml = "";
    if (type === "movie") {
      downloadHtml = `
                        <h3 class="font-semibold text-green-400 mb-2 flex items-center">
                            <i class="fas fa-download mr-2"></i>
                            Download Options
                        </h3>
                        <a href="https://dl.vidsrc.vip/movie/${id}" target="_blank" 
                           class="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded px-4 py-2 transition-all duration-300">
                            Download Movie
                        </a>
                    `;
    } else if (type === "tv") {
      downloadHtml = await createTvShowDownloadSection(id, data);
    }

    document.getElementById("downloadSection").innerHTML = downloadHtml;
  } catch (error) {
    document.getElementById("movieDetailsContent").innerHTML =
      '<div class="text-center py-8 text-red-400"><i class="fas fa-exclamation-triangle text-2xl mb-2"></i><p>Failed to load details.</p></div>';
  }
}

// Create TV show download section with seasons and episodes
async function createTvShowDownloadSection(showId, showData) {
  let html = `
          <h3 class="font-semibold text-green-400 mb-2 flex items-center">
            <i class="fas fa-download mr-2"></i>
            TV Show Downloads
          </h3>
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Select Season:</h4>
            <div id="seasonButtons" class="flex flex-wrap gap-2 mb-4">
        `;

  // Create season buttons
  const totalSeasons = Math.min(showData.number_of_seasons || 1, 10);
  for (let season = 1; season <= totalSeasons; season++) {
    html += `
            <button 
              class="season-btn px-3 py-2 rounded border border-gray-600 text-sm bg-gray-700 hover:bg-gray-600 ${
                season === 1 ? "active" : ""
              }" 
              onclick="loadEpisodesForSeason(${season}, ${showId})"
            >
              Season ${season}
            </button>
          `;
  }

  html += `
            </div>
            <div id="episodesContainer">
              <p class="text-gray-400 text-sm">Select a season to view episodes</p>
            </div>
          </div>
        `;

  // Load episodes for first season by default
  setTimeout(() => loadEpisodesForSeason(1, showId), 100);

  return html;
}

// Load episodes for a specific season
async function loadEpisodesForSeason(seasonNumber, showId) {
  const episodesContainer = document.getElementById("episodesContainer");
  episodesContainer.innerHTML =
    '<p class="text-gray-400">Loading episodes...</p>';

  // Update active season button
  document.querySelectorAll(".season-btn").forEach((btn, index) => {
    if (index === seasonNumber - 1) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  try {
    // Fetch season details
    const seasonData = await fetchTMDB(`/tv/${showId}/season/${seasonNumber}`);

    if (seasonData.episodes && seasonData.episodes.length > 0) {
      let episodesHtml = `
              <h4 class="font-semibold mb-2">Season ${seasonNumber} Episodes:</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-700/30 rounded">
            `;

      seasonData.episodes.forEach((episode, index) => {
        const episodeNumber = index + 1;
        episodesHtml += `
                <a 
                  href="https://dl.vidsrc.vip/tv/${showId}/${seasonNumber}/${episodeNumber}" 
                  target="_blank"
                  class="episode-btn bg-gray-800 hover:bg-gray-700 text-white text-center py-2 px-1 rounded border border-gray-600 text-xs transition-all duration-300"
                  title="${episode.name || `Episode ${episodeNumber}`}"
                >
                  <div class="font-semibold">E${episodeNumber}</div>
                  <div class="text-gray-400 truncate text-xs">${
                    episode.name || `Episode ${episodeNumber}`
                  }</div>
                </a>
              `;
      });

      episodesHtml += `</div>`;
      episodesContainer.innerHTML = episodesHtml;
    } else {
      episodesContainer.innerHTML =
        '<p class="text-gray-400">No episodes found for this season.</p>';
    }
  } catch (error) {
    console.error("Error loading episodes:", error);
    episodesContainer.innerHTML =
      '<p class="text-red-400">Failed to load episodes.</p>';
  }
}

// Load additional details
async function loadAdditionalDetails(id, type) {
  try {
    const data = await fetchTMDB(`/${type}/${id}`);

    let additionalHtml = `
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-info-circle text-purple-500 mr-2"></i>
                        Additional Details
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                `;

    // Budget and Revenue for movies
    if (type === "movie" && data.budget) {
      additionalHtml += `
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Budget</p>
                            <p class="font-semibold">$${data.budget.toLocaleString()}</p>
                        </div>
                    `;
    }

    if (type === "movie" && data.revenue) {
      additionalHtml += `
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Revenue</p>
                            <p class="font-semibold">$${data.revenue.toLocaleString()}</p>
                        </div>
                    `;
    }

    // Status
    if (data.status) {
      additionalHtml += `
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Status</p>
                            <p class="font-semibold">${data.status}</p>
                        </div>
                    `;
    }

    // Original Language
    if (data.original_language) {
      additionalHtml += `
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                            <p class="text-gray-400 text-sm">Original Language</p>
                            <p class="font-semibold">${data.original_language.toUpperCase()}</p>
                        </div>
                    `;
    }

    // Production Companies
    if (data.production_companies && data.production_companies.length > 0) {
      additionalHtml += `
                        <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20 md:col-span-2">
                            <p class="text-gray-400 text-sm">Production Companies</p>
                            <p class="font-semibold">${data.production_companies
                              .map((company) => company.name)
                              .join(", ")}</p>
                        </div>
                    `;
    }

    // For TV shows - Network and Episode Info
    if (type === "tv") {
      if (data.networks && data.networks.length > 0) {
        additionalHtml += `
                            <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                                <p class="text-gray-400 text-sm">Network</p>
                                <p class="font-semibold">${data.networks[0].name}</p>
                            </div>
                        `;
      }

      if (data.number_of_episodes) {
        additionalHtml += `
                            <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                                <p class="text-gray-400 text-sm">Total Episodes</p>
                                <p class="font-semibold">${data.number_of_episodes}</p>
                            </div>
                        `;
      }

      if (data.last_air_date) {
        additionalHtml += `
                            <div class="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                                <p class="text-gray-400 text-sm">Last Air Date</p>
                                <p class="font-semibold">${data.last_air_date}</p>
                            </div>
                        `;
      }
    }

    additionalHtml += `</div>`;
    document.getElementById("additionalDetails").innerHTML = additionalHtml;
  } catch (error) {
    console.error("Error loading additional details:", error);
    document.getElementById("additionalDetails").innerHTML = `
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-info-circle text-purple-500 mr-2"></i>
                        Additional Details
                    </h3>
                    <p class="text-gray-400 text-center py-4">Failed to load additional information.</p>
                `;
  }
}

// Load cast and crew data
async function loadCastAndCrew(id, type) {
  try {
    const credits = await fetchTMDB(`/${type}/${id}/credits`);

    if (credits.cast && credits.cast.length > 0) {
      const mainCast = credits.cast.slice(0, 12);

      const castHtml = `
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-users text-purple-500 mr-2"></i>
                            Cast & Crew
                        </h3>
                        <div class="cast-scroll overflow-x-auto">
                            <div class="flex space-x-4 pb-4">
                                ${mainCast
                                  .map(
                                    (person) => `
                                    <div class="flex-shrink-0 w-24 text-center">
                                        <img src="${
                                          person.profile_path
                                            ? TMDB_IMG_BASE +
                                              person.profile_path
                                            : "https://via.placeholder.com/100x150?text=No+Image"
                                        }" 
                                             alt="${person.name}"
                                             class="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-2 border-purple-500/50"
                                             onerror="this.src='https://via.placeholder.com/100x150?text=No+Image'">
                                        <p class="font-semibold text-xs truncate">${
                                          person.name
                                        }</p>
                                        <p class="text-gray-400 text-xs truncate">${
                                          person.character || "Actor"
                                        }</p>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `;

      document.getElementById("castSection").innerHTML = castHtml;
    } else {
      document.getElementById("castSection").innerHTML = `
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-users text-purple-500 mr-2"></i>
                            Cast & Crew
                        </h3>
                        <p class="text-gray-400 text-center py-4">No cast information available.</p>
                    `;
    }
  } catch (error) {
    console.error("Error loading cast:", error);
    document.getElementById("castSection").innerHTML = `
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-users text-purple-500 mr-2"></i>
                        Cast & Crew
                    </h3>
                    <p class="text-gray-400 text-center py-4">Failed to load cast information.</p>
                `;
  }
}

// Close modal
function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  document.getElementById("playerContent").innerHTML = "";
  currentContentId = null;
  currentContentType = null;
  currentServerIndex = 0;
  currentTvShowData = null;
}

// Utility functions
function scrollToContent() {
  document.getElementById("trending").scrollIntoView({ behavior: "smooth" });
}
