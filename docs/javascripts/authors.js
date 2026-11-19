/* Bobchestrate Workshop - authors dialog on the home page */
(function () {
  "use strict";

  document.addEventListener("click", function (e) {
    var dlg = document.getElementById("bw-acerca");
    if (!dlg) return;
    if (e.target.closest("#bw-firma")) {
      dlg.showModal();
    } else if (e.target.closest("#bw-acerca-cerrar") || e.target === dlg) {
      dlg.close();
    }
  });
})();
