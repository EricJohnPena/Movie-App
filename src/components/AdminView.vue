<template>
    <div v-if="user.token && user.isAdmin" class="container py-5">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <div class="cine-hero-pill mb-2">
                    <i class="bi bi-shield-lock-fill text-info"></i>
                    <span>Administrator Panel</span>
                </div>
                <h1 class="h2 fw-bold cine-gradient-text mb-1">Admin Dashboard</h1>
                <p class="text-secondary small mb-0">
                    Manage your movie catalog, update details, and keep listings up to date.
                </p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <router-link
                    :to="{ name: 'Add Movie' }"
                    class="btn btn-cine-primary d-inline-flex align-items-center gap-2 px-4"
                >
                    <i class="bi bi-plus-lg"></i>
                    <span>Add Movie</span>
                </router-link>
            </div>
        </div>

        <!-- Summary Stats -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-sm-4">
                <div class="cine-stat-card d-flex align-items-center gap-3">
                    <div class="cine-stat-icon cine-stat-icon-primary">
                        <i class="bi bi-film"></i>
                    </div>
                    <div>
                        <div class="small text-secondary">Total Movies</div>
                        <div class="h4 fw-bold text-light mb-0">{{ movieData.length }}</div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-4">
                <div class="cine-stat-card d-flex align-items-center gap-3">
                    <div class="cine-stat-icon cine-stat-icon-info">
                        <i class="bi bi-tags"></i>
                    </div>
                    <div>
                        <div class="small text-secondary">Genres</div>
                        <div class="h4 fw-bold text-light mb-0">{{ totalGenres }}</div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-4">
                <div class="cine-stat-card d-flex align-items-center gap-3">
                    <div class="cine-stat-icon cine-stat-icon-success">
                        <i class="bi bi-chat-left-text"></i>
                    </div>
                    <div>
                        <div class="small text-secondary">Total Comments</div>
                        <div class="h4 fw-bold text-light mb-0">{{ totalComments }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <div class="cine-card overflow-hidden">
            <!-- Toolbar -->
            <div class="p-3 p-sm-4 border-bottom border-secondary border-opacity-25">
                <div class="row g-3 align-items-center justify-content-between">
                    <div class="col-12 col-md-6 col-lg-5">
                        <div class="input-group cine-input-group">
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                type="text"
                                class="form-control"
                                placeholder="Filter by title, director, genre, or ID..."
                                aria-label="Filter movies table"
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

                    <div class="col-12 col-md-auto text-md-end">
                        <span class="small text-secondary">
                            Showing
                            <strong class="text-light">{{ startItem }}–{{ endItem }}</strong>
                            of <strong class="text-light">{{ filteredMovies.length }}</strong> movies
                        </span>
                    </div>
                </div>
            </div>

            <!-- Responsive Table -->
            <div v-if="paginatedMovies.length" class="table-responsive">
                <table class="table table-hover cine-table mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Genre</th>
                            <th>Comments</th>
                            <th colspan="2" class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="movie in paginatedMovies" :key="movie._id">
                            <td>
                                <span class="cine-id-chip text-truncate" :title="movie._id">
                                    {{ movie._id }}
                                </span>
                            </td>
                            <td class="fw-semibold text-light">{{ movie.title }}</td>
                            <td class="text-secondary">{{ movie.director }}</td>
                            <td class="text-secondary">{{ movie.year }}</td>
                            <td>
                                <span class="cine-genre-pill">{{ movie.genre }}</span>
                            </td>
                            <td>
                                <span class="cine-count-pill">
                                    <i class="bi bi-chat-dots text-info"></i>
                                    <span>{{ movie.comments?.length || 0 }}</span>
                                </span>
                            </td>
                            <td class="text-end" style="width: 1%">
                                <button
                                    type="button"
                                    class="btn btn-cine-outline btn-sm d-inline-flex align-items-center gap-1 px-3 py-1"
                                    @click="openUpdateModal(movie)"
                                >
                                    <i class="bi bi-pencil-square"></i>
                                    <span>Update</span>
                                </button>
                            </td>
                            <td class="text-start" style="width: 1%">
                                <button
                                    type="button"
                                    class="btn btn-cine-danger-soft btn-sm d-inline-flex align-items-center gap-1 px-3 py-1"
                                    :disabled="deletingId === movie._id"
                                    @click="deleteMovie(movie._id, movie.title)"
                                >
                                    <span
                                        v-if="deletingId === movie._id"
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    <i v-else class="bi bi-trash3"></i>
                                    <span>{{ deletingId === movie._id ? "Deleting..." : "Delete" }}</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-5 px-3">
                <div class="cine-brand-badge mb-3">
                    <i class="bi bi-film"></i>
                </div>
                <h5 class="fw-semibold text-light mb-1">No matching movies</h5>
                <p class="text-secondary small mb-3">
                    {{
                        movieData.length
                            ? "Try a different keyword or clear the filter."
                            : "Add your first movie to populate the catalog."
                    }}
                </p>
                <button
                    v-if="searchQuery"
                    type="button"
                    class="btn btn-cine-ghost btn-sm px-3"
                    @click="searchQuery = ''"
                >
                    Clear Search
                </button>
            </div>

            <!-- Pagination Footer -->
            <div
                v-if="totalPages > 1"
                class="p-3 p-sm-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3"
            >
                <span class="small text-secondary">
                    Page <strong class="text-light">{{ currentPage }}</strong> of
                    <strong class="text-light">{{ totalPages }}</strong>
                </span>

                <nav aria-label="Movie table pagination">
                    <ul class="pagination cine-pagination mb-0 flex-wrap justify-content-center">
                        <!-- Previous -->
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button
                                type="button"
                                class="page-link"
                                :disabled="currentPage === 1"
                                @click="goToPage(currentPage - 1)"
                                aria-label="Previous page"
                            >
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>

                        <!-- Page Numbers -->
                        <li
                            v-for="(page, index) in visiblePages"
                            :key="`${page}-${index}`"
                            class="page-item"
                            :class="{
                                active: page === currentPage,
                                disabled: page === '...',
                            }"
                        >
                            <span v-if="page === '...'" class="page-link cine-pagination-ellipsis">
                                &hellip;
                            </span>
                            <button
                                v-else
                                type="button"
                                class="page-link"
                                @click="goToPage(page)"
                            >
                                {{ page }}
                            </button>
                        </li>

                        <!-- Next -->
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button
                                type="button"
                                class="page-link"
                                :disabled="currentPage === totalPages"
                                @click="goToPage(currentPage + 1)"
                                aria-label="Next page"
                            >
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Update Movie Modal -->
        <div
            v-if="showEditModal"
            class="modal d-block cine-modal cine-modal-backdrop"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            @click.self="closeUpdateModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <form @submit.prevent="updateMovie">
                        <div class="modal-header px-4 py-3">
                            <h5 class="modal-title fw-bold d-flex align-items-center gap-2">
                                <i class="bi bi-pencil-square text-info"></i>
                                <span>Update Movie</span>
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                aria-label="Close"
                                @click="closeUpdateModal"
                            ></button>
                        </div>

                        <div class="modal-body px-4 py-4">
                            <div class="mb-3">
                                <label for="editTitle" class="form-label small fw-semibold text-light">
                                    Title
                                </label>
                                <input
                                    id="editTitle"
                                    v-model="editForm.title"
                                    type="text"
                                    class="form-control cine-input"
                                    placeholder="Movie title"
                                    required
                                />
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-12 col-sm-7">
                                    <label for="editDirector" class="form-label small fw-semibold text-light">
                                        Director
                                    </label>
                                    <input
                                        id="editDirector"
                                        v-model="editForm.director"
                                        type="text"
                                        class="form-control cine-input"
                                        placeholder="Director name"
                                        required
                                    />
                                </div>
                                <div class="col-12 col-sm-5">
                                    <label for="editYear" class="form-label small fw-semibold text-light">
                                        Year
                                    </label>
                                    <input
                                        id="editYear"
                                        v-model.number="editForm.year"
                                        type="number"
                                        class="form-control cine-input"
                                        placeholder="2025"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="editGenre" class="form-label small fw-semibold text-light">
                                    Genre
                                </label>
                                <input
                                    id="editGenre"
                                    v-model="editForm.genre"
                                    type="text"
                                    class="form-control cine-input"
                                    placeholder="e.g. Sci-Fi, Drama, Action"
                                    required
                                />
                            </div>

                            <div class="mb-0">
                                <label for="editDescription" class="form-label small fw-semibold text-light">
                                    Description
                                </label>
                                <textarea
                                    id="editDescription"
                                    v-model="editForm.description"
                                    rows="3"
                                    class="form-control cine-input"
                                    placeholder="Brief synopsis..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div class="modal-footer px-4 py-3">
                            <button
                                type="button"
                                class="btn btn-cine-ghost px-3"
                                @click="closeUpdateModal"
                                :disabled="isUpdating"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="btn btn-cine-primary d-inline-flex align-items-center gap-2 px-4"
                                :disabled="isUpdating"
                            >
                                <span
                                    v-if="isUpdating"
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <i v-else class="bi bi-check2-circle"></i>
                                <span>{{ isUpdating ? "Saving..." : "Save Changes" }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useGlobalStore } from "../stores/user";
