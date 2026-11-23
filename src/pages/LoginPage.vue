<script setup>
import { watch, ref, onBeforeMount } from "vue";
import { Notyf } from "notyf";
import api from "../api.js";
import { useGlobalStore } from "../stores/user.js";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);

const notyf = new Notyf();

const { getUserDetails, user } = useGlobalStore();

watch([email, password], (currentValue, oldValue) => {
	if (currentValue.every((input) => input !== "")) {
		isEnabled.value = true;
	} else {
		isEnabled.value = false;
	}
});

async function handleSubmit(e) {
	e.preventDefault();

	try {
		let res = await api.post("/users/login", {
			email: email.value,
			password: password.value,
		});



		const myToken =
			res.data?.access ||
			res.data?.token ||
			res.data?.accessToken ||
			res.data?.data?.token;

		if (myToken) {
			const successMessage = res.data.message || "Login Successful!";
			notyf.success(successMessage);

			localStorage.setItem("token", myToken);

			await getUserDetails(myToken);

			email.value = "";
			password.value = "";

			router.push({ path: "/" });
		} else {
			console.warn("No token found in response:", res.data);
			notyf.error(res.data?.message || "Login succeeded, but no token was returned.");
		}
	} catch (e) {
		console.error("Login Error Details:", e);

		if (
			e.response &&
			(e.response.status === 404 || e.response.status === 401 || e.response.status === 400)
		) {
			const errorMessage =
				e.response.data?.message || e.response.data?.error || "Invalid Credentials";
			notyf.error(errorMessage);
		} else {
			notyf.error("Login Failed. Please Contact Administrator");
		}
	}
}

onBeforeMount(() => {
	if (user.token) {
		router.push({ path: "/" });
	}
});
</script>

<template>
    <div class="cine-auth-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
                    <div class="cine-card p-4 p-sm-5">
                        <!-- Header -->
                        <div class="text-center mb-4">
                            <div class="cine-brand-badge mb-3">
                                <i class="bi bi-film"></i>
                            </div>
                            <h1 class="h3 fw-bold cine-gradient-text mb-1">Welcome Back</h1>
                            <p class="text-secondary small mb-0">
                                Sign in to explore movies and join the discussion
                            </p>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="mb-3">
                                <label for="emailInput" class="form-label small fw-semibold text-light">
                                    Email Address
                                </label>
                                <div class="input-group cine-input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        class="form-control"
                                        id="emailInput"
                                        v-model="email"
                                        placeholder="you@example.com"
                                        autocomplete="email"
                                        :disabled="isLoading"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="passwordInput" class="form-label small fw-semibold text-light">
                                    Password
                                </label>
                                <div class="input-group cine-input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-lock"></i>
                                    </span>
                                    <input
                                        :type="showPassword ? 'text' : 'password'"
                                        class="form-control"
                                        id="passwordInput"
                                        v-model="password"
                                        placeholder="Enter your password"
                                        autocomplete="current-password"
                                        :disabled="isLoading"
                                        required
                                    />
                                    <button
                                        type="button"
                                        class="btn cine-toggle-btn"
                                        @click="showPassword = !showPassword"
                                        :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                        tabindex="-1"
                                    >
                                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="d-grid">
                                <button
                                    type="submit"
                                    class="btn btn-cine-primary d-flex align-items-center justify-content-center gap-2"
                                    :disabled="!isEnabled || isLoading"
                                >
                                    <span
                                        v-if="isLoading"
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    <i v-else class="bi bi-box-arrow-in-right"></i>
                                    <span>{{ isLoading ? "Signing in..." : "Sign In" }}</span>
                                </button>
                            </div>
                        </form>

                        <!-- Footer Link -->
                        <div class="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
                            <p class="small text-secondary mb-0">
                                Don't have an account?
                                <router-link
                                    to="/register"
                                    class="text-decoration-none fw-semibold ms-1"
                                    style="color: var(--cine-accent)"
                                >
                                    Create one
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
