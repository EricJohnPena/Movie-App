<template>
    <div v-if="user.token && user.isAdmin" class="container">
        <h1 class="text-center text-primary mt-5 mb-4">Admin Dashboard</h1>

        <div class="d-flex justify-content-end mb-3">
            <!-- <router-link :to="{ name: 'Add Movie' }" class="btn btn-primary">
                + Add Movie
            </router-link> -->
        </div>

        <table class="table table-striped border align-middle">
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
                <tr v-for="movie in movieData" :key="movie._id">
                    <td>{{ movie._id }}</td>
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.director }}</td>
                    <td>{{ movie.year }}</td>
                    <td>{{ movie.genre }}</td>
                    <td>{{ movie.comments?.length || 0 }}</td>
                    <td>
                        <button
                            class="btn btn-primary btn-sm"
                            @click="openUpdateModal(movie)"
                        >
                            Update
                        </button>
                    </td>
                    <td>
                        <button
                            class="btn btn-danger btn-sm"
                            :disabled="deletingId === movie._id"
                            @click="deleteMovie(movie._id, movie.title)"
                        >
                            {{ deletingId === movie._id ? "Deleting..." : "Delete" }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Update Movie Modal -->
        <div
            v-if="showEditModal"
            class="modal d-block"
            tabindex="-1"
            style="background-color: rgba(0, 0, 0, 0.5)"
            @click.self="closeUpdateModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form @submit.prevent="updateMovie">
                        <div class="modal-header">
                            <h5 class="modal-title">Update Movie</h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="closeUpdateModal"
                            ></button>
                        </div>

                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="editTitle" class="form-label">Title</label>
                                <input
                                    id="editTitle"
                                    v-model="editForm.title"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="editDirector" class="form-label">Director</label>
                                <input
                                    id="editDirector"
                                    v-model="editForm.director"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="editYear" class="form-label">Year</label>
                                <input
                                    id="editYear"
                                    v-model.number="editForm.year"
                                    type="number"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="editGenre" class="form-label">Genre</label>
                                <input
                                    id="editGenre"
                                    v-model="editForm.genre"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="editDescription" class="form-label">Description</label>
                                <textarea
                                    id="editDescription"
                                    v-model="editForm.description"
                                    rows="3"
                                    class="form-control"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="closeUpdateModal"
                                :disabled="isUpdating"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="isUpdating"
                            >
                                {{ isUpdating ? "Saving..." : "Save Changes" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
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