<template>
    <div class="container py-5">
        <!-- Back Navigation -->
        <div class="mb-4">
            <router-link
                to="/"
                class="btn btn-cine-ghost btn-sm d-inline-flex align-items-center gap-2 px-3 py-2"
            >
                <i class="bi bi-arrow-left"></i>
                <span>Back to Movies</span>
            </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="cine-card text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-secondary small mb-0">Loading movie details...</p>
        </div>

        <template v-else>
            <!-- Main Movie Overview Card -->
            <div class="cine-card p-4 p-lg-5 mb-4">
                <div class="row g-4 g-lg-5 align-items-center">
                    <!-- Poster -->
                    <div class="col-12 col-lg-5">
                        <div class="cine-detail-poster">
                            <img
                                :src="`https://placehold.co/600x450/1a2234/a5b4fc?font=raleway&text=${encodeURIComponent(movie.data.title || 'Movie')}`"
                                :alt="movie.data.title"
                            />
                            <span
                                v-if="movie.data.genre"
                                class="cine-poster-badge cine-poster-badge-left d-inline-flex align-items-center gap-1"
                            >
                                <i class="bi bi-tag-fill"></i>
                                <span>{{ movie.data.genre }}</span>
                            </span>
                        </div>
                    </div>

                    <!-- Movie Info -->
                    <div class="col-12 col-lg-7">
                        <div class="cine-hero-pill mb-3">
                            <i class="bi bi-film text-info"></i>
                            <span>Featured Title</span>
                        </div>

                        <h1 class="display-6 fw-bold cine-gradient-text mb-3">
                            {{ movie.data.title }}
                        </h1>

                        <!-- Metadata Chips -->
                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <span v-if="movie.data.director" class="cine-meta-chip">
                                <i class="bi bi-camera-reels text-info"></i>
                                <span class="text-secondary">Director:</span>
                                <strong class="text-light">{{ movie.data.director }}</strong>
                            </span>

                            <span v-if="movie.data.year" class="cine-meta-chip">
                                <i class="bi bi-calendar3 text-info"></i>
                                <span class="text-secondary">Year:</span>
                                <strong class="text-light">{{ movie.data.year }}</strong>
                            </span>

                            <span class="cine-meta-chip">
                                <i class="bi bi-chat-dots text-info"></i>
                                <strong class="text-light">{{ movie.data.comments?.length || 0 }}</strong>
                                <span class="text-secondary">
                                    {{ (movie.data.comments?.length || 0) === 1 ? "Comment" : "Comments" }}
                                </span>
                            </span>
                        </div>

                        <!-- Synopsis -->
                        <div class="pt-3 border-top border-secondary border-opacity-25">
                            <h6 class="text-uppercase small fw-bold text-secondary mb-2" style="letter-spacing: 0.06em">
                                Synopsis
                            </h6>
                            <p class="text-light opacity-75 lh-lg mb-0">
                                {{ movie.data.description || "No description available for this movie." }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discussion / Comments Card -->
            <div class="cine-card p-4 p-lg-5">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                    <h2 class="h4 fw-bold text-light d-flex align-items-center gap-2 mb-0">
                        <i class="bi bi-chat-square-quote text-info"></i>
                        <span>Discussion</span>
                    </h2>
                    <span class="cine-count-pill">
                        <i class="bi bi-chat-dots text-info"></i>
                        <span>{{ movie.data.comments?.length || 0 }} Comments</span>
                    </span>
                </div>

                <!-- Add Comment Form -->
                <form v-if="user.token" @submit.prevent="handleSubmit" class="mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                    <label for="commentInput" class="form-label small fw-semibold text-light mb-2">
                        Leave a Comment
                    </label>
                    <textarea
                        id="commentInput"
                        v-model="commentText"
                        class="form-control cine-input mb-3"
                        rows="3"
                        placeholder="Share your thoughts, favorite scenes, or review..."
                        :disabled="isSubmitting"
                    ></textarea>
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <span class="small text-secondary">
                            <i class="bi bi-person-circle text-info me-1"></i>
                            Posting as <strong class="text-light">{{ user.email || "Authenticated User" }}</strong>
                        </span>
                        <button
                            type="submit"
                            class="btn btn-cine-primary d-inline-flex align-items-center gap-2 px-4"
                            :disabled="!commentText.trim() || isSubmitting"
                        >
                            <span
                                v-if="isSubmitting"
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            <i v-else class="bi bi-send-fill"></i>
                            <span>{{ isSubmitting ? "Posting..." : "Add Comment" }}</span>
                        </button>
                    </div>
                </form>

                <!-- Guest Login Prompt -->
                <div
                    v-else
                    class="cine-info-banner d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4"
                >
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-info-circle-fill text-info fs-5"></i>
                        <span>Sign in to share your thoughts and join the discussion.</span>
                    </div>
                    <router-link
                        to="/login"
                        class="btn btn-cine-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2 flex-shrink-0"
                    >
                        <i class="bi bi-box-arrow-in-right"></i>
                        <span>Log In</span>
                    </router-link>
                </div>

                <!-- Comments List -->
                <div v-if="movie.data.comments?.length" class="d-flex flex-column gap-3">
                    <div
                        v-for="(item, index) in movie.data.comments"
                        :key="item._id || index"
                        class="cine-comment-item d-flex gap-3 align-items-start"
                    >
                        <div class="cine-comment-avatar">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between gap-2 mb-1">
                                <span class="small fw-semibold text-light">
                                    Viewer #{{ index + 1 }}
                                </span>
                                <span v-if="item.userId" class="cine-id-chip text-truncate" :title="item.userId">
                                    {{ item.userId }}
                                </span>
                            </div>
                            <p class="mb-0 text-light opacity-75" style="white-space: pre-line">
                                {{ item.comment || item }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Empty Comments State -->
                <div v-else class="cine-empty-state text-center py-4">
                    <div class="cine-brand-badge mb-3">
                        <i class="bi bi-chat-dots"></i>
                    </div>
                    <h6 class="fw-semibold text-light mb-1">No comments yet</h6>
                    <p class="text-secondary small mb-0">
                        Be the first to share your thoughts about this movie!
                    </p>
                </div>
            </div>
        </template>
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
const isLoading = ref(true);

async function fetchMovie(showSpinner = false) {
    if (showSpinner) isLoading.value = true;

    try {
        let { data } = await api.get(`/movies/getMovie/${route.params.id}`);
        movie.data = data;
    } catch (error) {
        notyf.error("Failed to load movie details.");
    } finally {
        isLoading.value = false;
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

        await fetchMovie(false);
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
    fetchMovie(true);
});
</script>