import React from "react";
import $ from "jquery";
import Axios from "axios";
import Header from "../Header";
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
  const [currentUsername, setCurrentUsername] = React.useState("");
  const [checked, setChecked] = React.useState(true);
  const [listUser, setListUser] = React.useState([]);
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  React.useEffect(() => {
    const GETALLUSER = process.env.REACT_APP_GETALLUSER;
    Axios.get(GETALLUSER).then((rs) => setListUser(rs.data));
  }, [checked]);
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const Add = (e) => {
    e.preventDefault();
    const username = newUser.name + Math.round(1000 + Math.random() * 9000);
    const password = Math.round(10000 + Math.random() * 90000);
    const isDelete = true;
    Axios.get(
      `${process.env.REACT_APP_ADDUSER}?name=${newUser.name}&email=${newUser.email}&address=${newUser.address}&phone=${newUser.phone}&isDelete=${isDelete}&username=${username}&password=${password}`
    )
      .then((rs) => {
        setChecked((prev) => (prev = !prev));
      })
      .catch((err) => console.log(err));
  };
  const DeleteOne = (e) => {
    e.preventDefault();
    Axios.get(
      `${process.env.REACT_APP_DELETEONEUSER}?username=${currentUsername}`
    )
      .then((rs) => {
        console.log(rs);
        setChecked((prev) => (prev = !prev));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
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
                    <th>Khu vực</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {listUser &&
                    listUser.map((item) => {
                      if (item.isDelete == "true") {
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
                            <td>{item.area}</td>
                            <td>{item.username}</td>
                            <td>{item.password}</td>
                            <td>
                              <a
                                href="#editEmployeeModal"
                                class="edit"
                                data-bs-toggle="modal"
                                data-bs-target="#editEmployeeModal"
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
                                onClick={(e) =>
                                  setCurrentUsername(item.username)
                                }
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
                      }
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
                <h4 class="modal-title">Thêm nhân viên mới</h4>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={(e) => Add(e)}>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input
                      type="text"
                      class="form-control"
                      required
                      value={newUser.name}
                      name="name"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      required
                      value={newUser.email}
                      name="email"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <input
                      type="text"
                      class="form-control"
                      required
                      value={newUser.address}
                      name="address"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      class="form-control"
                      required
                      value={newUser.phone}
                      name="phone"
                      onChange={(e) => handleChange(e)}
                    ></input>
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
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                  >
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
                  <div class="mb-3">
                    <label class="form-label">Password</label>
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
              <form onSubmit={(e) => DeleteOne(e)}>
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
                  <button
                    type="submit"
                    class="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
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
