import query from "../cms.mjs";
export default async () => {
	const result = await query(scope => `
		entries {
			${scope.entries}
			children {
				${scope.entries}
			}
		}
	`);
	return `
		<nav>
			${JSON.stringify(result)}
		</nav>
	`;
};
