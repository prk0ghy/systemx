import dynamic from "next/dynamic";
import { findProduct } from "../../pages/product/[pid]";
import styles from "./Library.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useProducts } from "../../contexts/Products";


const Library = () => {
	const [{ user }] = useAuthentication();
	const [{ products }] = useProducts();

	let allGroups = null;
	let groupList = null;

	allGroups = user?.groups;

	if (allGroups) {
		const usergroups = Object.values(allGroups);
		groupList = usergroups.map(d => (
			<li key={ d }>
				<a href={ findProduct(products, d).contentUri }>{ findProduct(products, d).name }</a>
			</li>
		));
	}

	return (
		<div className={ styles.library }>
			<h3>Bibliothek</h3>
			{ user
				? (
					<ul className={ styles.items }>
						{ groupList }
					</ul>
				)
				: null
			}
		</div>
	);
};
export default dynamic(() => Promise.resolve(Library), { ssr: false });
