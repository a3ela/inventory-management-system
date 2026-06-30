import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useGetProductsQuery } from "../../features/productsApi";
import Modal from "../../components/common/modal/modal";
import Spinner from "../../components/common/spinner/Spinner";
import AddProductForm from "./AddProductForm";
import UpdateStockForm from "./UpdateStockForm";
import "./Products.scss";

const Products = () => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = data?.data || [];

  const getBadgeModifier = (qty) => {
    if (qty === 0) return "out";
    if (qty < 10) return "low";
    return "ok";
  };

  return (
    <div className="products">
      <div className="products__header">
        <div>
          <h1 className="products__title">Products</h1>
          <p className="products__subtitle">Manage your product inventory</p>
        </div>
        <button
          className="products__add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <MdAdd size={18} />
          Add Product
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="products__error">
          Failed to load products. Is the server running?
        </p>
      ) : products.length === 0 ? (
        <div className="products__empty">
          <p className="products__empty-title">No products yet</p>
          <p className="products__empty-sub">
            Click "Add Product" to get started
          </p>
        </div>
      ) : (
        <div className="products__table-wrap">
          <table className="products__table">
            <thead className="products__thead">
              <tr>
                {[
                  "SKU",
                  "Name",
                  "Price",
                  "Quantity",
                  "Created By",
                  "Last Updated",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="products__tbody">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="products__sku">{product.sku}</td>
                  <td className="products__name">{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`products__badge products__badge--${getBadgeModifier(product.quantity)}`}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td>{product.createdBy?.fullname || "—"}</td>
                  <td>{new Date(product.updatedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="products__stock-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <AddProductForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Update Stock"
      >
        {selectedProduct && (
          <UpdateStockForm
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Products;
