import dynamic from "next/dynamic";
import { useAuthentication } from "contexts/Authentication";
const OnlyUsers = ({ children }) => {
	const [{ user }] = useAuthentication();
	const isLoggedIn = Boolean(user?.name);
	return isLoggedIn
		? children
		: null;
};
export default dynamic(() => Promise.resolve(OnlyUsers), {
	ssr: false
});
