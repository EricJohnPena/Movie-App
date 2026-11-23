<script>
import api from "../api.js";
import { ref, reactive, watch } from "vue";
import { useGlobalStore } from "../stores/user.js";
import UserView from "../components/UserView.vue";
import AdminView from "../components/AdminView.vue";

export default {
    components: {
        UserView,
        AdminView,
    },
    setup() {
        const movies = reactive({ data: [] });
        const isLoading = ref(false);
        const globalStore = useGlobalStore();

        async function fetchMovies() {
            isLoading.value = true;
            try {
                let { data } = await api.get("/movies/getMovies");
                movies.data = data.movies || [];
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                isLoading.value = false;
            }
        }

        watch(
            () => globalStore.user.token,
            async (token) => {
                isLoading.value = true;
                try {
                    await globalStore.getUserDetails(token);
                    await fetchMovies();
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                } finally {
                    isLoading.value = false;
                }
            },
            { immediate: true },
        );

        return {
            movies,
            globalStore,
            isLoading,
            fetchMovies,
        };
    },
};
</script>

<template>
    <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <template v-else>
        <AdminView
            v-if="globalStore.user.isAdmin"
            :movieData="movies.data"
            @refreshMovies="fetchMovies"
        />
        <UserView
            v-else
            :movieData="movies.data"
        />
    </template>
</template>