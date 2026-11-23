<template>
    <div class="container">
        <div class="row mx-auto my-5 gap-4 gap-md-0">
            <div class="col-md-6">
                <img class="img-fluid rounded" :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(movie.data.title || 'Movie')}`" :alt="movie.data.title" />
            </div>
            
            
            <form class="col-md-6" @submit.prevent="handleSubmit">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="mb-3">{{ movie.data.title }}</h1>
                </div>
                
                <h6>Movie Description:</h6>
                <p class="text-muted">{{ movie.data.director }}</p>
                <p class="text-muted">{{ movie.data.year }}</p>

                <p class="text-muted">{{ movie.data.description }}</p>
                <p class="text-muted">{{ movie.data.genre }}</p>
                <p class="text-muted">{{ movie.data.comments }}</p>
              
               
            </form>
        </div>
    </div>
</template>

<script setup>
import api from "../api";
import { reactive, onBeforeMount, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/user";

const { user } = useGlobalStore();
const notyf = new Notyf();

const route = useRoute();
const router = useRouter();

const quantity = ref(1);
const movie = reactive({ data: {} });






onBeforeMount(async () => {
    try {
        let { data } = await api.get(`/movies/getMovie/${route.params.id}`);
        movie.data = data;
    } catch (error) {
        notyf.error("Failed to load movie details.");
    }
});
</script>