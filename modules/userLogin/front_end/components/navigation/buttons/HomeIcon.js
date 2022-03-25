import Link from "next/link";
import routes from "root/routes";
import styles from "./HomeIcon.module.css";
import { useBrand } from "contexts/Brand";
import Picture from "../../generics/Picture";
const HomeIcon = () => {
	const [{ pictures }] = useBrand();
	return (
		<li className={ styles.item }>
			<Link href={ routes.home.path }>
				<a className={ styles.link }>
					<Picture className={ styles.image } { ...pictures.logo }/>
				</a>
			</Link>
		</li>
	);
};
export default HomeIcon;
