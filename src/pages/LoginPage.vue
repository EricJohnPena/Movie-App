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
	<div class="container-fluid">
		<h1 class="my-5 pt-3 text-primary text-center">Login Page</h1>
		<div class="row d-flex justify-content-center">
			<div class="col-md-5 border rounded-3 mx-auto p-5">
				<form v-on:submit="handleSubmit">
					<div class="mb-3">
						<label for="emailInput" class="form-label">Email Address</label>
						<input type="email" class="form-control" id="emailInput" v-model="email" />
					</div>
					<div class="mb-3">
						<label for="passwordInput" class="form-label">Password</label>
						<input type="password" class="form-control" id="passwordInput" v-model="password" />
					</div>
					<div class="d-grid mt-5">
						<button type="submit" class="btn btn-primary " v-if="isEnabled">Login</button>
						<button type="submit" class="btn btn-info " disabled v-else>Login</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
