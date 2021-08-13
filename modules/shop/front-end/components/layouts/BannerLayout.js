import cx from "classnames";
import ImageText from "components/generics/ImageText";
import Laced from "components/generics/Laced";
import styles from "./BannerLayout.module.css";
const BannerLayout = ({
	children,
	className,
	headline,
	height,
	image,
	width
}) => (
	<div className={ cx(styles.bannerLayout, className) }>
		<div className={ styles.banner }>
			<img
				alt=""
				className={ styles.image }
				height={ height }
				src={ image }
				width={ width }
			/>
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
export default BannerLayout;
export const TextContent = ({ children }) => (
	<div className={ styles.textContent }>
		<Laced>
			{ children }
		</Laced>
	</div>
);
