import { Link } from "react-router-dom";
import {
  MdInventory2,
  MdPeople,
  MdReceiptLong,
  MdAttachMoney,
  MdArrowForward,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { useGetProductsQuery } from "../../features/productsApi";
import { useGetUsersQuery } from "../../features/usersApi";
import { useGetTransactionsQuery } from "../../features/transactionApi";
import Spinner from "../../components/common/spinner/Spinner";
import "./Dashboard.scss";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const relativeTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const getBadge = (type) =>
  type === "increase"
    ? "increase"
    : type === "decrease"
      ? "decrease"
      : "initial";

const StatCard = ({ icon: Icon, label, value, sub, accent, loading }) => (
  <div className={`dash-stat dash-stat--${accent}`}>
    <div className="dash-stat__icon-wrap">
      <Icon className="dash-stat__icon" />
    </div>
    <div className="dash-stat__body">
      <p className="dash-stat__label">{label}</p>
      {loading ? (
        <div className="dash-stat__skeleton" />
      ) : (
        <p className="dash-stat__value">{value}</p>
      )}
      {sub && !loading && <p className="dash-stat__sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { data: prodData, isLoading: prodLoading } = useGetProductsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery({
    page: 1,
    limit: 5,
  });

  const products = prodData?.data || [];
  const users = usersData?.data || [];
  const transactions = txData?.data || [];
  const totalTx = txData?.pagination?.total ?? 0;

  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
  const lowStock = products
    .filter((p) => p.quantity < 10)
    .sort((a, b) => a.quantity - b.quantity);
  const outOfStock = lowStock.filter((p) => p.quantity === 0).length;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Here is where you can see all</p>
        </div>
        <p className="dashboard__date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="dashboard__stats">
        <StatCard
          icon={MdInventory2}
          label="Total Products"
          value={products.length}
          sub={`${outOfStock} out of stock`}
          accent="blue"
          loading={prodLoading}
        />
        <StatCard
          icon={MdAttachMoney}
          label="Inventory Value"
          value={fmt(totalValue)}
          sub="across all stock"
          accent="green"
          loading={prodLoading}
        />
        <StatCard
          icon={MdPeople}
          label="Registered Users"
          value={users.length}
          sub="active accounts"
          accent="purple"
          loading={usersLoading}
        />
        <StatCard
          icon={MdReceiptLong}
          label="Total Transactions"
          value={totalTx}
          sub="all time"
          accent="orange"
          loading={txLoading}
        />
      </div>

      <div className="dashboard__grid">
        <section className="dashboard__card">
          <div className="dashboard__card-header">
            <h2 className="dashboard__card-title">Recent Transactions</h2>
            <Link to="/transactions" className="dashboard__see-all">
              See all <MdArrowForward size={14} />
            </Link>
          </div>

          {txLoading ? (
            <Spinner />
          ) : transactions.length === 0 ? (
            <p className="dashboard__empty">No transactions yet.</p>
          ) : (
            <ul className="dash-tx-list">
              {transactions.map((tx) => (
                <li key={tx._id} className="dash-tx-item">
                  <div
                    className={`dash-tx-item__icon dash-tx-item__icon--${getBadge(tx.type)}`}
                  >
                    {tx.type === "increase" ? (
                      <MdTrendingUp size={16} />
                    ) : tx.type === "decrease" ? (
                      <MdTrendingDown size={16} />
                    ) : (
                      <MdInventory2 size={16} />
                    )}
                  </div>
                  <div className="dash-tx-item__body">
                    <p className="dash-tx-item__name">
                      {tx.product?.name || "—"}
                    </p>
                    <p className="dash-tx-item__meta">
                      by {tx.performedBy?.fullname || "—"}
                    </p>
                  </div>
                  <div className="dash-tx-item__right">
                    <span
                      className={`dash-tx-item__change dash-tx-item__change--${getBadge(tx.type)}`}
                    >
                      {tx.type === "increase"
                        ? `+${tx.changeAmount}`
                        : tx.type === "decrease"
                          ? `-${tx.changeAmount}`
                          : tx.changeAmount}
                    </span>
                    <span className="dash-tx-item__time">
                      {relativeTime(tx.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard__card">
          <div className="dashboard__card-header">
            <h2 className="dashboard__card-title">
              Low Stock Alerts
              {!prodLoading && lowStock.length > 0 && (
                <span className="dashboard__badge">{lowStock.length}</span>
              )}
            </h2>
            <Link to="/products" className="dashboard__see-all">
              Manage <MdArrowForward size={14} />
            </Link>
          </div>

          {prodLoading ? (
            <Spinner />
          ) : lowStock.length === 0 ? (
            <div className="dashboard__all-good">
              <MdInventory2 size={32} />
              <p>All products are well stocked!</p>
            </div>
          ) : (
            <ul className="dash-stock-list">
              {lowStock.map((p) => {
                const pct = Math.min((p.quantity / 10) * 100, 100);
                return (
                  <li key={p._id} className="dash-stock-item">
                    <div className="dash-stock-item__top">
                      <span className="dash-stock-item__name">{p.name}</span>
                      <span
                        className={`dash-stock-item__qty ${
                          p.quantity === 0
                            ? "dash-stock-item__qty--out"
                            : "dash-stock-item__qty--low"
                        }`}
                      >
                        {p.quantity === 0
                          ? "Out of stock"
                          : `${p.quantity} left`}
                      </span>
                    </div>
                    <div className="dash-stock-item__bar-track">
                      <div
                        className={`dash-stock-item__bar-fill ${
                          p.quantity === 0
                            ? "dash-stock-item__bar-fill--out"
                            : "dash-stock-item__bar-fill--low"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="dash-stock-item__sku">{p.sku}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
