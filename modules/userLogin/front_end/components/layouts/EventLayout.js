import styles from "./EventLayout.module.css";
import Badge from "../navigation/Badge";
import { findProduct } from "userLoginCommon/product";
const EventLayout = () => {
	const schools = findProduct("tagungsbaende");
	const EventList = schools.children.map(event => {
		if (event.date !== "") {
			return (
				<Badge className={ styles.item } details key={ event.name } product={ event }/>
			);
		}
		else {
			return null;
		}
	});
	return (
		<div className={ styles.eventList }>
			<ul className={ styles.itemList }>
				{ EventList }
			</ul>
		</div>
	);
};
export default EventLayout;
