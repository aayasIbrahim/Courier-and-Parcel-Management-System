import Footer from "@/components/ui/ul/Footer";
import Nav from "@/components/ui/ul/Nav";

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
