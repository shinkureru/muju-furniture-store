const FAVORITE_KEY = "mujuFavoriteProductIds"; // 收藏資料的 key
// 之後瀏覽器會存成：
// mujuFavoriteProductIds = ["商品id1", "商品id2"]

export const FAVORITE_CHANGE_EVENT = "mujuFavoriteChange";
// 這是一個事件名稱，其他元件就能監聽

// 這段是從 localStorage 讀收藏資料
export const getFavoriteProductIds = () => {
  const rawData = localStorage.getItem(FAVORITE_KEY);
  // 從 localStorage 取出資料

  if (!rawData) {
    return []; // 如果之前完全沒有收藏過商品，就回傳空陣列
  }

  try {
    return JSON.parse(rawData);
  } catch (error) {
    console.error("收藏資料解析失敗：", error);
    return [];
  }
  // 這是防呆。如果 localStorage 裡的資料壞掉，例如使用者自己亂改 DevTools：mujuFavoriteProductIds = abc
  // 那 JSON.parse 會爆炸。 所以用 try...catch 包起來，壞掉就回傳空陣列。
};

// 這段是把收藏 id 陣列存回 localStorage
export const saveFavoriteProductIds = (favoriteIds) => {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteIds));
  // 把陣列轉成字串。因為 localStorage 只能存字串
};

export const notifyFavoriteChange = () => {
  window.dispatchEvent(new Event(FAVORITE_CHANGE_EVENT));
};
// 意思是：對整個瀏覽器視窗發出一個事件：收藏資料改變了
// 這樣 Header、MemberPage 就可以監聽這個事件

// 判斷某商品是否已收藏
export const isFavoriteProduct = (productId) => {
  const favoriteIds = getFavoriteProductIds();

  return favoriteIds.includes(productId);
};
// 這段會回傳：true  → 已收藏  false → 未收藏

// 切換收藏狀態
export const toggleFavoriteProduct = (productId) => {
  // 如果已收藏 → 取消收藏，如果未收藏 → 加入收藏
  const favoriteIds = getFavoriteProductIds();

  const isFavorite = favoriteIds.includes(productId);
  // 先取得目前收藏清單，再判斷這個商品是否已存在

  if (isFavorite) {
    // 已收藏 → 移除
    const nextFavoriteIds = favoriteIds.filter((id) => id !== productId);

    saveFavoriteProductIds(nextFavoriteIds);

    notifyFavoriteChange();
    // 事件通知出去後，其他元件會立刻重新讀 localStorage

    return nextFavoriteIds;
  }
  // 這段意思是：留下所有不是這個 productId 的 id

  // 未收藏 → 加入
  const nextFavoriteIds = [...favoriteIds, productId];

  saveFavoriteProductIds(nextFavoriteIds);

  notifyFavoriteChange();
  // 事件通知出去後，其他元件會立刻重新讀 localStorage

  return nextFavoriteIds;
};
// 這段是把新商品 id 加進收藏清單
