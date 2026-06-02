import { BsGeoAlt, BsEnvelope, BsTelephone } from "react-icons/bs";

function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="site-container">
          <div className="contact-hero__content">
            <span className="contact-hero__label">聯絡我們</span>
            <h1>讓我們一起打造更舒適的居家空間。</h1>
            <p>
              無論你想詢問商品、空間搭配建議，或需要訂單協助，都可以透過下方表單與我們聯繫。
            </p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="site-container">
          <div className="contact-layout">
            <div className="contact-info">
              <span className="contact-info__tag">Furniro Support</span>
              <h2>有任何問題，歡迎留下訊息。</h2>
              <p>
                我們會依照你的需求提供商品建議、訂單協助與居家搭配方向，讓選購家具變得更簡單。
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-item__icon">
                    <BsGeoAlt />
                  </div>
                  <div>
                    <h3>門市地址</h3>
                    <p>台中市北區 Furniro 生活選品館</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-item__icon">
                    <BsTelephone />
                  </div>
                  <div>
                    <h3>客服電話</h3>
                    <p>04-1234-5678</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-item__icon">
                    <BsEnvelope />
                  </div>
                  <div>
                    <h3>電子信箱</h3>
                    <p>service@furniro.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form">
              <div className="contact-form__row">
                <label htmlFor="name">姓名</label>
                <input id="name" type="text" placeholder="請輸入你的姓名" />
              </div>

              <div className="contact-form__row">
                <label htmlFor="email">電子信箱</label>
                <input id="email" type="email" placeholder="請輸入你的 Email" />
              </div>

              <div className="contact-form__row">
                <label htmlFor="subject">主旨</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="例如：商品詢問、訂單問題"
                />
              </div>

              <div className="contact-form__row">
                <label htmlFor="message">訊息內容</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="請簡單描述你想詢問的內容"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary-custom">
                送出訊息
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-service">
        <div className="site-container">
          <div className="contact-service__grid">
            <div className="contact-service-card">
              <h3>商品諮詢</h3>
              <p>協助你了解尺寸、材質、顏色與適合的居家搭配方式。</p>
            </div>

            <div className="contact-service-card">
              <h3>訂單協助</h3>
              <p>提供訂單狀態、配送時間與付款相關問題的協助。</p>
            </div>

            <div className="contact-service-card">
              <h3>空間建議</h3>
              <p>依照你的空間需求，提供家具配置與風格方向建議。</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
