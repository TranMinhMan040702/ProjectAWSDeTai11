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
    const username = localStorage.getItem("username");
    const [state, setState] = React.useState("");
    const [titleModal, setTitleModal] = React.useState({
        main: "",
        sub: "",
    });
    const [currentArea, setCurrentArea] = React.useState({
        id: "",
        nameArea: "",
    });
    // chua dung
    const [currentUsername, setCurrentUsername] = React.useState("");
    const [tableDelete, setTableDelete] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [listEmployee, setListEmployee] = React.useState([]);
    const [listAreas, setListAreas] = React.useState([]);
    const [newEmployee, setNewEmployee] = React.useState({
        fullName: "",
        address: "",
        phone: "",
        area: "",
    });
    // get areaId of manager
    React.useEffect(() => {
        Axios.get(
            `${process.env.REACT_APP_GETONEUSERBYUSERNAME}?username=${username}`
        ).then((rs) => {
            setNewEmployee({ ...newEmployee, area: rs.data.area });
            setCurrentArea({ ...currentArea, id: rs.data.area });
            console.log(currentArea);
        });
    }, []);
    // get all employee
    React.useEffect(() => {
        Axios.get(process.env.REACT_APP_GETALLEMPLOYEE).then((rs) => {
            setListEmployee(rs.data);
        });
    }, [checked]);
    React.useEffect(() => {
        Axios.get(`${process.env.REACT_APP_GETONEAREABYID}`).then((rs) => {});
    });
    React.useEffect(() => {
        Axios.get(process.env.REACT_APP_GETALLAREA).then((rs) => {
            setListAreas(rs.data);
            for (var i = 0; i < rs.data.length; i++) {
                if (rs.data[i].isDeleted == "false") {
                    setCurrentArea({
                        id: rs.data[0].id,
                        nameArea: rs.data[0].nameArea,
                    });
                    break;
                }
            }
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
            `${process.env.REACT_APP_ADDEMPLOYEE}?id=${id}&fullname=${newEmployee.fullName}&address=${newEmployee.address}&phone=${newEmployee.phone}&isDelete=${isDelete}&area=${newEmployee.area}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const Update = (e) => {
        e.preventDefault();
        Axios.get(`${process.env.REACT_APP_UPDATEUSER}`)
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const DeleteOne = (username, state) => {
        Axios.get(
            `${process.env.REACT_APP_DELETEONEUSER}?username=${
                username || currentUsername
            }&state=${state}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const Delete = (e) => {
        e.preventDefault();
        if (state == "deleteOneAvailable") {
            DeleteOne("", true);
        } else if (state == "deleteOneUnavailable") {
            PermanentlyDelete();
        } else if (state == "restore") {
            DeleteOne("", false);
        } else {
            DeleteMany();
        }
    };
    const PermanentlyDelete = () => {
        Axios.get(
            `${process.env.REACT_APP_DELETEPERMANENTLYUSER}?username=${currentUsername}`
        )
            .then((rs) => {
                setChecked((prev) => (prev = !prev));
            })
            .catch((err) => console.log(err));
    };
    const DeleteMany = () => {
        const users = $("input[id*='selectItem']:checked");
        const arrUsername = [];
        Object.values(users).map((item) => {
            arrUsername.push(item.value);
        });
        arrUsername
            .filter((item) => item != undefined)
            .map((item) => {
                DeleteOne(item, true);
            });
        $("#selectAll").prop("checked", false);
    };
    const ClickPencil = (username, area) => {
        document.getElementById("select-area-edit-form").value = area;
        setCurrentUsername(username);
        Axios.get(
            `${process.env.REACT_APP_GETONEUSERBYUSERNAME}?username=${username}`
        ).then((rs) => {
            // setNewUser({
            //     nameUser: rs.data.nameUser,
            //     email: rs.data.email,
            //     address: rs.data.address,
            //     phone: rs.data.phone,
            //     password: rs.data.password,
            // });
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
                                        <h2>{`QU???N L?? NH??N VI??N C???A KHU V???C (${currentArea.nameArea
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
                                            <span>Th??m m???i</span>
                                        </a>
                                        <a
                                            href="#deleteEmployeeModal"
                                            class="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteEmployeeModal"
                                            onClick={(e) => {
                                                setState("deleteMany");
                                                setTitleModal({
                                                    main: "Xo?? nh??n vi??n",
                                                    sub: "T???t c??? c??c nh??n vi??n b???n ch???n s??? b??? xo???",
                                                });
                                            }}
                                        >
                                            <i class="material-icons">
                                                &#xE15C;
                                            </i>
                                            <span>Xo?? nhi???u</span>
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
                                        <th>H??? v?? t??n</th>
                                        <th>?????a ch???</th>
                                        <th>S??? ??i???n tho???i</th>
                                        <th>H??nh ?????ng</th>
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
                                                        <td>{item.fullName}</td>
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
                                                                        item.username,
                                                                        item.area
                                                                    )
                                                                }
                                                            >
                                                                <i
                                                                    class="material-icons"
                                                                    data-toggle="tooltip"
                                                                    title="Ch???nh s???a"
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
                                                                            main: "Xo?? nh??n vi??n",
                                                                            sub: "B???n c?? ch???c ch???n xo?? nh??n vi??n n??y kh??ng?",
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
                                Xem c??c khu v???c ???? b??? xo??
                            </button>
                        ) : (
                            <button
                                type="button"
                                class="btn btn-secondary w-100 my-4"
                                onClick={(e) =>
                                    setTableDelete((prev) => (prev = !prev))
                                }
                            >
                                ????ng
                            </button>
                        )}
                        {tableDelete && (
                            <div class="table-wrapper">
                                <div class="table-title">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <h2>C??C KHU V???C ???? B??? XO??</h2>
                                        </div>
                                    </div>
                                </div>
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>H??? v?? t??n</th>
                                            <th>Email</th>
                                            <th>?????a ch???</th>
                                            <th>S??? ??i???n tho???i</th>
                                            <th>Username</th>
                                            <th>Password</th>
                                            <th>H??nh ?????ng</th>
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
                                                                                main: "Xo?? nh??n vi??n",
                                                                                sub: "Nh??n vi??n ???????c ch???n s??? b??? xo?? v??nh vi???n?",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                        data-toggle="tooltip"
                                                                        title="Xo?? v??nh vi???n"
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
                                                                                main: "Kh??i ph???c nh??n vi??n",
                                                                                sub: "B???n ch???c ch???n mu???n kh??i ph???c nh??n vi??n n??y?",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                        data-toggle="tooltip"
                                                                        title="Kh??i ph???c"
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
                                <h4 class="modal-title">Th??m nh??n vi??n m???i</h4>
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
                                            H??? v?? t??n
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            value={newEmployee.fullName}
                                            name="fullName"
                                            onChange={(e) => handleChange(e)}
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            ?????a ch???
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
                                            S??? ??i???n tho???i
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
                                        Hu???
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-success"
                                        data-bs-dismiss="modal"
                                    >
                                        Th??m
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
                                    Ch???nh s???a th??ng tin
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
                                            H??? v?? t??n
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            required
                                            value={newEmployee.fullName}
                                            name="fullName"
                                            onChange={(e) => handleChange(e)}
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            ?????a ch???
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
                                            S??? ??i???n tho???i
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
                                        Hu???
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-success"
                                        data-bs-dismiss="modal"
                                    >
                                        C???p nh???t
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
                                        Hu???
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-danger"
                                        data-bs-dismiss="modal"
                                    >
                                        {state == "restore"
                                            ? "Kh??i ph???c"
                                            : "Xo??"}
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
