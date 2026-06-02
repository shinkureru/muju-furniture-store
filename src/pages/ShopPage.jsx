import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
// React Router 用來讀取網址 query string 的工具
import ShopHero from "../components/shop/ShopHero";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import Pagination from "../components/shop/Pagination";
// import { initialProducts } from "../data/products";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { getProducts } from "../api/productApi";

function ShopPage() {
  const PAGE_SIZE = 12;
  // 代表每頁顯示 12 筆商品。
  // 之後如果你想一頁 8 筆，只要改這裡。

  const [searchParams, setSearchParams] = useSearchParams();
  // searchParams → 讀取網址 query string
  // setSearchParams → 修改網址 query string

  const [products, setProducts] = useState([]); // 存 API 商品資料
  const [isLoading, setIsLoading] = useState(false); // 控制載入狀態
  const [errorMessage, setErrorMessage] = useState(""); // 存錯誤訊息

  const [currentPage, setCurrentPage] = useState(1);
  // 代表目前在第幾頁
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    category: "全部",
    price: "全部",
    color: "全部",
    material: "全部",
    sort: "推薦排序",
  });

  const keyword = searchParams.get("keyword")?.trim() || "";
  // 從網址裡面拿到keyword，如果keyword存在，就去掉前後空白，如果不存在keyword，就讓他變成空字串

  // 把文字標準化
  const normalizeText = (value = "") => {
    return String(value).trim().toLowerCase();
  };
  // String(value) 確保傳進來的東西一定變成字串。
  // 如果傳進來是數字、null、undefined，也不容易炸
  // .toLowerCase() 英文轉小寫，讓搜尋不分大小寫

  // 把一個商品中可搜尋的欄位合併成一段文字

  const getProductSearchText = (product) => {
    return (
      [
        product.title,
        product.category,
        product.description,
        product.content,
        product.color,
        product.material,
      ]
        .filter(Boolean) // 把空值濾掉
        // 避免有些商品沒有 content 或 material 時，組字串出現奇怪的 undefined
        .join(" ") // 把欄位用空白接起來
    );
  };
  // 例如商品：
  // {
  //   title: "雲朵三人布沙發",
  //   category: "沙發",
  //   description: "米白系外觀搭配俐落線條",
  //   color: "米白",
  //   material: "布料"
  // }
  // 會組成：雲朵三人布沙發 沙發 米白系外觀搭配俐落線條 米白 布料
  // 之後只要搜尋字有出現在這段文字裡，就算符合

  const fetchProducts = async () => {
    try {
      //嘗試執行 API 請求。
      setIsLoading(true); // 開始載入，之後可以顯示「商品載入中」
      setErrorMessage("");

      // await new Promise((resolve) => setTimeout(resolve, 1200));
      // 這是故意等 1.2 秒。
      // 只是為了讓你看 loading 效果。
      // 測完後可以刪掉。不要留在正式專案

      const data = await getProducts(); // 呼叫 API 函式

      setProducts(data); // 把 API 回來的商品陣列存進 React state，而且這行一執行，React 會重新 render 畫面
    } catch (error) {
      // 如果 API 壞掉、網址錯、網路錯，就會進這裡
      setErrorMessage("商品資料載入失敗");
      console.log(error);
    } finally {
      //不管成功或失敗
      setIsLoading(false); // 最後都會關掉 loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  // ShopPage 第一次出現在畫面上
  // → 自動執行 fetchProducts
  // → 打 API
  // → setProducts
  // → 商品顯示出來

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, keyword]);
  // 篩選條件改變時回到第 1 頁
  // 只要 filters 改變，就執行

  const handleClearKeyWord = () => {
    setSearchParams({}); // 把網址 query string 清空
  };
  // 例如原本：/shop?keyword=沙發
  // 會變成  ：/shop
  // 這樣 keyword 會回到空字串，商品列表也會恢復全部

  const filteredProducts = useMemo(() => {
    // let result = initialProducts.filter((product) => product.isPublished);
    let result = products.filter((product) => product.is_enabled === 1);

    const normalizedKeyword = normalizeText(keyword);
    // 把網址上的搜尋字標準化

    if (normalizedKeyword) {
      result = result.filter((product) => {
        // 如果有搜尋字，才進行搜尋。
        // 如果沒有搜尋字，就不影響商品列表
        const searchText = normalizeText(getProductSearchText(product)); // 把每一筆商品的搜尋文字組起來並標準化

        return searchText.includes(normalizedKeyword);
        // 只要商品文字裡包含搜尋字，就留下
      });
    }
    // 例如搜尋：沙發
    // 商品文字是：雲朵三人布沙發 沙發 米白 布料
    // 就符合

    if (filters.category !== "全部") {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    if (filters.color !== "全部") {
      result = result.filter((product) => product.color === filters.color);
    }

    if (filters.material !== "全部") {
      result = result.filter(
        (product) => product.material === filters.material,
      );
    }

    if (filters.price === "NT$ 1,000 以下") {
      result = result.filter((product) => product.price <= 1000);
    }

    if (filters.price === "NT$ 1,001 - 5,000") {
      result = result.filter(
        (product) => product.price >= 1001 && product.price <= 5000,
      );
    }

    if (filters.price === "NT$ 5,001 以上") {
      result = result.filter((product) => product.price >= 5001);
    }

    if (filters.sort === "價格由低到高") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "價格由高到低") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (filters.sort === "最新上架") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    if (filters.sort === "推薦排序") {
      result = [...result].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
      );
    }

    return result;
  }, [products, filters, keyword]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  // 假設篩選後有 30 筆商品，每頁 12 筆：
  // 30 / 12 = 2.5
  // Math.ceil(2.5) = 3
  // 所以總共有 3 頁。

  // Math.ceil 是無條件進位。因為剩下 6 筆也要一頁，不能丟掉。

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  // 這是目前頁面要從第幾筆開始切
  // 如果：urrentPage = 1 計算：(1 - 1) * 12 = 0
  // 第 1 頁從第 0 筆開始。
  // 如果：currentPage = 2 計算：(2 - 1) * 12 = 12
  // 第 2 頁從第 12 筆開始。
  // 如果：currentPage = 3 計算：(3 - 1) * 12 = 24
  // 第 3 頁從第 24 筆開始。

  const currentPageProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );
  // 切出目前頁商品，假設目前第 2 頁：
  // startIndex = 12
  // PAGE_SIZE = 12
  // 那就是：ilteredProducts.slice(12, 24)，拿第 12 到第 23 筆，共 12 筆

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  // 如果目前頁數大於總頁數，就把目前頁數修正成最後一頁。這是防呆，避免畫面顯示空資料

  return (
    <>
      <ShopHero />

      <ShopToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={filters}
        setFilters={setFilters}
        products={products}
        resultCount={filteredProducts.length}
      />

      {keyword && ( // 只有有搜尋字時才顯示
        <div className="shop-search-summary">
          <div className="site-container">
            <div className="alert alert-light border rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-0">
              <div>
                <strong>搜尋結果：</strong>
                <span>「{keyword}」</span>
                <span className="text-secondary ms-2">
                  共 {filteredProducts.length} 件商品
                </span>
                {/* 顯示搜尋後又套用篩選後的商品數量 */}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={handleClearKeyWord}
              >
                清除搜尋
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="shop-products-area">
        {/* 我們用一個區塊包住商品列表、loading、錯誤訊息、分頁。
        為什麼要包？因為 LoadingOverlay 要蓋在這個區塊上面。
        如果沒有外層容器，它不知道要覆蓋哪裡。 */}
        <LoadingOverlay
          isLoading={isLoading}
          variant="section"
          text="商品載入中..."
        />

        {errorMessage && (
          // 如果有錯誤訊息，就顯示錯誤區塊
          <div className="site-container">
            <div className="alert alert-danger rounded-4 my-5" role="alert">
              {errorMessage}
            </div>
          </div>
        )}

        {!errorMessage && filteredProducts.length > 0 && (
          <ShopProductGrid viewMode={viewMode} products={currentPageProducts} />
        )}

        {!errorMessage && !isLoading && filteredProducts.length === 0 && (
          <div className="site-container">
            <div className="shop-empty-state">
              <i className="bi bi-search"></i>
              <h2>找不到符合條件的商品</h2>
              <p>請嘗試其他關鍵字，或清除搜尋與篩選條件。</p>

              {keyword && (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleClearKeyWord}
                >
                  清除搜尋
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && totalPages > 1 && (
          <Pagination
            currentPage={currentPage} // 告訴 Pagination：現在第幾頁
            totalPages={totalPages} // 告訴 Pagination：總共有幾頁
            onPageChange={setCurrentPage} // Pagination 點頁碼時，呼叫 setCurrentPage 更新目前頁數
          />
        )}
        {/* loading 的時候，商品區塊仍然存在，只是被 overlay 蓋住。這樣畫面比較穩，不會一載入就整塊跳掉。 */}
      </section>
    </>
  );
}

export default ShopPage;
