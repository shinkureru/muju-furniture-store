import { Link } from "react-router-dom";

function RoomInspiration() {
  return (
    <section className="room-section no-select">
      <div className="site-container">
        <div className="room-layout">
          <div className="room-copy">
            <h2>
              50+ 種居家靈感，
              <br />
              找到你的理想空間
            </h2>
            <p>
              從臥室、客廳到閱讀角落，我們整理多種家具配置靈感，
              幫助你打造更舒適、更有層次的生活場景。
            </p>
            <Link to="/shop" className="btn btn-primary-custom">
              探索家具靈感
            </Link>
          </div>

          <div className="room-gallery">
            <div className="room-main">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop"
                alt="安靜臥室空間"
              />
              <div className="room-label">
                <span>01 — 臥室空間</span>
                <strong>靜謐日常</strong>
              </div>
            </div>

            <div className="room-side">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop"
                alt="客廳家具靈感"
              />
              <button className="slide-btn">›</button>
              <div className="dots">
                <span className="active"></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoomInspiration;
