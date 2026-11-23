<template>
	<div class="col-md-4">
		<div id="MovieCard" class="card p-2 h-100">
			<img 
                class="card-img-top"
                :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(movieData.title)}`"
                :alt="movieData.title"
            >
			<div class="card-body">
				<h4 class="card-title">
					{{ movieData.title }}
				</h4>
				<p class="card-text mt-3">
					{{ movieData.description }}
				</p>
				

				<div class="mt-auto text-center d-grid">
					<router-link :to="{path: `/movies/${movieData._id}`}" class="btn btn-outline-primary btn-block">View Movie</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		movieData: Object,
	},
	setup({ movieData }) {
		
		return {
			movieData,
			
		};
	},
};
</script>
