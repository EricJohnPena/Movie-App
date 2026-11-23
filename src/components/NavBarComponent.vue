<template>
    <nav class="navbar navbar-expand-lg sticky-top bg-primary shadow-sm">
        <div class="container">
           
            <!-- <router-link :to="{ name: 'Movies' }" class="navbar-brand d-flex align-items-center">
               <h1>Movies</h1>
            </router-link> -->

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto">
                    <!-- <router-link :to="{ name: 'Profile' }" class="nav-link" v-if="store.user?.email">Profile</router-link>
                -->

                    <router-link :to="{ name: 'Register' }" class="nav-link" v-if="!store.user?.email">Register</router-link>
                    <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!store.user?.email">Login</router-link>
                    
                    <a href="#" class="nav-link" v-else @click.prevent="handleLogout">Logout</a> 
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useGlobalStore } from "../stores/user.js";
import { useRouter } from "vue-router";

const store = useGlobalStore();
const router = useRouter();

function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) {
        return;
    }
    localStorage.removeItem("token");
    
    store.user.email = null;
    store.user.isAdmin = null;
    store.user.token = null; 
    
    router.push({ name: 'Login' });
}
</script>