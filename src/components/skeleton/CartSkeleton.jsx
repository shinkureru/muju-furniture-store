const SkeletonRow = () => {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          <div className="skeleton skeleton-image"></div>

          <div>
            <div className="skeleton skeleton-text skeleton-text--lg"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </td>

      <td>
        <div className="d-flex justify-content-center">
          <div className="skeleton skeleton-button"></div>
        </div>
      </td>

      <td>
        <div className="d-flex justify-content-end">
          <div className="skeleton skeleton-price"></div>
        </div>
      </td>

      <td>
        <div className="d-flex justify-content-end">
          <div className="skeleton skeleton-icon"></div>
        </div>
      </td>
    </tr>
  );
};

const CartSummarySkeleton = () => {
  return (
    <div className="border rounded-4 p-4">
      <div className="skeleton skeleton-text skeleton-text--lg mb-4"></div>

      <div className="d-flex justify-content-between mb-3">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-price"></div>
      </div>

      <div className="border-top pt-3 mt-3">
        <div className="d-flex justify-content-between mb-4">
          <div className="skeleton skeleton-text skeleton-text--lg"></div>
          <div className="skeleton skeleton-price skeleton-price--lg"></div>
        </div>

        <div className="skeleton skeleton-checkout-button"></div>
      </div>
    </div>
  );
};

const CartSkeleton = () => {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>商品</th>
                <th className="text-center">數量</th>
                <th className="text-end">小計</th>
                <th className="text-end">操作</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-lg-4">
        <CartSummarySkeleton />
      </div>
    </div>
  );
};

export default CartSkeleton;
