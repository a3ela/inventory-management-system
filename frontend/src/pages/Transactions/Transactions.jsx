import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { useGetTransactionsQuery } from "../../features/transactionApi";
import Spinner from "../../components/common/spinner/Spinner";
import "./Transactions.scss";

// Returns an array like [1, '...', 4, 5, 6, '...', 20]
const getPageNumbers = (current, total) => {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
};

const Transactions = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  // Debounce: wait 400ms after typing stops before triggering the API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetTransactionsQuery({
    page,
    limit,
    search,
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination || {};

  const getBadgeModifier = (type) => {
    if (type === "increase") return "increase";
    if (type === "decrease") return "decrease";
    return "initial";
  };

  const formatChange = (type, amount) => {
    if (type === "increase") return `+${amount}`;
    if (type === "decrease") return `-${amount}`;
    return `${amount}`;
  };

  return (
    <div className="transactions">
      <div className="transactions__header">
        <div>
          <h1 className="transactions__title">Transactions</h1>
          <p className="transactions__subtitle">
            Full history of all stock changes
          </p>
        </div>
        <div className="transactions__search">
          <MdSearch className="transactions__search-icon" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="transactions__search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="transactions__error">
          Failed to load transactions. Is the server running?
        </p>
      ) : transactions.length === 0 ? (
        <div className="transactions__empty">
          <p className="transactions__empty-title">
            {search
              ? "No transactions match your search"
              : "No transactions yet"}
          </p>
          <p className="transactions__empty-sub">
            {search
              ? "Try a different search term"
              : "Stock changes will appear here"}
          </p>
        </div>
      ) : (
        <>
          <div className="transactions__table-wrap">
            <table className="transactions__table">
              <thead className="transactions__thead">
                <tr>
                  {[
                    "Product",
                    "SKU",
                    "Type",
                    "Change",
                    "Stock After",
                    "Performed By",
                    "Date",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="transactions__tbody">
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="transactions__product-name">
                      {tx.product?.name || "—"}
                    </td>
                    <td className="transactions__sku">
                      {tx.product?.sku || "—"}
                    </td>
                    <td>
                      <span
                        className={`transactions__badge transactions__badge--${getBadgeModifier(tx.type)}`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`transactions__change transactions__change--${getBadgeModifier(tx.type)}`}
                    >
                      {formatChange(tx.type, tx.changeAmount)}
                    </td>
                    <td className="transactions__qty-after">
                      {tx.quantityAfter}
                    </td>
                    <td>{tx.performedBy?.fullname || "—"}</td>
                    <td className="transactions__date">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="transactions__pagination">
              <p className="transactions__pagination-info">
                Showing {(page - 1) * limit + 1}–
                {Math.min(page * limit, pagination.total)} of {pagination.total}
              </p>
              <div className="transactions__pagination-controls">
                <button
                  className="transactions__page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                {getPageNumbers(page, pagination.totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="transactions__page-ellipsis"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`transactions__page-btn ${page === p ? "transactions__page-btn--active" : ""}`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className="transactions__page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
