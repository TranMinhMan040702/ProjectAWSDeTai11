import React from "react";
import * as bootstrap from "bootstrap";
export default function ToastUtils(id) {
  window.bootstrap = bootstrap;
  const toastLiveExample = document.getElementById(id);
  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}
