import dynamic from "next/dynamic";
import { useAuthentication } from "contexts/Authentication";
const NeverUsers = ({ children }) => {
	const [{ user }] = useAuthentication();
	const isLoggedIn = Boolean(user?.name);
	return isLoggedIn
		? null
		: children;
};
export default dynamic(() => Promise.resolve(NeverUsers), {
	ssr: false
});
