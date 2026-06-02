const ranges = [
  {
    title: "餐廳空間",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "客廳空間",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "臥室空間",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  },
];

function RangeSection() {
  return (
    <section className="range-section section-padding no-select">
      <div className="site-container">
        <div className="section-title">
          <h2>依空間選購</h2>
          <p>從客廳、餐廳到臥室，找到適合你生活節奏的家具配置。</p>
        </div>

        <div className="row g-4 justify-content-center">
          {ranges.map((item) => (
            <div className="col-12 col-md-4" key={item.title}>
              <div className="range-card">
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RangeSection;
