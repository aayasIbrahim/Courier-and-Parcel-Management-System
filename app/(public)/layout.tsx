import Nav from "@/components/ul/Nav";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

