<script>
import NavBarComponent from "./components/NavBarComponent.vue";
import { useGlobalStore } from "./stores/user.js";
import { onBeforeMount } from "vue";

export default {
	components: {
		NavBarComponent,
	},
	setup() {
		const { getUserDetails } = useGlobalStore();

		onBeforeMount(() => {
			getUserDetails(localStorage.getItem("token"));
		})
	},
};
</script>

<template>
	<NavBarComponent />

	<router-view />
</template>
