<template>
    <div class="container">
        <div class="row">
            <div class="col my-5">
                <h1 class="text-center text-primary py-1">
                    Movies 
                </h1>
                <p class="text-center">
                    Select a movie to watch
                </p>
            </div>
        </div>

        <div class="row g-4">
            <template
                v-for="movie in movieData"
                :key="movie._id"
            >
                <MovieComponent :movieData="movie" />
            </template>
        </div>
    </div>
</template>

<script setup>
import MovieComponent from './MovieComponent.vue';

defineProps({
    movieData: {
        type: Array,
        required: true,
    },
});
</script>