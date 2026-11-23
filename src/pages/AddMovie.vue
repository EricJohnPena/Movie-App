<template>
    <div class="container my-5" style="max-width: 500px">
        <h1 class="text-center">Add New Movie</h1>
        <form v-on:submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="movieTitleInput" class="form-label">Movie Title</label>
                <input type="text" class="form-control" id="movieTitleInput" v-model="title" />
            </div>
            <div class="mb-3">
                <label for="movieDirectorInput" class="form-label">Movie Director</label>
                <input type="text" class="form-control" id="movieDirectorInput" v-model="director" />
            </div>
            <div class="mb-3">
                <label for="movieYearInput" class="form-label">Movie Year</label>
                <input type="number" class="form-control" id="movieYearInput" v-model="year" />
            </div>
            <div class="mb-3">
                <label for="movieDescription" class="form-label">Description</label>
                <textarea
                    class="form-control"
                    id="movieDescription"
                    v-model="description"
                    rows="5"
                ></textarea>
            </div>
            <div class="mb-3">
                <label for="movieGenreInput" class="form-label">Movie Genre</label>
                <input type="text" class="form-control" id="movieGenreInput" v-model="genre" />
            </div>
            
            <button type="submit" class="btn btn-primary" v-if="isEnabled">Add Movie</button>
            <button type="submit" class="btn btn-danger" disabled v-else>Add Movie</button>
        </form>
    </div>
</template>

<script setup>
    import { ref, onBeforeMount, watch } from "vue";
    import { Notyf } from "notyf";
    import { useRouter } from "vue-router";
    import { useGlobalStore } from "../stores/user";
    import api from "../api";

    const notyf = new Notyf();
    const router = useRouter();
    const { user } = useGlobalStore();

    const title = ref("");
    const description = ref("");
    const director = ref("");
    const year = ref(0);
    const genre = ref("");
    const isEnabled = ref(false);

    async function handleSubmit() {
        const movie = {
            title: title.value,
            director: director.value,
            year: year.value,
            description: description.value,
            genre: genre.value,
        };

        try {
            const response = await api.post("/movies/addMovie", movie);

            if (response.status === 201) {
                notyf.success("Movie added successfully");

                router.push({ path: "/movies" });
            } else {
                notyf.error(response.data.message);
            }
        } catch (error) {
            if (error.response.status === 409) {
                notyf.error(error.response.data.message);
            } else {
                console.error(error.response.data.message);
                notyf.error("Error adding movie. Please contact administrator.");
            }
        }
    }

    watch([title, description, year, director, genre], (currentValue, oldValue) => {
        if (currentValue.every((input) => input !== "")) {
            isEnabled.value = true;
        } else {
            isEnabled.value = false;
        }
    });

    onBeforeMount(() => {
        if (!user.token || !user.isAdmin) {
            router.push({ path: "/movies" });
        }
    });
</script>