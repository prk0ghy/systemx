export default ({
	id,
	uid,
	images
}) => {
	const image = images[0];
	return `
		<section id="${id}" content-type="heroimage">
			<div class="inner-content">
				<figure class="heroimage">
					<img src="${image.url}" width="1920" height="1280"/>
					<details class="license">
						<summary>&sect;</summary>
							<div class="license-content"> <a href="https://www.youtube.com/watch?v=GwzfjtYKXhw">https://www.youtube.com/watch?v=GwzfjtYKXhw</a></div>
					</details>
					<figcaption><p>So viele unterschiedliche Möglichkeiten eine Geschichte zu erzählen.</p></figcaption>
				</figure>
			</div>
		</section>
	`;
};
