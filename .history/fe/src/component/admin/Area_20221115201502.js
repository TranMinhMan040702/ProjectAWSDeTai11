import React from "react";
import Header from "../Header";
import $ from "jquery";
import { v4 as uuid } from "uuid";
import Axios from "axios";

export default function Area() {
    const selectAll = () => {
        return $("#selectAll").prop("checked")
            ? $(".checkItem").prop("checked", true)
            : $(".checkItem").prop("checked", false);
    };
    const selectItem = () => {
        $('input[id*="selectItem"]:checked').length ==
        listAreas.filter((item) => item.isDeleted == "false").length //tam thoi
            ? $("#selectAll").prop("checked", true)
            : $("#selectAll").prop("checked", false);
    };
    const [titleModal, setTitleModal] = React.useState({
        main: "",
        sub: "",
    });
    const [tableDelete, setTableDelete] = React.useState(false);
    const [state, setState] = React.useState("");
    const [currentId, setCurrentId] = React.useState("");
    const [listUser, setListUser] = React.useState([]);
    const [listAreas, setListAreas] = React.useState([]);
    const [newArea, setNewArea] = React.useState({
        nameArea: "",
        address: "",
    });
    const [checked, setChecked] = React.useState(true);
    React.useEffect(() => {
        Axios.get(process.env.REACT_APP_GETALLAREA).then((rs) =>
            setListAreas(rs.data)
        );
    }, [checked]);
    React.useEffect(() => {
        const GETALLUSER = process.env.REACT_APP_GETALLUSER;
        Axios.get(GETALLUSER).then((rs) => setListUser(rs.data));
    }, []);

    const Add = (e) => {
        e.preventDefault();
        const id = uuid();
        const isDeleted = false;
        if (
            listAreas.filter((item) => item.nameArea == newArea.nameArea)
                .length > 0
        ) {
            alert("Khu vực này đã tồn tại");
        } else {
            Axios.get(
                `${process.env.REACT_APP_ADDAREA}?address=${newArea.address}&nameArea=${newArea.nameArea}&id=${id}&isDeleted=${isDeleted}`
            )
                .then((rs) => {
                    setChecked((prev) => (prev = !prev));
                })
                .catch((err) => console.log(err));
        }
    };

    const Update = (e) => {
        e.preventDefault();
        Axios.get(
            `${process.env.REACT_APP_UPDATEAREA}?id=${currentId}&nameArea=${newArea.nameArea}&address=${newArea.address}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const ClickPencil = (id) => {
        setCurrentId(id);
        Axios.get(`${process.env.REACT_APP_GETONEAREABYID}?id=${id}`).then(
            (rs) => {
                setNewArea({
                    nameArea: rs.data.nameArea,
                    address: rs.data.address,
                });
            }
        );
    };
    const Delete = (e) => {
        e.preventDefault();
        if (state == "deleteOneAvailable") {
            DeleteOne();
        } else if (state == "deleteOneUnavailable") {
            PermanentlyDelete();
        } else if (state == "restore") {
            DeleteOne("", false);
        } else {
            DeleteMany();
        }
    };
    const DeleteOne = (id, state) => {
        Axios.get(
            `${process.env.REACT_APP_DELETEONEAREA}?id=${
                id || currentId
            }&state=${state == false ? state : true}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const PermanentlyDelete = () => {
        Axios.get(
            `${process.env.REACT_APP_DELETEPERMANENTLYAREA}?id=${currentId}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
                listUser.map((item) => {
                    if (item.area == currentId) {
                        Axios.get(
                            `${process.env.REACT_APP_DELETEPERMANENTLYUSER}?username=${item.username}`
                        )
                            .then((rs) => {
                                setChecked((prev) => (prev = !prev));
                            })
                            .catch((err) => console.log(err));
                    }
                });
            })
            .catch((err) => console.log(err));
    };
    const DeleteMany = () => {
        const areas = $("input[id*='selectItem']:checked");
        const arrId = [];
        Object.values(areas).map((item) => {
            arrId.push(item.value);
        });
        console.log(arrId);
        arrId
            .filter((item) => item != undefined)
            .map((item) => {
                DeleteOne(item);
            });
        $("#selectAll").prop("checked", false);
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
                                        <h2>QUẢN LÝ KHU VỰC</h2>
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
                                                setTitleModal({
                                                    main: "Xoá khu vực",
                                                    sub: "Tất cả các khu vực bạn chọn sẽ bị xoá?",
                                                });
                                                setState("deleteMany");
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
                                        <th>Tên khu vực</th>
                                        <th>Địa chỉ</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listAreas &&
                                        listAreas.map((item) => {
                                            if (item.isDeleted == "false") {
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
                                                        <td>{item.nameArea}</td>
                                                        <td>{item.address}</td>
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
                                                                    setTitleModal(
                                                                        {
                                                                            main: "Xoá khu vực",
                                                                            sub: "Bạn chắc chắn xoá khu vực này?",
                                                                        }
                                                                    );
                                                                    setCurrentId(
                                                                        item.id
                                                                    );
                                                                    setState(
                                                                        "deleteOneAvailable"
                                                                    );
                                                                }}
                                                            >
                                                                <i
                                                                    class="material-icons"
                                                                    data-toggle="tooltip"
                                                                    title="Xoá"
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
                                            <th>Tên khu vực</th>
                                            <th>Địa chỉ</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listAreas &&
                                            listAreas.map((item) => {
                                                if (item.isDeleted == "true") {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>
                                                                {item.nameArea}
                                                            </td>
                                                            <td>
                                                                {item.address}
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
                                                                        setCurrentId(
                                                                            item.id
                                                                        );
                                                                        setState(
                                                                            "deleteOneUnavailable"
                                                                        );
                                                                        setTitleModal(
                                                                            {
                                                                                main: "Xoá khu vực vĩnh viễn",
                                                                                sub: "Bạn chắc chắn xoá khu vực này?",
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
                                                                        setCurrentId(
                                                                            item.id
                                                                        );
                                                                        setState(
                                                                            "restore"
                                                                        );
                                                                        setTitleModal(
                                                                            {
                                                                                main: "Khôi phục khu vực",
                                                                                sub: "Bạn chắc chắn muốn khôi phục khu vực này?",
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
                                <h4 class="modal-title">Thêm khu vực mới</h4>
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
                                            Tên khu vực
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            name="nameArea"
                                            value={newArea.nameArea}
                                            onChange={(e) =>
                                                setNewArea({
                                                    ...newArea,
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Đia chỉ
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            name="address"
                                            value={newArea.address}
                                            onChange={(e) =>
                                                setNewArea({
                                                    ...newArea,
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
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
                                            Tên khu vực
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            name="nameArea"
                                            value={newArea.nameArea}
                                            onChange={(e) =>
                                                setNewArea({
                                                    ...newArea,
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Đia chỉ
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            name="address"
                                            value={newArea.address}
                                            onChange={(e) =>
                                                setNewArea({
                                                    ...newArea,
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
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
