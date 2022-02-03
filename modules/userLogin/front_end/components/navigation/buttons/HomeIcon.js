import Link from "next/link";
import routes from "root/routes";
import styles from "./HomeIcon.module.css";
import { useBrand } from "contexts/Brand";

const HomeIcon = () => {
	const [{
		logoHeight,
		logoURL,
		logoWidth
	}] = useBrand();
	return (
		<li className={ styles.item }>
			<Link href={ routes.home.path }>
				<a className={ styles.link }>
					<img
						alt="Logo"
						className={ styles.image }
						height={ logoHeight }
						src={ logoURL }
						width={ logoWidth }
					/>
				</a>
			</Link>
		</li>
	);
};
export default HomeIcon;
