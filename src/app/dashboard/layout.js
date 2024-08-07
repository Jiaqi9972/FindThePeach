import NextAuthProvider from "../provider/NextAuthProvider";

export default function Layout({ children }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
