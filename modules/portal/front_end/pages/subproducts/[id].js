import { Brands } from "../../contexts/Brand";
import { Subproduct } from "./subproducts";
import { useProducts } from "../../contexts/Products";

const Subproductpage = async ({ subproduct }) => {
	// onst [{ products }] = useProducts();
	const res = await fetch(`http://localhost:3000/subproducts`);
	console.log(res);
	return (
		<></>
		// <Subproduct/>
	);
};

// export async function getStaticPaths() {
	// const res = await fetch(`http://localhost:3000/subproducts`);
	// console.log(res);
	// const subproducts = await res.json;

	/* const paths = subproducts.map((subproduct) => ({
		params: { id: subproduct.id }
	})); */
	// const paths = { "abc": { "abc": "/subproducts/abc" }, "def": { "def": "/subproducts/abc" } };

	// return { paths, fallback: false };
// }

/* export async function getStaticProps({ params }) {
	const res = await fetch(`http://localhost/subproducts/${params.id}`);
	const subproduct = await res.json;

	return { props: { subproduct } };
} */

export default Subproductpage;
