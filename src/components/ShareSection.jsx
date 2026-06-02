const shareImages = [
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-wide card-top",
    alt: "綠色沙發居家佈置",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-tall card-middle",
    alt: "白色餐桌與植栽空間",
  },
  {
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-large card-bottom",
    alt: "溫暖臥室空間",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-vertical card-top",
    alt: "現代客廳空間",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-small card-middle",
    alt: "柔和臥室佈置",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-wide card-bottom",
    alt: "居家燈具細節",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-large card-top",
    alt: "客廳家具配置",
  },
  {
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-small card-bottom",
    alt: "單椅家具細節",
  },
  {
    image:
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-vertical card-middle",
    alt: "收納櫃與室內空間",
  },
  {
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=900&auto=format&fit=crop",
    className: "share-marquee-card card-wide card-top",
    alt: "木質桌面居家風格",
  },
];

function ShareSection() {
  const marqueeItems = [...shareImages, ...shareImages];

  return (
    <section className="share-section no-select">
      <div className="section-title">
        <p>分享你的居家風格</p>
        <h2>#FuniroFurniture</h2>
      </div>

      <div className="share-marquee" aria-label="居家風格圖片牆">
        <div className="share-marquee-track">
          {marqueeItems.map((item, index) => (
            <div className={item.className} key={`${item.image}-${index}`}>
              <img src={item.image} alt={item.alt} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShareSection;
