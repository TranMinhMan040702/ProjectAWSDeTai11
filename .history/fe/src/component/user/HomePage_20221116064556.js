import React from "react";
import Header from "../Header";
import $ from "jquery";
import { v4 as uuid } from "uuid";
import Axios from "axios";

export default function HomePage() {
    return (
        <>
            <Header />
            <div>
                <div class="container-xl">
                    <div class="table-responsive">
                        <label htmlFor="">Chọn khu vực:</label>
                        <select
                            className="form-control w-25 mb-3"
                            onChange={(e) => {
                                setCurrentArea({
                                    id: e.target.value,
                                    nameArea: e.target.selectedOptions[0].label,
                                });
                            }}
                        >
                            {listAreas.map((item) => {
                                if (item.isDeleted == "false") {
                                    return (
                                        <option value={item.id}>
                                            {item.nameArea}
                                        </option>
                                    );
                                }
                            })}
                        </select>
                        <div class="table-wrapper">
                            <div class="table-title">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <h2>{`QUẢN LÝ NHÂN VIÊN QUẢN LÝ (${currentArea.nameArea
                                            .toString()
                                            .toLocaleUpperCase()})`}</h2>
                                    </div>
                                    <div class="col-sm-6">
                                        <a
                                            href="#addEmployeeModal"
                                            class="btn btn-success"
                                            data-bs-toggle="modal"
                                            data-bs-target="#addEmployeeModal"
                                        >
                                            <i class="material-icons">
                                                &#xE147;
                                            </i>{" "}
                                            <span>Thêm mới</span>
                                        </a>
                                        <a
                                            href="#deleteEmployeeModal"
                                            class="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteEmployeeModal"
                                            onClick={(e) => {
                                                setState("deleteMany");
                                                setTitleModal({
                                                    main: "Xoá nhân viên",
                                                    sub: "Tất cả các nhân viên bạn chọn sẽ bị xoá?",
                                                });
                                            }}
                                        >
                                            <i class="material-icons">
                                                &#xE15C;
                                            </i>
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
                                                    onChange={(e) =>
                                                        selectAll()
                                                    }
                                                ></input>
                                                <label></label>
                                            </span>
                                        </th>
                                        <th>Họ và tên</th>
                                        <th>Email</th>
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser &&
                                        listUser.map((item) => {
                                            if (
                                                item.isDelete == "false" &&
                                                item.area == currentArea.id
                                            ) {
                                                return (
                                                    <tr key={item.username}>
                                                        <td>
                                                            <span class="custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkItem"
                                                                    id="selectItem-1"
                                                                    value={
                                                                        item.username
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        selectItem()
                                                                    }
                                                                ></input>
                                                                <label for="checkbox1"></label>
                                                            </span>
                                                        </td>
                                                        <td>{item.nameUser}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.username}</td>
                                                        <td>{item.password}</td>
                                                        <td>
                                                            <a
                                                                href="#editEmployeeModal"
                                                                class="edit"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editEmployeeModal"
                                                                onClick={(e) =>
                                                                    ClickPencil(
                                                                        item.username,
                                                                        item.area
                                                                    )
                                                                }
                                                            >
                                                                <i
                                                                    class="material-icons"
                                                                    data-toggle="tooltip"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    &#xE254;
                                                                </i>
                                                            </a>
                                                            <a
                                                                href="#deleteEmployeeModal"
                                                                class="delete"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteEmployeeModal"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    setState(
                                                                        "deleteOneAvailable"
                                                                    );
                                                                    setCurrentUsername(
                                                                        item.username
                                                                    );
                                                                    setTitleModal(
                                                                        {
                                                                            main: "Xoá nhân viên",
                                                                            sub: "Bạn có chắc chắn xoá nhân viên này không?",
                                                                        }
                                                                    );
                                                                }}
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
                        {tableDelete == false ? (
                            <button
                                type="button"
                                class="btn btn-success w-100 my-4"
                                onClick={(e) =>
                                    setTableDelete((prev) => (prev = !prev))
                                }
                            >
                                Xem các khu vực đã bị xoá
                            </button>
                        ) : (
                            <button
                                type="button"
                                class="btn btn-secondary w-100 my-4"
                                onClick={(e) =>
                                    setTableDelete((prev) => (prev = !prev))
                                }
                            >
                                Đóng
                            </button>
                        )}
                        {tableDelete && (
                            <div class="table-wrapper">
                                <div class="table-title">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <h2>CÁC KHU VỰC ĐÃ BỊ XOÁ</h2>
                                        </div>
                                    </div>
                                </div>
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Họ và tên</th>
                                            <th>Email</th>
                                            <th>Địa chỉ</th>
                                            <th>Số điện thoại</th>
                                            <th>Username</th>
                                            <th>Password</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listUser &&
                                            listUser.map((item) => {
                                                if (
                                                    item.isDelete == "true" &&
                                                    item.area == currentArea.id
                                                ) {
                                                    return (
                                                        <tr key={item.username}>
                                                            <td>
                                                                {item.nameUser}
                                                            </td>
                                                            <td>
                                                                {item.email}
                                                            </td>
                                                            <td>
                                                                {item.address}
                                                            </td>
                                                            <td>
                                                                {item.phone}
                                                            </td>
                                                            <td>
                                                                {item.username}
                                                            </td>
                                                            <td>
                                                                {item.password}
                                                            </td>
                                                            <td>
                                                                <a
                                                                    href="#deleteEmployeeModal"
                                                                    class="delete"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#deleteEmployeeModal"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        setState(
                                                                            "deleteOneUnavailable"
                                                                        );
                                                                        setCurrentUsername(
                                                                            item.username
                                                                        );
                                                                        setTitleModal(
                                                                            {
                                                                                main: "Xoá nhân viên",
                                                                                sub: "Nhân viên được chọn sẽ bị xoá vĩnh viễn?",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                        data-toggle="tooltip"
                                                                        title="Xoá vĩnh viễn"
                                                                    >
                                                                        &#xE872;
                                                                    </i>
                                                                </a>
                                                                <a
                                                                    href="#deleteEmployeeModal"
                                                                    class="delete"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#deleteEmployeeModal"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        setCurrentUsername(
                                                                            item.username
                                                                        );
                                                                        setState(
                                                                            "restore"
                                                                        );
                                                                        setTitleModal(
                                                                            {
                                                                                main: "Khôi phục nhân viên",
                                                                                sub: "Bạn chắc chắn muốn khôi phục nhân viên này?",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                        data-toggle="tooltip"
                                                                        title="Khôi phục"
                                                                    >
                                                                        &#xe929;
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
                        )}
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
                                        <label class="form-label">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            value={newUser.nameUser}
                                            name="nameUser"
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
                                        <label class="form-label">
                                            Địa chỉ
                                        </label>
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
                                        <label class="form-label">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            class="form-control"
                                            required
                                            value={newUser.phone}
                                            name="phone"
                                            onChange={(e) => handleChange(e)}
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Chọn khu vực:
                                        </label>
                                        <select
                                            className="form-control"
                                            name="area"
                                            onChange={(e) => handleChange(e)}
                                            required
                                        >
                                            <option value="">Choose...</option>
                                            {listAreas &&
                                                listAreas.map((item) => {
                                                    if (
                                                        item.isDeleted ==
                                                        "false"
                                                    )
                                                        return (
                                                            <option
                                                                value={item.id}
                                                            >
                                                                {item.nameArea}
                                                            </option>
                                                        );
                                                })}
                                        </select>
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
                                <h1
                                    class="modal-title fs-5"
                                    id="exampleModalLabel"
                                >
                                    Chỉnh sửa thông tin
                                </h1>
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={(e) => Update(e)}>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            value={newUser.nameUser}
                                            name="nameUser"
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
                                        <label class="form-label">
                                            Địa chỉ
                                        </label>
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
                                        <label class="form-label">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            class="form-control"
                                            required
                                            value={newUser.phone}
                                            name="phone"
                                            onChange={(e) => handleChange(e)}
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="tel"
                                            class="form-control"
                                            required
                                            value={newUser.password}
                                            name="password"
                                            onChange={(e) => handleChange(e)}
                                        ></input>
                                    </div>
                                    <div className="mb-3">
                                        <label class="form-label">
                                            Chọn khu vực
                                        </label>
                                        <select
                                            id="select-area-edit-form"
                                            className="form-control"
                                            required
                                            onChange={(e) => {
                                                setNewUser({
                                                    ...newUser,
                                                    area: e.target.value,
                                                });
                                            }}
                                        >
                                            {listAreas.map((item) => {
                                                if (item.isDeleted == "false") {
                                                    return (
                                                        <option value={item.id}>
                                                            {item.nameArea}
                                                        </option>
                                                    );
                                                }
                                            })}
                                        </select>
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
                            <form onSubmit={(e) => Delete(e)}>
                                <div class="modal-header">
                                    <h4 class="modal-title">
                                        {titleModal.main}
                                    </h4>
                                    <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div class="modal-body">
                                    <p>{titleModal.sub}</p>
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
                                        {state == "restore"
                                            ? "Khôi phục"
                                            : "Xoá"}
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
