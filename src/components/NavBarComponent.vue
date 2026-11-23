<template>
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top cine-navbar" data-bs-theme="dark">
        <div class="container">
            <!-- Brand -->
            <router-link
                :to="{ name: 'Movies' }"
                class="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
            >
                <span class="cine-nav-brand-icon">
                    <i class="bi bi-film"></i>
                </span>
                <span class="fs-4 fw-bold cine-gradient-text tracking-tight">Movies</span>
            </router-link>

            <!-- Mobile Toggler -->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Nav Links -->
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto align-items-lg-center gap-2 pt-3 pt-lg-0">
                    <router-link
                        :to="{ name: 'Movies' }"
                        class="nav-link cine-nav-link d-flex align-items-center gap-2"
                    >
                        <i class="bi bi-collection-play"></i>
                        <span>Catalog</span>
                    </router-link>

                    <!-- <router-link
                        :to="{ name: 'Profile' }"
                        class="nav-link cine-nav-link d-flex align-items-center gap-2"
                        v-if="store.user?.email"
                    >
                        <i class="bi bi-person-circle"></i>
                        <span>Profile</span>
                    </router-link> -->

                    <!-- <router-link
                        :to="{ name: 'Admin' }"
                        class="nav-link cine-nav-link d-flex align-items-center gap-2"
                        v-if="store.user?.isAdmin"
                    >
                        <i class="bi bi-shield-lock"></i>
                        <span>Admin Dashboard</span>
                    </router-link> -->

                    <!-- Logged Out State -->
                    <template v-if="!store.user?.email">
                        <router-link
                            :to="{ name: 'Login' }"
                            class="nav-link cine-nav-link d-flex align-items-center gap-2"
                        >
                            <i class="bi bi-box-arrow-in-right"></i>
                            <span>Login</span>
                        </router-link>

                        <router-link
                            :to="{ name: 'Register' }"
                            class="btn btn-cine-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2"
                        >
                            <i class="bi bi-person-plus"></i>
                            <span>Register</span>
                        </router-link>
                    </template>

                    <!-- Logged In State -->
                    <template v-else>
                        <div class="cine-user-pill my-1 my-lg-0">
                            <i class="bi bi-person-circle text-info"></i>
                            <span class="text-truncate" style="max-width: 180px">
                                {{ store.user.email }}
                            </span>
                            <span v-if="store.user.isAdmin" class="cine-admin-badge">
                                Admin
                            </span>
                        </div>

                        <button
                            type="button"
                            class="btn btn-cine-danger-soft d-inline-flex align-items-center justify-content-center gap-2"
                            @click.prevent="handleLogout"
                        >
                            <i class="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </button>
                    </template>
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