import Footer from "@/components/ul/Footer";
import Nav from "@/components/ul/Nav";

export default function PublicLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
