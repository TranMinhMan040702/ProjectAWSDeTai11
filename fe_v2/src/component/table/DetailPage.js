import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import $ from "jquery";
import Axios from "axios";
export default function DetailPage() {
  const [arrTitle, setArrTitle] = React.useState([]);
  const [contentRow, setContentRow] = React.useState([]);
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
            setKeyItem([
              item.AttributeDefinitions[0].AttributeName,
              item.AttributeDefinitions[1].AttributeName,
            ]);
            getAllItemByTableName(
              item.AttributeDefinitions[0].AttributeName,
              item.AttributeDefinitions[1].AttributeName
            );
          }
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const getAllItemByTableName = (partition, soft) => {
    Axios.post(`${process.env.REACT_APP_GET_ALL_ITEM_BY_TABLE_NAME}`, {
      tablename: slug,
    })
      .then((rs) => {
        setListItem(rs.data);
        var arrTitle = [partition, soft];
        rs.data.map((items) => {
          Object.keys(items).map((item) => {
            if (!arrTitle.includes(item)) arrTitle.push(item);
          });
        });
        setArrTitle(arrTitle);
      })
      .catch((err) => console.log(err));
  };

  const AddColumn = (e, name, item) => {
    if (name == "update") {
      $(`#main-area${name}`).append(
        `<div class="row" id="new_${id_update}">
          <div class="mb-3 col-6">
            <label class="form-label">T??n c???t: </label>
            <input
            type="text"
            class="form-control"
            required
            value="${item.name || ""}"
            id="${name}input_name_${id_update}"
            ></input>
          </div>
          <div class="mb-3 col-6">
            <label class="form-label">Gi?? tr???: </label>
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
          <label class="form-label">T??n c???t: </label>
          <input
            type="text"
            class="form-control"
            required
            id="input_name_${id}"
          ></input>
        </div>
        <div class="mb-3 col-6">
          <label class="form-label">Gi?? tr???: </label>
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
          getAllItemByTableName(keyItem[0], keyItem[1]);
          Object.values($("button[id *='close-']")).map((item) => {
            console.log(item.click());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("C?? tr?????ng b??? tr??ng t??n");
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
          getAllItemByTableName(keyItem[0], keyItem[1]);

          alert(rs.data);
        })
        .catch((err) => console.log(err));
    } else {
      alert("B???n ph???i ????? l???i ??t nh???t 01 h??ng");
    }
  };

  const ClickPencil = (props) => {
    const container = document.getElementById("main-areaupdate");
    container.replaceChildren();
    var arr = [
      {
        name: keyItem[0],
        value: Object.values(props[keyItem[0]]).toString(),
      },
      {
        name: keyItem[1],
        value: Object.values(props[keyItem[1]]).toString(),
      },
    ];
    Object.entries(props).map((item, index) => {
      if (
        [item[0]].toString() != keyItem[0] &&
        [item[0]].toString() != keyItem[1]
      ) {
        arr.push({
          name: [item[0]].toString(),
          value: Object.values(item[1]).toString(),
        });
      }
    });
    setContentRow(arr);
    setTimeout(() => {
      arr.map((item, index) => {
        if (index > 1) AddColumn("", "update", item);
      });
    }, 100);
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
                    <h2>C??C TH??NH PH???N C???A B???NG: {slug.toUpperCase()}</h2>
                  </div>
                  <div class="col-sm-6">
                    <a
                      href="#addTableModal"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#addTableModal"
                    >
                      <i class="material-icons">&#xE147;</i>{" "}
                      <span>Th??m m???i ho???c ch???nh s???a</span>
                    </a>
                  </div>
                </div>
              </div>
              <table class="table table-striped table-hover">
                <thead>
                  <tr className="text-center">
                    {/* <th>{keyItem[0]}</th>
                    <th>{keyItem[1]}</th> */}
                    {arrTitle &&
                      arrTitle.map((item) => {
                        // if (item != keyItem[0] && item != keyItem[1])
                        return <th>{item}</th>;
                      })}
                    <th>H??nh ?????ng</th>
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
                                title="Ch???nh s???a"
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
                                  Object.entries(items[keyItem[0]])[0][1],
                                  Object.entries(items[keyItem[1]])[0][1],
                                ]);
                                setTitleModal({
                                  main: "Xo?? h??ng",
                                  sub: "B???n c?? ch???c ch???n xo?? h??ng n??y kh??ng?",
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
                <h4 class="modal-title">Th??m m???i ho???c ch???nh s???a</h4>
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
                        <label class="form-label">T??n kho?? ph??n v??ng: </label>
                        {keyItem && (
                          <input
                            disabled
                            type="text"
                            class="form-control"
                            value={keyItem[0]}
                            id="key-p"
                            required
                          ></input>
                        )}
                      </div>
                      <div class="mb-3 col-6">
                        <label class="form-label">
                          Gi?? tr??? kho?? ph??n v??ng:{" "}
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
                        <label class="form-label">T??n kho?? ph???: </label>
                        {keyItem && (
                          <input
                            disabled
                            type="text"
                            class="form-control"
                            value={keyItem[1]}
                            required
                            id="key-s"
                          ></input>
                        )}
                      </div>
                      <div class="mb-3 col-6">
                        <label class="form-label">Gi?? tr??? kho?? ph???: </label>
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
                      Th??m c???t
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger col-3"
                      onClick={(e) => DeleteColumn(e, "")}
                    >
                      Xo?? c???t
                    </button>
                  </div>
                </div>
                <div class="modal-footer justify-content-between">
                  <span>
                    *N???u tr??ng kho?? ph??n v??ng v?? kho?? ph??? ???? t???n t???i th?? s???
                    ch???nh s???a h??ng ????
                  </span>
                  <div>
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Hu???
                    </button>
                    <button type="submit" class="btn btn-success">
                      Th??m
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
                <h4 class="modal-title">Ch???nh s???a</h4>
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
                            nameColumn = "T??n kho?? ph??n v??ng:";
                            valueColumn = "Gi?? tr??? kho?? ph??n v??ng:";
                          } else {
                            nameColumn = "T??n kho?? ph???:";
                            valueColumn = "Gi?? tr??? kho?? ph???:";
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
                      Th??m c???t
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger col-3"
                      onClick={(e) => DeleteColumn(e, "update")}
                    >
                      Xo?? c???t
                    </button>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Hu???
                  </button>
                  <button type="submit" class="btn btn-warning">
                    C???p nh???t
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
                    Hu???
                  </button>
                  <button
                    type="submit"
                    class="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Xo??
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
