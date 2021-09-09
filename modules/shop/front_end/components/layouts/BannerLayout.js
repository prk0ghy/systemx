import cx from "classnames";
import { H } from "root/format";
import ImageText from "components/generics/ImageText";
import Laced from "components/generics/Laced";
import styles from "./BannerLayout.module.css";
const BannerLayout = ({
	children,
	className,
	halfHeight = false,
	autoHeight = false,
	headline,
	height,
	image,
	width
}) => {
	const headlineContent = typeof headline === "string"
		? <H>{ headline }</H>
		: headline;
	return (
		<div className={ cx(styles.bannerLayout, className) }>
			<div className={ styles.banner }>
				<img
					alt=""
					className={ [styles.image, halfHeight
						? styles.halfHeight
						: null, autoHeight
						? styles.autoHeight
						: null].join(" ") }
					height={ height }
					src={ image }
					width={ width }
				/>
				<div className={ styles.headline }>
					<Laced>
						<h1>
							<ImageText>{ headlineContent }</ImageText>
						</h1>
					</Laced>
				</div>
			</div>
			{ children }
		</div>
	);
};
export default BannerLayout;
export const TextContent = ({ children }) => (
	<div className={ styles.textContent }>
		<Laced>
			{ children }
		</Laced>
	</div>
);
