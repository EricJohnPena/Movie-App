<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card cine-card cine-card-hover cine-movie-card h-100 border-0 overflow-hidden">
            <!-- Poster Area -->
            <div class="cine-poster-wrap">
                <img
                    class="cine-poster-img"
                    :src="`https://placehold.co/600x375/1a2234/a5b4fc?font=raleway&text=${encodeURIComponent(movieData.title || 'Movie')}`"
                    :alt="movieData.title"
                    loading="lazy"
                />
                <div class="cine-poster-overlay"></div>

                <span
                    v-if="movieData.genre"
                    class="cine-poster-badge cine-poster-badge-left d-inline-flex align-items-center gap-1"
                >
                    <i class="bi bi-tag-fill"></i>
                    <span>{{ movieData.genre }}</span>
                </span>

                <span
                    v-if="movieData.year"
                    class="cine-poster-badge cine-poster-badge-right d-inline-flex align-items-center gap-1"
                >
                    <i class="bi bi-calendar3 text-info"></i>
                    <span>{{ movieData.year }}</span>
                </span>
            </div>

            <!-- Card Body -->
            <div class="card-body d-flex flex-column p-4">
                <h4 class="card-title h5 fw-bold text-light mb-2 text-truncate" :title="movieData.title">
                    {{ movieData.title }}
                </h4>

                <!-- Director & Comments Meta -->
                <div class="d-flex flex-wrap align-items-center gap-3 small text-secondary mb-3">
                    <span v-if="movieData.director" class="d-inline-flex align-items-center gap-1">
                        <i class="bi bi-camera-reels text-info"></i>
                        <span>{{ movieData.director }}</span>
                    </span>
                    <span class="d-inline-flex align-items-center gap-1">
                        <i class="bi bi-chat-dots text-info"></i>
                        <span>{{ movieData.comments?.length || 0 }}</span>
                    </span>
                </div>

                <p class="card-text small text-secondary cine-line-clamp-3 mb-4">
                    {{ movieData.description || "No description available for this movie." }}
                </p>

                <div class="mt-auto d-grid">
                    <router-link
                        :to="{ path: `/movies/${movieData._id}` }"
                        class="btn btn-cine-outline d-inline-flex align-items-center justify-content-center gap-2"
                    >
                        <i class="bi bi-play-circle"></i>
                        <span>View Movie</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
	props: {
		movieData: Object,
	},
	setup({ movieData }) {
		
		return {
			movieData,
			
		};
	},
};
</script>
