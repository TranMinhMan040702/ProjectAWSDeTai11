import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import $ from "jquery";
import Axios from "axios";
export default function DetailPage() {
  const [arrTitle, setArrTitle] = React.useState([]);
  const [contentRow, setContentRow] = React.useState([]);
  const [checkAdd, setCheckAdd] = React.useState(true);
  const [checkList, setCheckList] = React.useState(true);
  const [key, setKey] = React.useState({});
  const [listItem, setListItem] = React.useState([]);
  const [keyItem, setKeyItem] = React.useState([]);
  const [item, setItem] = React.useState(["", ""]);
  const [id, setId] = React.useState(0);
  const [id_update, setId_update] = React.useState(0);
  const [titleModal, setTitleModal] = React.useState({
    main: "",
    sub: "",
  });
  let slug = useParams().slug;
  React.useEffect(() => {
    Axios.post(`${process.env.REACT_APP_GET_TABLE_BY_USERNAME}`, {
      username: localStorage.getItem("username"),
    })
      .then((rs) => {
        rs.data.map((item) => {
          if (item.tablename == slug) {
            setKey({
              [item.AttributeDefinitions[0].AttributeName]: "Example",
              [item.AttributeDefinitions[1].AttributeName]: "Example",
            });
            setKeyItem([
              item.AttributeDefinitions[0].AttributeName,
              item.AttributeDefinitions[1].AttributeName,
            ]);
          }
        });
      })
      .catch((err) => console.log(err));
  }, []);
  React.useEffect(() => {
    Axios.post(`${process.env.REACT_APP_GET_ALL_ITEM_BY_TABLE_NAME}`, {
      tablename: slug,
    })
      .then((rs) => {
        setListItem(rs.data);
        if (rs.data.length == 0) {
          setCheckList((prev) => (prev = !prev));
        }
        var arrTitle = [];
        rs.data.map((item) => {
          arrTitle = arrTitle.concat(Object.keys(item));
        });
        setArrTitle([...new Set(arrTitle)]);
      })
      .catch((err) => console.log(err));
  }, [checkAdd]);
  React.useEffect(() => {
    Axios.post(process.env.REACT_APP_ADD_OR_UPDATE_ITEM, {
      tablename: slug,
      item: key,
    })
      .then((rs) => {
        setCheckAdd((prev) => (prev = !prev));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [checkList]);
  const AddColumn = (e, name, item) => {
    // const item = { name: "s", value: "d" };
    if (name == "update") {
      $(`#main-area${name}`).append(
        `<div class="row" id="new_${id_update}">
          <div class="mb-3 col-6">
            <label class="form-label">Tên cột: </label>
            <input
            type="text"
            class="form-control"
            required
            value="${item.name || ""}"
            id="${name}input_name_${id_update}"
            ></input>
          </div>
          <div class="mb-3 col-6">
            <label class="form-label">Giá trị: </label>
            <input
              type="text"
              class="form-control"
              required
              value="${item.value || ""}"
              id="${name}input_value_${id_update}"
            ></input>
          </div>
         `
      );
      setId_update((prev) => prev + 1);
    } else {
      $(`#main-area`).append(
        `<div class="row" id="new_${id}">
        <div class="mb-3 col-6">
          <label class="form-label">Tên cột: </label>
          <input
            type="text"
            class="form-control"
            required
            id="input_name_${id}"
          ></input>
        </div>
        <div class="mb-3 col-6">
          <label class="form-label">Giá trị: </label>
          <input
            type="text"
            class="form-control"
            required
            id="input_value_${id}"
          ></input>
        </div>
       `
      );
      setId((prev) => prev + 1);
    }
  };
  const DeleteColumn = (e, name) => {
    var tempId = id;
    if (name == "update") {
      tempId = id_update;
    }
    if (tempId > 0) {
      $(`#new_${tempId - 1}`).remove();
      if (name == "update") {
        setId_update((prev) => prev - 1);
      } else {
        setId((prev) => prev - 1);
      }
    }
  };
  const CheckKey = (name) => {
    const key = $("input[id *='key-']");
    const input_name = $(`input[id *='${name}input_name']`);
    const arr = [
      ...Object.values(key).map((item) => item.value),
      ...Object.values(input_name).map((item) => item.value),
    ].filter((item) => item != undefined);

    //Mang k trung nhau
    let arrayWithNoDuplicates = arr.reduce(function (accumulator, element) {
      if (accumulator.indexOf(element) === -1) {
        accumulator.push(element);
      }
      return accumulator;
    }, []);

    return arrayWithNoDuplicates.length == arr.length ? true : false;
  };
  const AddOrUpdate = (e, name) => {
    e.preventDefault();
    if (CheckKey(name)) {
      const key = $("input[id *='key-']");
      const value = $(`input[id *='${name}value-']`);

      const input_name = $(`input[id *='${name}input_name']`);
      const input_value = $(`input[id *='${name}input_value']`);

      var ob = {};
      Object.values(key).map((item, index) => {
        if (item.value != undefined) {
          ob[item.value] = Object.values(value)[index].value;
        }
      });
      Object.values(input_name).map((item, index) => {
        if (item.value != undefined) {
          ob[item.value] = Object.values(input_value)[index].value;
        }
      });
      Axios.post(process.env.REACT_APP_ADD_OR_UPDATE_ITEM, {
        tablename: slug,
        item: ob,
      })
        .then((rs) => {
          setCheckAdd((prev) => (prev = !prev));
          Object.values($("button[id *='close-']")).map((item) => {
            console.log(item.click());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Có trường bị trùng tên");
    }
  };
  const Delete = (e) => {
    e.preventDefault();
    if (listItem.length !== 1) {
      Axios.post(process.env.REACT_APP_DELETE_ITEM, {
        TableName: slug,
        Key: {
          [keyItem[0]]: item[0],
          [keyItem[1]]: item[1],
        },
      })
        .then((rs) => {
          setCheckAdd((prev) => (prev = !prev));
          // alert(rs);
        })
        .catch((err) => console.log(err));
    } else {
      alert("Bạn phải để lại ít nhất 01 hàng");
    }
  };

  const ClickPencil = (props) => {
    const container = document.getElementById("main-areaupdate");

    container.replaceChildren();
    var arr = [];
    Object.entries(props).map((item, index) => {
      arr.push({
        name: [item[0]].toString(),
        value: Object.values(item[1]).toString(),
      });
    });
    setContentRow(arr);
    setTimeout(() => {
      arr.map((item, index) => {
        if (index > 1) AddColumn("", "update", item);
      });
    }, 100);
  };

  const handleSetState = (field, oldItem, newItem) => {
    const newState = contentRow.map((obj) => {
      if (obj[field] === oldItem) {
        return { ...obj, [field]: newItem };
      }
      return obj;
    });

    setContentRow(newState);
  };
  return (
    <>
      <input type="hidden" value="1" id="total_chq"></input>
      <Header />
      <div>
        <div class="container-xl">
          <div class="table-responsive">
            <div class="table-wrapper">
              <div class="table-title">
                <div class="row">
                  <div class="col-sm-6">
                    <h2>CÁC THÀNH PHẦN CỦA BẢNG: {slug.toUpperCase()}</h2>
                  </div>
                  <div class="col-sm-6">
                    <a
                      href="#addTableModal"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#addTableModal"
                    >
                      <i class="material-icons">&#xE147;</i>{" "}
                      <span>Thêm mới hoặc chỉnh sửa</span>
                    </a>
                  </div>
                </div>
              </div>
              <table class="table table-striped table-hover">
                <thead>
                  <tr className="text-center">
                    {arrTitle &&
                      arrTitle.map((item) => {
                        return <th>{item}</th>;
                      })}
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {listItem[0] &&
                    listItem.map((items) => {
                      return (
                        <tr className="text-center">
                          {arrTitle.map((arrItem) => {
                            var html;
                            for (
                              let i = 0;
                              i < Object.entries(items).length;
                              i++
                            ) {
                              if (Object.entries(items)[i][0] == arrItem) {
                                html = (
                                  <td>
                                    {Object.values(
                                      Object.values(items)[i]
                                    ).toString()}
                                  </td>
                                );
                                break;
                              } else {
                                html = <td></td>;
                              }
                            }
                            return html;
                          })}
                          <td>
                            <a
                              href="#updateTableModal"
                              class="edit"
                              data-bs-toggle="modal"
                              data-bs-target="#updateTableModal"
                              onClick={(e) => {
                                ClickPencil(items);
                              }}
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
                              href="#deleteTableModal"
                              class="delete"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteTableModal"
                              onClick={(e) => {
                                setItem([
                                  Object.values(
                                    Object.values(items)[0]
                                  ).toString(),
                                  Object.values(
                                    Object.values(items)[1]
                                  ).toString(),
                                ]);
                                setTitleModal({
                                  main: "Xoá hàng",
                                  sub: "Bạn có chắc chắn xoá hàng này không?",
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
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Thêm mới hoặc chỉnh sửa</h4>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close-add"
                ></button>
              </div>
              <form onSubmit={(e) => AddOrUpdate(e, "")}>
                <div class="modal-body">
                  <div id="main-area">
                    <div className="row">
                      <div class="mb-3 col-6">
                        <label class="form-label">Tên khoá phân vùng: </label>
                        {listItem[0] && (
                          <input
                            disabled
                            type="text"
                            class="form-control"
                            value={Object.keys(listItem[0])[0]}
                            id="key-p"
                            required
                          ></input>
                        )}
                      </div>
                      <div class="mb-3 col-6">
                        <label class="form-label">
                          Giá trị khoá phân vùng:{" "}
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="value-p"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="row">
                      <div class="mb-3 col-6">
                        <label class="form-label">Tên khoá phụ: </label>
                        {listItem[0] && (
                          <input
                            disabled
                            type="text"
                            class="form-control"
                            value={Object.keys(listItem[0])[1]}
                            required
                            id="key-s"
                          ></input>
                        )}
                      </div>
                      <div class="mb-3 col-6">
                        <label class="form-label">Giá trị khoá phụ: </label>
                        <input
                          type="text"
                          class="form-control"
                          id="value-s"
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <button
                      type="button"
                      class="btn btn-secondary col-3 me-2"
                      onClick={(e) => AddColumn(e, "")}
                    >
                      Thêm cột
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger col-3"
                      onClick={(e) => DeleteColumn(e, "")}
                    >
                      Xoá cột
                    </button>
                  </div>
                </div>
                <div class="modal-footer justify-content-between">
                  <span>
                    *Nếu trùng khoá phân vùng và khoá phụ đã tồn tại thì sẽ
                    chỉnh sửa hàng đó
                  </span>
                  <div>
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Huỷ
                    </button>
                    <button type="submit" class="btn btn-success">
                      Thêm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Update Modal HTML --> */}
        <div id="updateTableModal" class="modal fade">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Chỉnh sửa</h4>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close-add"
                ></button>
              </div>
              <form onSubmit={(e) => AddOrUpdate(e, "update")}>
                <div class="modal-body">
                  <div>
                    {contentRow &&
                      contentRow.map((item, index) => {
                        var nameColumn = "",
                          valueColumn = "",
                          id_value = "updatevalue-" + Math.random() + "";
                        if (index < 2) {
                          if (index == 0) {
                            nameColumn = "Tên khoá phân vùng:";
                            valueColumn = "Giá trị khoá phân vùng:";
                          } else {
                            nameColumn = "Tên khoá phụ:";
                            valueColumn = "Giá trị khoá phụ:";
                          }
                          return (
                            <div class="row">
                              <div class="mb-3 col-6">
                                <label class="form-label">{nameColumn}</label>
                                <input
                                  disabled
                                  type="text"
                                  class="form-control"
                                  required
                                  value={item.name}
                                ></input>
                              </div>
                              <div class="mb-3 col-6">
                                <label class="form-label">{valueColumn}</label>
                                <input
                                  disabled
                                  type="text"
                                  class="form-control"
                                  required
                                  id={id_value}
                                  value={item.value}
                                ></input>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                  <div id="main-areaupdate"></div>
                  <div className="row">
                    <button
                      type="button"
                      class="btn btn-secondary col-3 me-2"
                      onClick={(e) => AddColumn(e, "update", "")}
                    >
                      Thêm cột
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger col-3"
                      onClick={(e) => DeleteColumn(e, "update")}
                    >
                      Xoá cột
                    </button>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button type="submit" class="btn btn-warning">
                    Cập nhật
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
