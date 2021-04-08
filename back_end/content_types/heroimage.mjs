export function getRenderer() {
	return ["inhaltsbausteine_heroimage_BlockType"];
}

export async function render({id, uid, images}) {
	uid; // NOP so eslint won't complain, remove ASAP
	const image = images[0];
	return `
		<section id="${id}" content-type="heroimage">
			<inner-content>
				<figure figure-type="heroimage">
					<img src="${image.url}" width="1920" height="1280"/>
					<details class="license">
						<summary>&sect;</summary>
							<license-content> <a href="https://www.youtube.com/watch?v=GwzfjtYKXhw">https://www.youtube.com/watch?v=GwzfjtYKXhw</a></license-content>
					</details>
					<figcaption><p>So viele unterschiedliche Möglichkeiten eine Geschichte zu erzählen.</p></figcaption>
				</figure>
			</inner-content>
		</section>
	`;
};
