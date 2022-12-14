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
    $('input[id*="selectItem"]:checked').length == listTable.length
      ? $("#selectAll").prop("checked", true)
      : $("#selectAll").prop("checked", false);
  };
  const [state, setState] = React.useState("");
  const [titleModal, setTitleModal] = React.useState({
    main: "",
    sub: "",
  });

  const [currentTableName, setCurrentTableName] = React.useState("");
  const [checked, setChecked] = React.useState(true);
  const [listTable, setListTable] = React.useState([]);
  const [newTable, setNewTable] = React.useState({
    TableName: "",
    partitionkey: "",
    partitionkeytype: "",
    sortkey: "",
    sortkeytype: "",
    username: localStorage.getItem("username"),
  });
  const [listAreas, setListAreas] = React.useState([]);
  const [newUser, setNewUser] = React.useState({
    nameUser: "",
    email: "",
    address: "",
    phone: "",
    area: "",
  });

  // get all table by username
  React.useEffect(() => {
    Axios.post(`${process.env.REACT_APP_GET_TABLE_BY_USERNAME}`, {
      username: localStorage.getItem("username"),
    }).then((rs) => {
      setListTable(rs.data);
    });
  }, [checked]);

  const handleChange = (e) => {
    setNewTable({ ...newTable, [e.target.name]: e.target.value });
  };

  const Add = (e) => {
    e.preventDefault();
    if (newTable.partitionkey !== newTable.sortkey) {
      Axios.post(`${process.env.REACT_APP_CREATE_TABLE}`, newTable)
        .then((rs) => {
          alert(rs.data);
          setChecked((prev) => (prev = !prev));
          document.getElementById("close-modal").click();
        })
        .catch((err) => alert(err.response.data));
    } else {
      alert("Hai khoá trùng nhau");
    }
  };

  const DeleteOne = (tablename) => {
    Axios.post(`${process.env.REACT_APP_DELETE_TABLE}`, {
      TableName: tablename,
    })
      .then((rs) => {
        setChecked((prev) => (prev = !prev));
        alert(rs.data);
      })
      .catch((err) => console.log(err));
  };
  const DeleteMany = () => {
    const tables = $("input[id*='selectItem']:checked");
    const arrTableName = [];
    Object.values(tables).map((item) => {
      arrTableName.push(item.value);
    });
    arrTableName
      .filter((tablename) => tablename != undefined)
      .map((tablename) => {
        DeleteOne(tablename);
      });
    $("#selectAll").prop("checked", false);
  };

  const Delete = (e) => {
    e.preventDefault();
    if (state == "delete") {
      DeleteOne(currentTableName);
    } else {
      DeleteMany();
    }
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
                    <h2>QUẢN LÝ BẢNG ĐÃ TẠO</h2>
                  </div>
                  <div class="col-sm-4">
                    <a
                      href="#addTableModal"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#addTableModal"
                    >
                      <i class="material-icons">&#xE147;</i>{" "}
                      <span>Thêm mới</span>
                    </a>
                    <a
                      href="#deleteTableModal"
                      class="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteTableModal"
                      onClick={(e) => {
                        setState("deleteMany");
                        setTitleModal({
                          main: "Xoá nhiều bảng",
                          sub: "Tất cả các bảng bạn chọn sẽ bị xoá?",
                        });
                      }}
                    >
                      <i class="material-icons">&#xE15C;</i>
                      <span>Xoá nhiều</span>
                    </a>
                  </div>
                </div>
              </div>
              <table class="table table-striped table-hover">
                <thead>
                  <tr className="text-center">
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
                    <th>Tên bảng</th>
                    <th>Khoá phân vùng (P)</th>
                    <th>Loại khoá phân vùng</th>
                    <th>Khoá phụ (S)</th>
                    <th>Loại khoá phụ</th>
                  </tr>
                </thead>
                <tbody>
                  {listTable &&
                    listTable.map((item) => {
                      return (
                        <tr key={item.tablename} className="text-center">
                          <td>
                            <span class="custom-checkbox">
                              <input
                                type="checkbox"
                                className="checkItem"
                                id="selectItem-1"
                                value={item.tablename}
                                onChange={(e) => selectItem()}
                              ></input>
                              <label for="checkbox1"></label>
                            </span>
                          </td>
                          <td>
                            <a href={`/table/${item.tablename}`}>
                              {item.tablename}
                            </a>
                          </td>
                          <td>{item.AttributeDefinitions[0].AttributeName}</td>
                          <td>{item.AttributeDefinitions[0].AttributeType}</td>
                          <td>{item.AttributeDefinitions[1].AttributeName}</td>
                          <td>{item.AttributeDefinitions[1].AttributeType}</td>
                          <td>
                            <a
                              href="#deleteTableModal"
                              class="delete"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteTableModal"
                              onClick={(e) => {
                                setState("delete");
                                setCurrentTableName(item.tablename);
                                setTitleModal({
                                  main: "Xoá bảng",
                                  sub: "Bạn có chắc chắn xoá bảng này không?",
                                });
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
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <!-- Add Modal HTML --> */}
        <div id="addTableModal" class="modal fade">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Thêm bảng mới</h4>
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
                    <label class="form-label">Table name:</label>
                    <input
                      type="text"
                      class="form-control"
                      required
                      value={newTable.TableName}
                      name="TableName"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Partition Key: </label>
                    <input
                      type="text"
                      class="form-control"
                      required
                      value={newTable.partitionkey}
                      name="partitionkey"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Partition Key Type: </label>
                    <select
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          partitionkeytype: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose...</option>
                      <option value="S">S</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Soft Key: </label>
                    <input
                      type="text"
                      class="form-control"
                      required
                      value={newTable.sortkey}
                      name="sortkey"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Soft Key Type: </label>
                    <select
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          sortkeytype: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose...</option>
                      <option value="S">S</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="close-modal"
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

        {/* <!-- Delete Modal HTML --> */}
        <div id="deleteTableModal" class="modal fade">
          <div class="modal-dialog">
            <div class="modal-content">
              <form onSubmit={(e) => Delete(e)}>
                <div class="modal-header">
                  <h4 class="modal-title">{titleModal.main}</h4>
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
