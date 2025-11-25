// utils/bootstrapToast.js
export function showToast(message, type = "success") {
  // Remove any existing toast container
  const old = document.getElementById("liveToast");
  if (old) old.remove();

  const toastHTML = `
    <div id="liveToast" class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" 
         role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById("liveToast");
  const toastBootstrap = new window.bootstrap.Toast(toastElement);
  toastBootstrap.show();
}
