import cx from "classnames";
import { H } from "root/format";
import ImageText from "components/generics/ImageText";
import Laced from "components/generics/Laced";
import LogoLayout from "./LogoLayout";
import styles from "./BannerLayout.module.css";
import Picture from "../generics/Picture";
const BannerLayout = ({
	children,
	className,
	fullHeight = false,
	halfHeight = false,
	headline,
	noTopMargin = false,
	picture,
	showLogo = false,
	textAlignRight = false
}) => {
	const headlineContent = typeof headline === "string"
		? <H>{ headline }</H>
		: headline;
	return (
		<div className={ cx(styles.bannerLayout, className) }>
			<div className={ [styles.banner,
				(halfHeight && styles.halfHeight),
				(fullHeight && styles.fullHeight),
				(noTopMargin && styles.noTopMargin)
			].join(" ") }
			>
				<Picture className={ styles.image } { ...picture }/>
				{ showLogo
					? (
						<LogoLayout>
							{ headlineContent }
						</LogoLayout>
					)
					: (
						<div className={ styles.headline }>
							<Laced>
								<h1>
									<ImageText className={ [styles.headlineContent,
										textAlignRight
											? styles.headlineRight
											: null].join(" ") }
									>{ headlineContent }
									</ImageText>
								</h1>
							</Laced>
						</div>
					)
				}
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
