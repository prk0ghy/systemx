import query from "../cms.mjs";
export default async () => {
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
