import React from "react";
import bg from "../img/carousel-1.jpg";
import Axios from "axios";
import emailjs from "@emailjs/browser";
import LoadingPage from "../utils/LoadingPage";
import Toast from "../utils/Toast";
import ToastUtils from "../utils/ToastUtils";
export default function HomePageIndex() {
  const [listAccount, setListAccount] = React.useState([]);
  const [account, setAccount] = React.useState({
    username: "",
    password: "",
  });
  const [newAccount, setNewAccount] = React.useState({
    email: "",
    username: "",
    password: "",
    rePassword: "",
  });
  const [otp, setOTP] = React.useState({
    value: 0,
    state: false, //chưa có mã otp
  });
  const [pageLoading, setPageLoading] = React.useState(false);
  const [textToast, setTextToast] = React.useState("");

  React.useEffect(() => {
    Axios.post(`${process.env.REACT_APP_GET_ALL_ITEM_BY_TABLE_NAME}`, {
      tablename: "UserTable",
    })
      .then((rs) => {
        setListAccount(rs.data);
      })
      .catch((err) => console.log(err));
  });

  const login = (e) => {
    e.preventDefault();
    setPageLoading(true);
    Axios.post(`${process.env.REACT_APP_LOGIN}`, {
      username: account.username,
      password: account.password,
    })
      .then((rs) => {
        setPageLoading(false);
        localStorage.setItem("username", rs.data.username);
        localStorage.setItem("email", rs.data.email);
        setTextToast("Đăng nhập thành công");
        ToastUtils("success");
        setTimeout(() => {
          window.location.href = "table";
        }, 500);
      })
      .catch((err) => {
        setTextToast(err.response.data);
        ToastUtils("fail");
        setPageLoading(false);
      });
  };
  const register = (e) => {
    e.preventDefault();
    if (
      document.getElementById("otpFromEmail").value === otp.value.toString()
    ) {
      setPageLoading(true);
      Axios.post(`${process.env.REACT_APP_REGISTER}`, {
        email: newAccount.email,
        username: newAccount.username,
        password: newAccount.password,
      })
        .then((rs) => {
          setPageLoading(false);
          localStorage.setItem("username", rs.data.username);
          setTextToast("Đăng kí thành công");
          ToastUtils("success");
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        })
        .catch((err) => {
          setPageLoading(false);
          setTextToast(err.response.data);
          ToastUtils("fail");
        });
    } else {
      setTextToast("Bạn nhập mã OTP sai!!!");
      ToastUtils("fail");
    }
  };
  const checkInfo = () => {
    var ob = { state: true, msg: "" };
    if (listAccount.filter((e) => e.email.S === newAccount.email).length > 0) {
      ob.msg = "Email đã tồn tại";
      ob.state = false;
    } else if (
      listAccount.filter((e) => e.username.S === newAccount.username).length > 0
    ) {
      ob.msg = "Tên tài khoản đã tồn tại";
      ob.state = false;
    }
    return ob;
  };
  const form = React.useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    const check = checkInfo();
    console.log(check);
    if (newAccount.password === newAccount.rePassword) {
      if (check.state) {
        const otp = Math.round(Math.random() * 100000 + 1);
        document.getElementById("otp").value = otp;
        setOTP({ state: true, value: otp });
        emailjs
          .sendForm(
            "service_204g87e",
            "template_5oplaek",
            form.current,
            "jHf8lWNPN_5mXgNpq"
          )
          .then(
            (result) => {
              setTextToast("Đã gửi OTP đến " + newAccount.email);
              ToastUtils("success");
            },
            (error) => {
              setTextToast(error.text);
              ToastUtils("fail");
            }
          );
      } else {
        alert(check.msg);
      }
    } else {
      alert("Mật khẩu nhập lại chưa khớp");
    }
  };

  return (
    <>
      <div>
        <img src={bg} style={{ width: "100%", height: "100vh" }} alt=""></img>
        <div class="carousel-caption">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-10 text-start">
                <h1 class="display-1 text-white mb-5 animated slideInRight fw-bold">
                  Trang quản lý <br></br>nhân viên xây dựng
                </h1>
                <div className="d-flex">
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
                  <div>
                    <a
                      href="#signinEmployeeModal"
                      data-bs-toggle="modal"
                      data-bs-target="#signinEmployeeModal"
                      class="btn btn-primary fs-3"
                      id="modal-register"
                      style={{
                        width: "300px",
                        marginRight: "10px",
                      }}
                    >
                      Đăng ký
                    </a>
                  </div>
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
          {pageLoading ? (
            <LoadingPage />
          ) : (
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
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
                    <div class="mb-3 d-flex justify-content-around"></div>
                    <div class="mb-3">
                      <label class="form-label">Tên đăng nhập:</label>
                      <input
                        type="text"
                        class="form-control"
                        required
                        value={account.username}
                        onChange={(e) =>
                          setAccount({
                            ...account,
                            username: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Mật khẩu:</label>
                      <input
                        type="password"
                        class="form-control"
                        required
                        value={account.password}
                        onChange={(e) =>
                          setAccount({
                            ...account,
                            password: e.target.value,
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
                    <button type="submit" class="btn btn-success">
                      Đăng nhập
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/* <!-- MODAL ĐĂNG KÝ --> */}
        <div
          class="modal fade"
          id="signinEmployeeModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Đăng Ký
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {otp.state == false ? (
                <form ref={form} onSubmit={(e) => sendEmail(e)}>
                  <input
                    hidden
                    type="text"
                    class="form-control"
                    name="otp"
                    id="otp"
                  ></input>
                  <div class="modal-body">
                    <div class="mb-3 d-flex justify-content-around"></div>
                    <div class="mb-3">
                      <label class="form-label">Email:</label>
                      <input
                        type="email"
                        class="form-control"
                        required
                        name="email"
                        value={newAccount.email}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            email: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Tên đăng nhập:</label>
                      <input
                        type="text"
                        class="form-control"
                        required
                        value={newAccount.username}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            username: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Mật khẩu:</label>
                      <input
                        type="password"
                        class="form-control"
                        required
                        value={newAccount.password}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            password: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Nhập lại mật khẩu:</label>
                      <input
                        type="password"
                        class="form-control"
                        required
                        value={newAccount.rePassword}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            rePassword: e.target.value,
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
                    <button type="submit" class="btn btn-primary">
                      Đăng ký
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={(e) => register(e)}>
                  <div className="modal-body">
                    <div class="mb-3">
                      <label class="form-label">Mã OTP:</label>
                      <input
                        type="text"
                        class="form-control"
                        required
                        id="otpFromEmail"
                      ></input>
                    </div>
                  </div>

                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        setOTP({ state: false, value: 0 });
                        document.getElementById("modal-register").click();
                      }}
                    >
                      Huỷ
                    </button>
                    <button type="submit" class="btn btn-primary">
                      Xác nhận
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <Toast text={textToast} bg="bg-danger" id="fail" />
        <Toast text={textToast} bg="bg-success" id="success" />
      </div>
    </>
  );
}
