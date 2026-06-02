import { useEffect, useMemo, useRef, useState } from "react";
import { BsGridFill, BsList, BsChevronDown } from "react-icons/bs";

const getUniqueOptions = (products = [], key) => {
  const values = products.map((item) => item[key]).filter(Boolean);
  return ["全部", ...new Set(values)];
};

function ShopToolbar({
  viewMode,
  setViewMode,
  filters,
  setFilters,
  products = [],
  resultCount = 0,
}) {
  const [openFilter, setOpenFilter] = useState(null);
  const toolbarRef = useRef(null);

  const categoryOptions = useMemo(
    () => getUniqueOptions(products, "category"),
    [products],
  );

  const colorOptions = useMemo(
    () => getUniqueOptions(products, "color"),
    [products],
  );

  const materialOptions = useMemo(
    () => getUniqueOptions(products, "material"),
    [products],
  );

  const priceOptions = [
    "全部",
    "NT$ 1,000 以下",
    "NT$ 1,001 - 5,000",
    "NT$ 5,001 以上",
  ];

  const sortOptions = ["推薦排序", "價格由低到高", "價格由高到低", "最新上架"];

  const dropdowns = [
    {
      label: "分類",
      key: "category",
      options: categoryOptions,
    },
    {
      label: "價格",
      key: "price",
      options: priceOptions,
    },
    {
      label: "顏色",
      key: "color",
      options: colorOptions,
    },
    {
      label: "材質",
      key: "material",
      options: materialOptions,
    },
  ];

  const toggleFilter = (filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  const handleSelect = (key, option) => {
    setFilters((prev) => ({
      ...prev,
      [key]: option,
    }));

    setOpenFilter(null);
  };

  const handleResetFilters = () => {
    setFilters({
      category: "全部",
      price: "全部",
      color: "全部",
      material: "全部",
      sort: "推薦排序",
    });

    setOpenFilter(null);
  };

  const hasActiveFilter =
    filters.category !== "全部" ||
    filters.price !== "全部" ||
    filters.color !== "全部" ||
    filters.material !== "全部";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="shop-toolbar no-select" ref={toolbarRef}>
      <div className="site-container">
        <div className="shop-toolbar__inner">
          <div className="shop-toolbar__filters">
            {dropdowns.map((dropdown) => (
              <div className="filter-dropdown" key={dropdown.key}>
                <button
                  type="button"
                  onClick={() => toggleFilter(dropdown.key)}
                  className={
                    filters[dropdown.key] !== "全部" ? "has-value" : ""
                  }
                >
                  <span>
                    {dropdown.label}
                    {filters[dropdown.key] !== "全部" &&
                      `：${filters[dropdown.key]}`}
                  </span>

                  <BsChevronDown
                    className={`filter-arrow ${
                      openFilter === dropdown.key ? "is-open" : ""
                    }`}
                  />
                </button>

                {openFilter === dropdown.key && (
                  <div className="filter-dropdown__menu">
                    {dropdown.options.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          filters[dropdown.key] === option ? "is-selected" : ""
                        }
                        onClick={() => handleSelect(dropdown.key, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {hasActiveFilter && (
              <button
                type="button"
                className="filter-reset"
                onClick={handleResetFilters}
              >
                清除篩選
              </button>
            )}
          </div>

          <div className="shop-toolbar__sort">
            <span>共 {resultCount} 件商品</span>

            <div className="filter-dropdown">
              <button type="button" onClick={() => toggleFilter("sort")}>
                <span>{filters.sort}</span>

                <BsChevronDown
                  className={`filter-arrow ${
                    openFilter === "sort" ? "is-open" : ""
                  }`}
                />
              </button>

              {openFilter === "sort" && (
                <div className="filter-dropdown__menu filter-dropdown__menu--right">
                  {sortOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={filters.sort === option ? "is-selected" : ""}
                      onClick={() => handleSelect("sort", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`icon-btn ${viewMode === "grid" ? "is-active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="切換為網格顯示"
              title="切換為網格顯示"
            >
              <BsGridFill />
            </button>

            <button
              type="button"
              className={`icon-btn ${viewMode === "list" ? "is-active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="清單顯示"
              title="切換為清單顯示"
            >
              <BsList />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopToolbar;
