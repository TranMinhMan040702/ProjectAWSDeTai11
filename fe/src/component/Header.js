/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
export default function Header(props) {
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  return (
    <header className="bg-info">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
              {localStorage.getItem("role") == "admin" ? (
                <>
                  <li className="nav-item me-3">
                    <Link className="text-white nav-link" to="/admin">
                      Trang chủ
                    </Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link className="text-white nav-link" to="/admin/area">
                      Quản lý khu vực
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item me-3">
                  <Link className="text-white nav-link" to="/user">
                    Trang chủ
                  </Link>
                </li>
              )}
            </ul>
            <div className="d-flex justify-content-center">
              <div className="dropdown-center">
                <button
                  className="d-flex align-items-center text-light border-0 bg-transparent justify-content-center "
                  style={{ minWidth: "220px" }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {localStorage.getItem("role") == "admin" ? (
                    <span className="me-2">Admin</span>
                  ) : (
                    <span className="me-2">
                      {localStorage.getItem("username")}
                    </span>
                  )}
                  <div
                    className="bg-success rounded-5"
                    style={{ margin: "auto 0" }}
                  >
                    <i className="fa-solid fa-user fs-4 p-3"></i>
                  </div>
                </button>
                <ul className="dropdown-menu w-100">
                  {localStorage.getItem("role") == "user" && (
                    <li>
                      <button className="dropdown-item ">
                        <a
                          className="dropdown-item text-dark p-0"
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal"
                        >
                          Quản lý thông tin cá nhân
                        </a>
                      </button>
                    </li>
                  )}

                  <li>
                    <button className="dropdown-item ">
                      <a
                        className="dropdown-item text-danger p-0"
                        onClick={(e) => {
                          logout(e);
                        }}
                      >
                        Đăng xuất
                      </a>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
