import React from "react";
import bg from "../img/carousel-1.jpg";
import Axios from "axios";
export default function HomePageIndex() {
    const [account, setAccount] = React.useState({
        username: "",
        password: "",
        role: "",
        area: "",
        isDelete: false,
    });
    console.log(account);
    const [listAreas, setListAreas] = React.useState([]);

    const handleChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    };
    const login = (e) => {
        e.preventDefault();
        Axios.get(`${process.env.REACT_APP_LOGIN}?username=${account.username}`)
            .then((rs) => {
                console.log(rs.data);
                if (rs.data.isDelete == "false") {
                    if (rs.data.password == account.password) {
                        if (rs.data.role == "user") {
                            localStorage.setItem("role", "user");
                            window.location.href = "user";
                        } else {
                            localStorage.setItem("role", "admin");
                            window.location.href = "admin";
                        }
                    } else {
                        alert("Sai mật khẩu");
                        // window.location.reload(true);
                    }
                }
            })
            .catch((err) => console.log(err));
    };
    React.useEffect(() => {
        Axios.get(process.env.REACT_APP_GETALLAREA).then((rs) =>
            setListAreas(rs.data)
        );
    }, []);
    return (
        <>
            <div>
                <img
                    src={bg}
                    style={{ width: "100%", height: "100vh" }}
                    alt=""
                ></img>
                <div class="carousel-caption">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-10 text-start">
                                <h1 class="display-1 text-white mb-5 animated slideInRight fw-bold">
                                    Trang quản lý <br></br>nhân viên xây dựng
                                </h1>
                                <div>
                                    <a
                                        href="#loginEmployeeModal"
                                        data-bs-toggle="modal"
                                        data-bs-target="#loginEmployeeModal"
                                        class="btn btn-success fs-3"
                                        style={{
                                            width: "300px",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Đăng nhập
                                    </a>
                                </div>
                                <a
                                    href="./html/manager.html"
                                    class="btn btn-primary py-3 px-5 fs-3 animated slideInRight d-none"
                                >
                                    Vào trang quản lý
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- MODAL ĐĂNG NHẬP --> */}
                <div
                    class="modal fade"
                    id="loginEmployeeModal"
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
                                    Đăng nhập
                                </h1>
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={(e) => login(e)}>
                                <div class="modal-body">
                                    <div class="mb-3 d-flex justify-content-around">
                                        <label class="form-check-label">
                                            <input
                                                type="radio"
                                                class="form-check-input me-1"
                                                name="role"
                                                value="user"
                                                onClick={(e) => handleChange(e)}
                                            ></input>
                                            Nhân viên quản lý
                                        </label>
                                        <label class="form-check-label">
                                            <input
                                                type="radio"
                                                class="form-check-input me-1"
                                                name="role"
                                                value="admin"
                                                onClick={(e) => handleChange(e)}
                                            ></input>
                                            Admin
                                        </label>
                                    </div>
                                    {account.role != "" && (
                                        <>
                                            <div class="mb-3">
                                                <label class="form-label">
                                                    Tên đăng nhập:
                                                </label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    required
                                                    value={account.username}
                                                    onChange={(e) =>
                                                        setAccount({
                                                            ...account,
                                                            username:
                                                                e.target.value,
                                                        })
                                                    }
                                                ></input>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">
                                                    Mật khẩu:
                                                </label>
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    required
                                                    value={account.password}
                                                    onChange={(e) =>
                                                        setAccount({
                                                            ...account,
                                                            password:
                                                                e.target.value,
                                                        })
                                                    }
                                                ></input>
                                            </div>
                                            {account.role == "user" && (
                                                <div class="mb-3">
                                                    <label class="form-label">
                                                        Chọn khu vực:
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        name="area"
                                                        required
                                                        onChange={(e) =>
                                                            handleChange(e)
                                                        }
                                                    >
                                                        <option value="">
                                                            Choose...
                                                        </option>
                                                        {listAreas &&
                                                            listAreas.map(
                                                                (item) => {
                                                                    if (
                                                                        item.isDeleted ==
                                                                        "false"
                                                                    )
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.nameArea
                                                                                }
                                                                            </option>
                                                                        );
                                                                }
                                                            )}
                                                    </select>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                {account.role != "" && (
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
                                            Đăng nhập
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
