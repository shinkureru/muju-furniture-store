function LoadingOverlay({
  isLoading,
  variant = "section",
  text = "資料載入中...",
  // 這是一個 Loading 元件
  // 它接收三個 props：
  // isLoading → 是否顯示 loading
  // variant → loading 類型，預設是 section
  // text → 顯示的文字
}) {
  if (!isLoading) return null;
  // 意思是：
  // 如果 isLoading 是 false → 這個元件什麼都不渲染
  // React 裡面 return null 代表畫面上不顯示任何東西
  // 所以不用在外面寫：
  // {isLoading && <LoadingOverlay />}
  // 因為元件自己會判斷。

  return (
    <div className={`loading-overlay loading-overlay--${variant}`}>
      {/* 這裡用了 template string
      如果：variant = "section"
      class 會變成：loading-overlay loading-overlay--section
      如果之後用：variant = "fullscreen"
      class 會變成：loading-overlay loading-overlay--fullscreen
      這樣我們同一個元件，可以支援不同尺寸的 loading */}

      <div className="loading-overlay__panel">
        {/* 這是中間那個 loading 盒子。裡面會放 spinner 和文字。 */}
        <div className="loading-overlay__spinner" />
        {/* 這是轉圈圈。 */}
        <p>{text}</p>
        {/* 顯示 loading 文字。例如你可以傳：text="商品載入中..."
        它就會顯示商品載入中。 */}
      </div>
    </div>
  );
}

export default LoadingOverlay;
