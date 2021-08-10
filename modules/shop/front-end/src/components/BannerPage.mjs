import Laced from "components/Laced.mjs";
import styles from "./BannerPage.css";
export default ({
	children,
	image,
	title
}) => (
	<div className={ styles.bannerPage }>
		<div className={ styles.banner }>
			<img className={ styles.image } src={ image }/>
			<div className={ styles.title }>
				<Laced>{ title }</Laced>
			</div>
		</div>
		<div className={ styles.content }>
			<Laced>
				{ children }
			</Laced>
		</div>
	</div>
);
