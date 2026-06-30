import { useState } from "react";
import { MdPersonAdd } from "react-icons/md";
import {
  useGetUsersQuery,
  useCreateUserMutation,
} from "../../features/usersApi";
import Modal from "../../components/common/modal/modal";
import Spinner from "../../components/common/spinner/Spinner";
import "./Users.scss";

const Users = () => {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "" });
  const [error, setError] = useState("");

  const users = data?.data || [];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form).unwrap();
      setForm({ fullname: "", email: "" });
      setShowModal(false);
    } catch (err) {
      setError(err.data?.message || "Failed to create user");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ fullname: "", email: "" });
    setError("");
  };

  return (
    <div className="users">
      <div className="users__header">
        <div>
          <h1 className="users__title">Users</h1>
          <p className="users__subtitle">Manage registered users</p>
        </div>
        <button className="users__add-btn" onClick={() => setShowModal(true)}>
          <MdPersonAdd size={18} />
          Add User
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="users__error">
          Failed to load users. Is the server running?
        </p>
      ) : users.length === 0 ? (
        <div className="users__empty">
          <p className="users__empty-title">No users yet</p>
          <p className="users__empty-sub">Click "Add User" to get started</p>
        </div>
      ) : (
        <div className="users__grid">
          {users.map((user) => (
            <div key={user._id} className="users__card">
              <div className="users__avatar">
                {user.fullname.charAt(0).toUpperCase()}
              </div>
              <div className="users__info">
                <p className="users__name">{user.fullname}</p>
                <p className="users__email">{user.email}</p>
              </div>
              <p className="users__date">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={handleClose} title="Add New User">
        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="user-form__error">{error}</p>}

          <div className="user-form__field">
            <label className="user-form__label">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
              className="user-form__input"
            />
          </div>

          <div className="user-form__field">
            <label className="user-form__label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              required
              className="user-form__input"
            />
          </div>

          <div className="user-form__actions">
            <button
              type="button"
              onClick={handleClose}
              className="user-form__cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="user-form__submit-btn"
            >
              {isCreating ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
