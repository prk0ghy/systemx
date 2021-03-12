import query from "../cms.mjs";

export function getRenderer() {
	return [];
}

export async function render() {
	const result = await query(scope => `
		entries {
			${scope.entry}
			children {
				${scope.entry}
			}
		}
	`);
	return `
		<nav>
			${JSON.stringify(result)}
		</nav>
	`;
};
