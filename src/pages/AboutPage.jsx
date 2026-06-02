import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content">
            <span className="about-hero__label">關於 Furniro</span>
            <h1>我們打造的不只是家具，而是讓生活慢下來的空間。</h1>
            <p>
              Furniro
              專注於溫潤、簡潔且耐看的居家設計。我們希望每一件家具都能融入日常，
              讓客廳、臥室與餐桌旁的每個片刻，都變得更舒適、更有質感。
            </p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="about-story__image">
                <img
                  src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop"
                  alt="溫暖的客廳空間"
                />
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="about-story__content">
                <span>品牌故事</span>
                <h2>好的家具，會讓房間真正有家的感覺。</h2>
                <p>
                  我們相信家具不只是填滿空間的物件，而是影響生活情緒的關鍵。從沙發、單椅、
                  餐桌到收納櫃，每一件家具都應該兼顧外型、比例、觸感與日常使用的便利性。
                </p>
                <p>
                  Furniro
                  的選品以柔和色調、自然材質與俐落線條為核心。不追逐短暫流行，
                  而是讓家具能陪伴你度過不同階段的生活，長久耐看，也容易搭配。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="section-title">
            <h2>我們重視的事</h2>
            <p>從材質、比例到使用細節，讓每個空間都更溫暖自然。</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="about-value-card">
                <span>01</span>
                <h3>舒適優先</h3>
                <p>
                  家具不只要好看，也要真正適合日常使用。我們重視坐感、尺寸與空間動線，
                  讓每一件家具都能自然融入生活。
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="about-value-card">
                <span>02</span>
                <h3>溫潤材質</h3>
                <p>
                  木質、織品、柔和皮革與自然紋理，能讓空間更有層次，同時保留安定、放鬆的居家氛圍。
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="about-value-card">
                <span>03</span>
                <h3>耐看設計</h3>
                <p>
                  我們偏好簡潔線條與中性色彩，讓家具能適應不同風格，也讓家在時間累積中依然舒服耐看。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-material">
        <div className="container">
          <div className="about-material__inner">
            <div className="about-material__content">
              <span>設計理念</span>
              <h2>用柔和色彩、自然紋理與實用細節，整理生活的節奏。</h2>
              <p>
                一個舒服的家，不需要過度裝飾。Furniro
                透過安靜的色彩、觸感明確的材質，
                以及簡單俐落的家具輪廓，讓空間看起來更乾淨，也讓生活更容易被好好安放。
              </p>

              <ul>
                <li>中性色系，降低搭配難度</li>
                <li>適合日常生活的家具比例</li>
                <li>保留材質紋理，增加空間層次</li>
              </ul>
            </div>

            <div className="about-material__image">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                alt="柔和色調的臥室空間"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <div className="about-cta__inner">
            <h2>開始打造你理想中的居家空間</h2>
            <p>
              探索 Furniro
              的家具選品，找到適合你的風格、生活節奏與空間需求的單品。
            </p>
            <Link to="/shop">前往商品列表</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
