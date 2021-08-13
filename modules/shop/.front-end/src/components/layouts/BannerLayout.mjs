import cx from "classnames";
import ImageText from "components/generics/ImageText.mjs";
import Laced from "components/generics/Laced.mjs";
import styles from "./BannerLayout.css";
export default ({
	children,
	className,
	headline,
	image
}) => (
	<div className={ cx(styles.bannerLayout, className) }>
		<div className={ styles.banner }>
			<img className={ styles.image } src={ image }/>
			<div className={ styles.headline }>
				<Laced>
					<h1>
						<ImageText>{ headline }</ImageText>
					</h1>
				</Laced>
			</div>
		</div>
		{ children }
	</div>
);
export const TextContent = ({ children }) => (
	<div className={ styles.textContent }>
		<Laced>
			{ children }
		</Laced>
	</div>
);
