<template>
	<div class="container-fluid">
		<h1 class="my-5 pt-3 text-primary text-center">Register Page</h1>
		<div class="row d-flex justify-content-center">
			<div class="col-md-5 border-round rounded-3 mx-auto p-5">
				<form v-on:submit="handleSubmit">

					<div class="mb-3">
						<label for="emailInput" class="form-label">Email Address:</label>
						<input type="email" id="emailInput" class="form-control" v-model="email" />
					</div>

					<div class="mb-3">
						<label for="passwordInput" class="form-label">Password:</label>
						<input type="password" id="passwordInput" class="form-control" v-model="password" />
					</div>

					<div class="mb-3">
						<label for="cpasswordInput" class="form-label">Confirm Password:</label>
						<input type="password" id="cpasswordInput" class="form-control" v-model="confirmPass" />
					</div>

					<div class="d-grid mt-5">
						<button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Submit</button>

						<button type="submit" class="btn btn-warning btn-block" v-else disabled>Submit</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/user.js";
import api from "../api.js";
import { Notyf } from "notyf";

const isEnabled = ref(false);

const email = ref("");
const password = ref("");
const confirmPass = ref("");

const router = useRouter();
const { user } = useGlobalStore();
const notyf = new Notyf();

watch([ email, password, confirmPass], (currentValue, oldValue) => {
	if (currentValue.every((input) => input !== "") && currentValue[1] === currentValue[2]) {
		isEnabled.value = true;
	} else {
		isEnabled.value = false;
	}
});

async function handleSubmit(event) {
	event.preventDefault();

	try {
		

		let response = await api.post("/users/register", {
			email: email.value,
			password: password.value,
		});

		if (response.status === 201) {

			email.value = "";
			password.value = "";
			confirmPass.value = "";

			router.push({ path: "/login" });
			notyf.success("Register account success!")
		} else {

			notyf.error("Registration Failed. Please Contact Administrator");
		}
	} catch (e) {
		if (e.response.status === 400 || e.response.status === 401 || e.response.status === 404 || e.response.status === 409 ) {
			notyf.error(e.response.data.message);
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
