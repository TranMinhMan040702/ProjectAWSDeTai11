/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import $ from "jquery";
import Axios from "axios";
import { v4 as uuid } from "uuid";
import Header from "../Header";
import RemoveVietnameseTones from "../../utils/RemoveVietnameseTones";
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
    const [state, setState] = React.useState("");
    const [titleModal, setTitleModal] = React.useState({
        main: "",
        sub: "",
    });
    const [currentArea, setCurrentArea] = React.useState({
        id: "",
        nameArea: "",
    });
    const [currentUsername, setCurrentUsername] = React.useState(
        localStorage.getItem("username")
    );
    const [currentEmployeeId, setCurrentEmployeeId] = React.useState("");
    const [tableDelete, setTableDelete] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [listEmployee, setListEmployee] = React.useState([]);
    const [newEmployee, setNewEmployee] = React.useState({
        fullname: "",
        address: "",
        phone: "",
        area: "",
    });
    // get areaId of manager
    React.useEffect(() => {
        Axios.get(
            `${process.env.REACT_APP_GETONEUSERBYUSERNAME}?username=${currentUsername}`
        ).then((rs) => {
            setNewEmployee({ ...newEmployee, area: rs.data.area });
            setCurrentArea({ ...currentArea, id: rs.data.area });
        });
    }, []);
    // get all employee
    React.useEffect(() => {
        Axios.get(process.env.REACT_APP_GETALLEMPLOYEE).then((rs) => {
            setListEmployee(rs.data);
        });
    }, [checked]);
    // set currentArea
    React.useEffect(() => {
        Axios.get(
            `${process.env.REACT_APP_GETONEAREABYID}?id=${currentArea.id}`
        ).then((rs) => {
            console.log(rs.data);
            setCurrentArea({ ...currentArea, nameArea: rs.data.nameArea });
        });
    }, []);
    const handleChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };
    const Add = (e) => {
        e.preventDefault();
        const isDelete = false;
        const id = uuid();
        Axios.get(
            `${process.env.REACT_APP_ADDEMPLOYEE}?id=${id}&fullname=${newEmployee.fullname}&address=${newEmployee.address}&phone=${newEmployee.phone}&isDelete=${isDelete}&area=${newEmployee.area}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const Update = (e) => {
        e.preventDefault();
        console.log(newEmployee);
        Axios.get(
            `${process.env.REACT_APP_UPDATEEMPLOYEE}?id=${currentEmployeeId}&fullname=${newEmployee.fullname}&address=${newEmployee.address}&phone=${newEmployee.phone}`
        )
            .then((rs) => {
                console.log(rs.data);
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const DeleteOne = (id, state) => {
        // console.log(id);
        Axios.get(
            `${process.env.REACT_APP_DELETEONEEMPLOYEE}?id=${id}&state=${state}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const DeleteMany = () => {
        const employees = $("input[id*='selectItem']:checked");
        const arrEmployeeId = [];
        Object.values(employees).map((item) => {
            arrEmployeeId.push(item.value);
        });
        arrEmployeeId
            .filter((id) => id != undefined)
            .map((id) => {
                DeleteOne(id, true);
            });
        $("#selectAll").prop("checked", false);
    };
    const PermanentlyDelete = () => {
        Axios.get(
            `${process.env.REACT_APP_DELETEPERMANENTLYEMPLOYEE}?id=${currentEmployeeId}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const Delete = (e) => {
        e.preventDefault();
        if (state == "deleteOneAvailable") {
            DeleteOne(currentEmployeeId, true);
        } else if (state == "deleteOneUnavailable") {
            PermanentlyDelete();
        } else if (state == "restore") {
            DeleteOne(currentEmployeeId, false);
        } else {
            DeleteMany();
        }
    };
    const ClickPencil = (employeeId) => {
        setCurrentEmployeeId(employeeId);
        Axios.get(
            `${process.env.REACT_APP_GETONEEMPLOYEEBYID}?id=${employeeId}`
        ).then((rs) => {
            const employee = rs.data;
            setNewEmployee({
                fullname: employee.fullname,
                address: employee.address,
                phone: employee.phone,
            });
        });
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
                                    <div class="col-sm-8">
                                        <h2>{`QUẢN LÝ NHÂN VIÊN CỦA KHU VỰC (${currentArea.nameArea
                                            .toString()
                                            .toLocaleUpperCase()})`}</h2>
                                    </div>
                                    <div class="col-sm-4">
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
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listEmployee &&
                                        listEmployee.map((item) => {
                                            if (
                                                item.isDelete == "false" &&
                                                item.area == currentArea.id
                                            ) {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <span class="custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkItem"
                                                                    id="selectItem-1"
                                                                    value={
                                                                        item.id
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
                                                        <td>{item.fullname}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.phone}</td>
                                                        <td>
                                                            <a
                                                                href="#editEmployeeModal"
                                                                class="edit"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editEmployeeModal"
                                                                onClick={(e) =>
                                                                    ClickPencil(
                                                                        item.id
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
                                                                    setCurrentEmployeeId(
                                                                        item.id
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
                                Xem các nhân viên đã bị xoá
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
                                            <h2>CÁC NHÂN VIÊN BỊ XÓA</h2>
                                        </div>
                                    </div>
                                </div>
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Số điện thoại</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listEmployee &&
                                            listEmployee.map((item) => {
                                                if (
                                                    item.isDelete == "true" &&
                                                    item.area == currentArea.id
                                                ) {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>
                                                                {item.fullname}
                                                            </td>
                                                            <td>
                                                                {item.address}
                                                            </td>
                                                            <td>
                                                                {item.phone}
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
                                                                        setCurrentEmployeeId(
                                                                            item.id
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
                                                                        setCurrentEmployeeId(
                                                                            item.id
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
                                            value={newEmployee.fullname}
                                            name="fullname"
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
                                            value={newEmployee.address}
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
                                            value={newEmployee.phone}
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
                                            value={newEmployee.fullname}
                                            name="fullname"
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
                                            value={newEmployee.address}
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
                                            value={newEmployee.phone}
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
