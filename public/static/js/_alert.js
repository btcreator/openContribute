const alertWindow = document.querySelector('.alert-window');

export const setAlert = function (message, status) {
  alertWindow.classList.toggle('error', status === 'error');
  alertWindow.classList.remove('hidden');
  alertWindow.clientHeight;
  alertWindow.style.opacity = 1;
  alertWindow.innerHTML = `<p>${message}</p>`;

  _hideAlert(3000);
};

export const hideAlert = _hideAlert;

function _hideAlert(msec) {
  setTimeout(() => {
    alertWindow.style.opacity = 0;
    setTimeout(() => {
      alertWindow.classList.add('hidden');
    }, 500);
  }, msec);
}
