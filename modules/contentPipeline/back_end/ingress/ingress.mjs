import * as graphql from "./graphql/ingress.mjs";

/* Theser are abstract procedures, which currently always call into
 * the GraphQL specific version, but should may different implementations
 * in the future, depending on the configuration. Everything should use these
 * abstract procedures and never directly call an implementation specific procedure.
 */
export const getNavigation = ()  => graphql.getNavigation();
export const getEntry      = url => graphql.getEntry(url);
export const getAllEntries = ()  => graphql.getAllEntries();
