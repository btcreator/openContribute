const text = document.querySelector('.tail-text');

// Hero text ease-in / -out
const changeText = () => {
  const tails = ['ceive', 'nect', 'struct', 'tribute'];
  let counter = 1;
  return () => {
    text.classList.add('reverse');
    setTimeout(() => {
      text.textContent = tails[counter++];
      text.classList.remove('reverse');
    }, 1300);
    if (counter >= tails.length) counter = 0;
  };
};
setInterval(changeText(), 4500);