import api from "../api";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";

const props = defineProps({
    movieData: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["refreshMovies"]);
const router = useRouter();
const { user, getUserDetails } = useGlobalStore();
const notyf = new Notyf();

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const showEditModal = ref(false);
const isUpdating = ref(false);
const deletingId = ref(null);

const editForm = reactive({
    _id: "",
    title: "",
    director: "",
    year: "",
    genre: "",
    description: "",
});

const totalGenres = computed(() => {
    const genres = new Set(
        props.movieData.map((movie) => movie.genre?.trim().toLowerCase()).filter(Boolean)
    );
    return genres.size;
});

const totalComments = computed(() => {
    return props.movieData.reduce((sum, movie) => sum + (movie.comments?.length || 0), 0);
});

const filteredMovies = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return props.movieData;

    return props.movieData.filter((movie) => {
        return (
            String(movie._id || "").toLowerCase().includes(query) ||
            String(movie.title || "").toLowerCase().includes(query) ||
            String(movie.director || "").toLowerCase().includes(query) ||
            String(movie.genre || "").toLowerCase().includes(query) ||
            String(movie.year || "").toLowerCase().includes(query)
        );
    });
});

const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredMovies.value.length / itemsPerPage));
});

const paginatedMovies = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredMovies.value.slice(start, start + itemsPerPage);
});

