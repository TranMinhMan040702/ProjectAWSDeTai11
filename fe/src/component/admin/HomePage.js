import React from "react";
import $ from "jquery";
import Axios from "axios";
export default function HomePage() {
  const selectAll = () => {
    return $("#selectAll").prop("checked")
      ? $(".checkItem").prop("checked", true)
      : $(".checkItem").prop("checked", false);
  };
  const selectItem = () => {
    $('input[id*="selectItem"]:checked').length == 2 //tam thoi
      ? $("#selectAll").prop("checked", true)
      : $("#selectAll").prop("checked", false);
  };
  const [listUser, setListUser] = React.useState([]);
  const [setId, setSetId] = React.useState("");

  React.useEffect(() => {
    const GETALLUSER = process.env.REACT_APP_GETALLUSER;
    Axios.get(GETALLUSER).then((rs) => setListUser(rs.data));
  }, []);
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  return (
    <>
      <header className="bg-info">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse flex-row-reverse"
              id="collapse"
            >
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
                      <span className="me-2">Undefined</span>
                    )}
                    <div
                      className="bg-success rounded-5"
                      style={{ margin: "auto 0" }}
                    >
                      <i className="fa-solid fa-user fs-4 p-3"></i>
                    </div>
                  </button>
                  <ul className="dropdown-menu w-100">
                    <li>
                      <a className="dropdown-item" href="/me/manager-info">
                        Quản lý thông tin cá nhân
                      </a>
                    </li>

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
      <div>
        <div class="container-xl">
          <div class="table-responsive">
            <div class="table-wrapper">
              <div class="table-title">
                <div class="row">
                  <div class="col-sm-6">
                    <h2>QUẢN LÝ NHÂN VIÊN</h2>
                  </div>
                  <div class="col-sm-6">
                    <a
                      href="#addEmployeeModal"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#addEmployeeModal"
                    >
                      <i class="material-icons">&#xE147;</i>{" "}
                      <span>Thêm mới</span>
                    </a>
                    <a
                      href="#deleteEmployeeModal"
                      class="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteEmployeeModal"
                    >
                      <i class="material-icons">&#xE15C;</i>
                      <span>Xoá nhiều</span>
                    </a>
                  </div>
                </div>
              </div>
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>
                      <span class="custom-checkbox">
                        <input
                          type="checkbox"
                          id="selectAll"
                          onChange={(e) => selectAll()}
                        ></input>
                        <label></label>
                      </span>
                    </th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {listUser.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          <span class="custom-checkbox">
                            <input
                              type="checkbox"
                              className="checkItem"
                              id="selectItem-1"
                              onChange={(e) => selectItem()}
                            ></input>
                            <label for="checkbox1"></label>
                          </span>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.address}</td>
                        <td>{item.phone}</td>
                        <td>
                          <a
                            href="#editEmployeeModal"
                            class="edit"
                            data-bs-toggle="modal"
                            data-bs-target="#editEmployeeModal"
                            onClick={(e) => setId(item.id)}
                          >
                            <i
                              class="material-icons"
                              data-toggle="tooltip"
                              title="Edit"
                            >
                              &#xE254;
                            </i>
                          </a>
                          <a
                            href="#deleteEmployeeModal"
                            class="delete"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteEmployeeModal"
                            onClick={(e) => setId(item.id)}
                          >
                            <i
                              class="material-icons"
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              &#xE872;
                            </i>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <!-- Add Modal HTML --> */}
        <div id="addEmployeeModal" class="modal fade">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Thêm sinh viên mới</h4>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input type="text" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <input type="text" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" required></input>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button type="submit" class="btn btn-success">
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Edit Modal HTML --> */}
        <div
          class="modal fade"
          id="editEmployeeModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Chỉnh sửa thông tin
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input type="text" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <input type="text" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" required></input>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button type="submit" class="btn btn-success">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Delete Modal HTML --> */}
        <div id="deleteEmployeeModal" class="modal fade">
          <div class="modal-dialog">
            <div class="modal-content">
              <form>
                <div class="modal-header">
                  <h4 class="modal-title">Xoá thông tin sinh viên</h4>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>Bạn có chắn chắc muốn xoá không?</p>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button type="button" class="btn btn-danger">
                    Xoá
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
