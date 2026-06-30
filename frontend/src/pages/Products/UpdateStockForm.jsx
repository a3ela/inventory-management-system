import { useState } from "react";
import { useUpdateStockMutation } from "../../features/productsApi";
import { useGetUsersQuery } from "../../features/usersApi";
import "./ProductForm.scss";

const UpdateStockForm = ({ product, onClose }) => {
  const [form, setForm] = useState({
    type: "increase",
    amount: "",
    performedBy: "",
  });
  const [error, setError] = useState("");

  const { data: usersData } = useGetUsersQuery();
  const [updateStock, { isLoading }] = useUpdateStockMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock({
        id: product._id,
        type: form.type,
        amount: parseInt(form.amount),
        performedBy: form.performedBy,
      }).unwrap();
      onClose();
    } catch (err) {
      setError(err.data?.message || "Failed to update stock");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="product-form__info-box">
        <p>{product.name}</p>
        <p>
          SKU: {product.sku} · Current stock:{" "}
          <strong>{product.quantity}</strong>
        </p>
      </div>

      {error && <p className="product-form__error">{error}</p>}

      <div className="product-form__field">
        <label className="product-form__label">Type</label>
        <div className="product-form__type-toggle">
          {["increase", "decrease"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: t }))}
              className={`product-form__type-btn ${
                form.type === t ? `product-form__type-btn--${t}-active` : ""
              }`}
            >
              {t === "increase" ? "+ Increase" : "− Decrease"}
            </button>
          ))}
        </div>
      </div>

      <div className="product-form__field">
        <label className="product-form__label">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min="1"
          required
          placeholder="Enter quantity"
          className="product-form__input"
        />
      </div>

      <div className="product-form__field">
        <label className="product-form__label">Performed By</label>
        <select
          name="performedBy"
          value={form.performedBy}
          onChange={handleChange}
          required
          className="product-form__select"
        >
          <option value="">Select a user</option>
          {usersData?.data?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullname} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="product-form__actions">
        <button
          type="button"
          onClick={onClose}
          className="product-form__cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`product-form__submit-btn product-form__submit-btn--${form.type}`}
        >
          {isLoading ? "Updating..." : "Update Stock"}
        </button>
      </div>
    </form>
  );
};

export default UpdateStockForm;
