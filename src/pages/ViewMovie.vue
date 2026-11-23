<template>
    <div class="container">
        <div class="row mx-auto my-5 gap-4 gap-md-0">
            <div class="col-md-6">
                <img
                    class="img-fluid rounded"
                    :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(movie.data.title || 'Movie')}`"
                    :alt="movie.data.title"
                />
            </div>

            <div class="col-md-6">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="mb-3">{{ movie.data.title }}</h1>
                </div>

                <h6>Movie Details:</h6>
                <p class="text-muted mb-1"><strong>Director:</strong> {{ movie.data.director }}</p>
                <p class="text-muted mb-1"><strong>Year:</strong> {{ movie.data.year }}</p>
                <p class="text-muted mb-3"><strong>Genre:</strong> {{ movie.data.genre }}</p>

                <h6>Description:</h6>
                <p class="text-muted">{{ movie.data.description }}</p>

                <hr class="my-4" />

                <!-- Add Comment Form -->
                <form v-if="user.token" @submit.prevent="handleSubmit" class="mb-4">
                    <label for="commentInput" class="form-label fw-semibold">Add a Comment</label>
                    <textarea
                        id="commentInput"
                        v-model="commentText"
                        class="form-control mb-2"
                        rows="3"
                        placeholder="Write your thoughts about this movie..."
                        :disabled="isSubmitting"
                    ></textarea>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="!commentText.trim() || isSubmitting"
                    >
                        {{ isSubmitting ? "Posting..." : "Add Comment" }}
                    </button>
                </form>

                <div v-else class="alert alert-info">
                    Please <router-link to="/login">log in</router-link> to leave a comment.
                </div>

                <!-- Comments List -->
                <h6>Comments ({{ movie.data.comments?.length || 0 }})</h6>
                <ul v-if="movie.data.comments?.length" class="list-group">
                    <li
                        v-for="(item, index) in movie.data.comments"
                        :key="item._id || index"
                        class="list-group-item"
                    >
                        <p class="mb-0">{{ item.comment || item }}</p>
                    </li>
                </ul>
                <p v-else class="text-muted">No comments yet. Be the first to comment!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from "../api";
import { reactive, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/user";

const { user } = useGlobalStore();
const notyf = new Notyf();

const route = useRoute();
const router = useRouter();

const movie = reactive({ data: {} });
const commentText = ref("");
const isSubmitting = ref(false);

async function fetchMovie() {
    try {
        let { data } = await api.get(`/movies/getMovie/${route.params.id}`);
        movie.data = data;
    } catch (error) {
        notyf.error("Failed to load movie details.");
    }
}

async function handleSubmit() {
    if (!user.token) {
        notyf.error("Please log in to add a comment.");
        router.push("/login");
        return;
    }

    if (!commentText.value.trim()) {
        notyf.error("Comment cannot be empty.");
        return;
    }

    isSubmitting.value = true;

    try {
        let { data } = await api.patch(`/movies/addComment/${route.params.id}`, {
            comment: commentText.value.trim(),
        });

        notyf.success(data.message || "Comment added!");
        commentText.value = "";

        // Refresh the movie so the new comment appears immediately
        await fetchMovie();
    } catch (error) {
        console.error("Add Comment Error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to add comment.";
        notyf.error(errorMessage);
    } finally {
        isSubmitting.value = false;
    }
}

onBeforeMount(() => {
    fetchMovie();
});
</script>