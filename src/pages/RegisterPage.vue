<script setup>
import { ref, computed, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/user.js";
import api from "../api.js";
import { Notyf } from "notyf";

const router = useRouter();
const { user } = useGlobalStore();
const notyf = new Notyf();

const email = ref("");
const password = ref("");
const confirmPass = ref("");
const isEnabled = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordsMatch = computed(() => {
    return confirmPass.value !== "" && password.value === confirmPass.value;
});

watch([email, password, confirmPass], (currentValue) => {
    if (
        currentValue.every((input) => input.trim() !== "") &&
        currentValue[1] === currentValue[2]
    ) {
        isEnabled.value = true;
    } else {
        isEnabled.value = false;
    }
});

async function handleSubmit() {
    if (!isEnabled.value || isLoading.value) return;

    isLoading.value = true;

    try {
        const response = await api.post("/users/register", {
            email: email.value.trim(),
            password: password.value,
        });

        if (response.status === 201 || response.status === 200) {
            email.value = "";
            password.value = "";
            confirmPass.value = "";

            notyf.success(response.data?.message || "Account registered successfully!");
            router.push({ path: "/login" });
        } else {
            notyf.error("Registration Failed. Please Contact Administrator");
        }
    } catch (e) {
        console.error("Registration Error Details:", e);

        if (
            e.response &&
            [400, 401, 404, 409].includes(e.response.status)
        ) {
            const errorMessage =
                e.response.data?.message ||
                e.response.data?.error ||
                "Registration Failed.";
            notyf.error(errorMessage);
        } else {
            notyf.error("Registration Failed. Please Contact Administrator");
        }
    } finally {
        isLoading.value = false;
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
                                <i class="bi bi-person-plus"></i>
                            </div>
                            <h1 class="h3 fw-bold cine-gradient-text mb-1">Create Account</h1>
                            <p class="text-secondary small mb-0">
                                Join the community to explore movies and post reviews
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
                                        id="emailInput"
                                        class="form-control"
                                        v-model="email"
                                        placeholder="you@example.com"
                                        autocomplete="email"
                                        :disabled="isLoading"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="passwordInput" class="form-label small fw-semibold text-light">
                                    Password
                                </label>
                                <div class="input-group cine-input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-lock"></i>
                                    </span>
                                    <input
                                        :type="showPassword ? 'text' : 'password'"
                                        id="passwordInput"
                                        class="form-control"
                                        v-model="password"
                                        placeholder="Create a password"
                                        autocomplete="new-password"
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

                            <div class="mb-4">
                                <label for="cpasswordInput" class="form-label small fw-semibold text-light">
                                    Confirm Password
                                </label>
                                <div class="input-group cine-input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-shield-lock"></i>
                                    </span>
                                    <input
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        id="cpasswordInput"
                                        class="form-control"
                                        v-model="confirmPass"
                                        placeholder="Re-enter your password"
                                        autocomplete="new-password"
                                        :disabled="isLoading"
                                        required
                                    />
                                    <button
                                        type="button"
                                        class="btn cine-toggle-btn"
                                        @click="showConfirmPassword = !showConfirmPassword"
                                        :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                                        tabindex="-1"
                                    >
                                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>

                                <!-- Live Password Match Feedback -->
                                <div v-if="confirmPass" class="mt-2 small">
                                    <span
                                        v-if="passwordsMatch"
                                        class="text-success d-inline-flex align-items-center gap-1"
                                    >
                                        <i class="bi bi-check-circle-fill"></i>
                                        <span>Passwords match</span>
                                    </span>
                                    <span
                                        v-else
                                        class="text-danger d-inline-flex align-items-center gap-1"
                                    >
                                        <i class="bi bi-exclamation-circle-fill"></i>
                                        <span>Passwords do not match</span>
                                    </span>
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
                                    <i v-else class="bi bi-person-check"></i>
                                    <span>{{ isLoading ? "Creating account..." : "Create Account" }}</span>
                                </button>
                            </div>
                        </form>

                        <!-- Footer Link -->
                        <div class="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
                            <p class="small text-secondary mb-0">
                                Already have an account?
                                <router-link
                                    to="/login"
                                    class="text-decoration-none fw-semibold ms-1"
                                    style="color: var(--cine-accent)"
                                >
                                    Sign in
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>