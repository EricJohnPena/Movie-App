<template>
    <div v-if="user.token && user.isAdmin" class="container">
        <h1 class="text-center text-primary mt-5 mb-4">Admin Dashboard</h1>

        <div class="d-flex justify-content-end mb-3">
            <!-- <router-link :to="{ name: 'Add Movie' }" class="btn btn-primary">
                + Add Movie
            </router-link> -->
        </div>

        <table class="table table-striped border">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Year</th>
                    <th>Genre</th>
                    <th>Comments</th>
                    <th colspan="2">Actions</th>
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
                    <!-- Action buttons go here -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onBeforeMount, watch } from "vue";
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

async function verifyAdminAccess() {
    // 1. Not logged in
    if (!user.token) {
        notyf.error("Please log in to access this page.");
        router.push("/login");
        return;
    }

    // 2. Wait for user details on page refresh (when token exists but isAdmin is still null)
    if (user.isAdmin === null) {
        await getUserDetails(user.token);
    }

    // 3. Re-check after fetching details (invalid token or non-admin)
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

// Redirect immediately if the user logs out while on the dashboard
watch(
    () => user.token,
    (newToken) => {
        if (!newToken) {
            router.push("/login");
        }
    }
);
</script>