const heroText = document.querySelector('.tail-text');

if(heroText) {
  // Hero text ease-in / -out
  const changeText = () => {
    const tails = ['ceive', 'nect', 'struct', 'tribute'];
    let counter = 1;
    return () => {
      heroText.classList.add('reverse');
      setTimeout(() => {
        heroText.textContent = tails[counter++];
        heroText.classList.remove('reverse');
      }, 1300);
      if (counter >= tails.length) counter = 0;
    };
  };
  setInterval(changeText(), 4500);
}