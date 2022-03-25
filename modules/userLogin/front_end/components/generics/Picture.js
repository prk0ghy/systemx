import styles from "./Picture.module.css";
import cx from "classnames";
const Picture = ({
	autoHeight = false,
	alt,
	height,
	src,
	width,
	objectPosition,
	className
}) => {
	const imageClassName = cx(styles.image, className, {
		[styles.autoHeight]: autoHeight
	});
	return (
		<img
			alt={ alt }
			className={ imageClassName }
			height={ height }
			src={ src }
			style={ {
				objectPosition
			} }
			width={ width }
		/>
	);
};
export default Picture;
