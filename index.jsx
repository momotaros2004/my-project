import Navbar from './components/Navbar';
import Banner from './components/Banner';
import CategoryButton from './components/CategoryButton';
import ProductCard from './components/ProductCard';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Banner />
      <CategoryButton />

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ProductCard title="Nintendo Switch 2" image="https://ihavecpu.com/_nuxt/img/switch2.2e2.png" price="12,990" />
        <ProductCard title="คีย์บอร์ด MOFii" image="https://ihavecpu.com/_nuxt/img/mofii.9df9d.png" price="890" />
        {/* เพิ่มสินค้าอื่นๆ ตามต้องการ */}
      </div>
    </div>
  );
}

export default App;
