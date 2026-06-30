import { useState } from "react";
import { useCreateProductMutation } from "../../features/productsApi";
import { useGetUsersQuery } from "../../features/usersApi";
import "./ProductForm.scss";

const fields = [
  { name: "sku", label: "SKU", type: "text", placeholder: "e.g. PROD-001" },
  {
    name: "name",
    label: "Product Name",
    type: "text",
    placeholder: "e.g. Wireless Mouse",
  },
  {
    name: "price",
    label: "Price ($)",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    min: "0",
  },
  {
    name: "quantity",
    label: "Initial Quantity",
    type: "number",
    placeholder: "0",
    min: "0",
  },
];

const AddProductForm = ({ onClose }) => {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    quantity: "",
    createdBy: "",
  });
  const [error, setError] = useState("");

  const { data: usersData } = useGetUsersQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      }).unwrap();
      onClose();
    } catch (err) {
      setError(err.data?.message || "Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <p className="product-form__error">{error}</p>}

      {fields.map((field) => (
        <div key={field.name} className="product-form__field">
          <label className="product-form__label">{field.label}</label>
          <input
            {...field}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            required
            className="product-form__input"
          />
        </div>
      ))}

      <div className="product-form__field">
        <label className="product-form__label">Created By</label>
        <select
          name="createdBy"
          value={form.createdBy}
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
          className="product-form__submit-btn"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