const startItem = computed(() => {
    if (!filteredMovies.value.length) return 0;
    return (currentPage.value - 1) * itemsPerPage + 1;
});

const endItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage, filteredMovies.value.length);
});

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1];

    if (current > 3) {
        pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("...");
    }

    pages.push(total);
    return pages;
});

function goToPage(page) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
}

// Reset to page 1 whenever the search query changes
watch(searchQuery, () => {
    currentPage.value = 1;
});

// Clamp currentPage if deleting a movie reduces totalPages
watch(totalPages, (newTotal) => {
    if (currentPage.value > newTotal) {
        currentPage.value = newTotal;
    }
});

function openUpdateModal(movie) {
    editForm._id = movie._id;
    editForm.title = movie.title || "";
    editForm.director = movie.director || "";
    editForm.year = movie.year || "";
    editForm.genre = movie.genre || "";
    editForm.description = movie.description || "";
    showEditModal.value = true;
}

function closeUpdateModal() {
    showEditModal.value = false;
}

async function updateMovie() {
    isUpdating.value = true;

    try {
        const { data } = await api.patch(`/movies/updateMovie/${editForm._id}`, {
            title: editForm.title,
            director: editForm.director,
            year: editForm.year,
            genre: editForm.genre,
            description: editForm.description,
        });

        notyf.success(data.message || "Movie updated successfully!");
        closeUpdateModal();
        emit("refreshMovies");
    } catch (error) {
        console.error("Update Movie Error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to update movie.";
        notyf.error(errorMessage);
    } finally {
        isUpdating.value = false;
    }
}

async function deleteMovie(movieId, movieTitle) {
    const confirmed = window.confirm(`Are you sure you want to delete "${movieTitle}"?`);
    if (!confirmed) return;

    deletingId.value = movieId;

    try {
        const { data } = await api.delete(`/movies/deleteMovie/${movieId}`);
        notyf.success(data.message || "Movie deleted successfully!");
        emit("refreshMovies");
    } catch (error) {
        console.error("Delete Movie Error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to delete movie.";
        notyf.error(errorMessage);
    } finally {
        deletingId.value = null;
    }
}

async function verifyAdminAccess() {
    if (!user.token) {
        notyf.error("Please log in to access this page.");
        router.push("/login");
        return;
    }

    if (user.isAdmin === null) {
        await getUserDetails(user.token);
    }

    if (!user.token) {
        notyf.error("Session expired. Please log in again.");
        router.push("/login");
    } else if (!user.isAdmin) {
        notyf.error("Access denied. Admins only.");
        router.push("/");
    }
}

onBeforeMount(() => {
    verifyAdminAccess();
});

watch(
    () => user.token,
    (newToken) => {
        if (!newToken) {
            router.push("/login");
        }
    }
);
</script>