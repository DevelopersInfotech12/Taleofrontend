import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";

export default function ProductsPage() {
  return (
    <div>
      <Navbar />
      <OtherHero
        title="Products"
        subtitle="Discover our jewellery"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        useAdminSlides
      />
      <Footer />
    </div>
  );
}