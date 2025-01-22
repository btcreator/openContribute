import { setAlert } from './alert.js';

export default function showError(err) {
  setAlert(err.response?.data.message ?? 'No response from server', 'error');
}
