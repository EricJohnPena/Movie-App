<template>
    <div class="container py-5">
        <!-- Hero Header -->
        <div class="row justify-content-center text-center mb-4">
            <div class="col-lg-8">
                <div class="cine-hero-pill mb-3">
                    <i class="bi bi-stars text-info"></i>
                    <span>{{ movieData.length }} {{ movieData.length === 1 ? "Title" : "Titles" }} Available</span>
                </div>
                <h1 class="display-5 fw-bold cine-gradient-text mb-2">
                    Explore Movies
                </h1>
                <p class="text-secondary mb-0">
                    Discover your next favorite watch, browse by genre, and share your thoughts with the community.
                </p>
            </div>
        </div>

        <!-- Search & Genre Filter Bar -->
        <div class="cine-filter-bar mb-4">
            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-7 col-lg-8">
                    <div class="input-group cine-input-group">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control"
                            placeholder="Search by title, director, or year..."
                            aria-label="Search movies"
                        />
                        <button
                            v-if="searchQuery"
                            type="button"
                            class="btn cine-toggle-btn"
                            @click="searchQuery = ''"
                            aria-label="Clear search"
                        >
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                <div class="col-12 col-md-5 col-lg-4">
                    <div class="input-group cine-input-group">
                        <span class="input-group-text">
                            <i class="bi bi-funnel"></i>
                        </span>
                        <select
                            v-model="selectedGenre"
                            class="form-select cine-select"
                            aria-label="Filter by genre"
                            data-bs-theme="dark"
                        >
                            <option value="all">All Genres</option>
                            <option v-for="genre in availableGenres" :key="genre" :value="genre">
                                {{ genre }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Active Filter Status -->
            <div
                v-if="searchQuery || selectedGenre !== 'all'"
                class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25"
            >
                <span class="small text-secondary">
                    Showing <strong class="text-light">{{ filteredMovies.length }}</strong>
                    of {{ movieData.length }} movies
                </span>
                <button
                    type="button"
                    class="btn btn-cine-ghost btn-sm d-inline-flex align-items-center gap-1 px-3"
                    @click="resetFilters"
                >
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        </div>

        <!-- Movie Grid -->
        <div v-if="filteredMovies.length" class="row g-4">
            <MovieComponent
                v-for="movie in filteredMovies"
                :key="movie._id"
                :movieData="movie"
            />
        </div>

        <!-- Empty State -->
        <div v-else class="cine-empty-state text-center my-4">
            <div class="cine-brand-badge mb-3">
                <i class="bi bi-camera-reels"></i>
            </div>
            <h4 class="fw-semibold text-light mb-2">No movies found</h4>
            <p class="text-secondary small mb-3">
                {{
                    movieData.length
                        ? "Try adjusting your search or selecting a different genre."
                        : "There are no movies in the catalog yet."
                }}
            </p>
            <button
                v-if="searchQuery || selectedGenre !== 'all'"
                type="button"
                class="btn btn-cine-primary btn-sm px-4"
                @click="resetFilters"
            >
                Show All Movies
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import MovieComponent from "./MovieComponent.vue";

const props = defineProps({
    movieData: {
        type: Array,
        required: true,
    },
});

const searchQuery = ref("");
const selectedGenre = ref("all");

const availableGenres = computed(() => {
    const genres = new Set();
    props.movieData.forEach((movie) => {
        if (movie.genre) {
            genres.add(movie.genre.trim());
        }
    });
    return Array.from(genres).sort();
});

const filteredMovies = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    return props.movieData.filter((movie) => {
        const matchesGenre =
            selectedGenre.value === "all" ||
            movie.genre?.trim().toLowerCase() === selectedGenre.value.toLowerCase();

        if (!query) return matchesGenre;

        const title = String(movie.title || "").toLowerCase();
        const director = String(movie.director || "").toLowerCase();
        const genre = String(movie.genre || "").toLowerCase();
        const year = String(movie.year || "").toLowerCase();

        return (
            matchesGenre &&
            (title.includes(query) ||
                director.includes(query) ||
                genre.includes(query) ||
                year.includes(query))
        );
    });
});

function resetFilters() {
    searchQuery.value = "";
    selectedGenre.value = "all";
}
</script>
