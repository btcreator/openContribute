const heroText = document.querySelector('.tail-text');
const inputSearch = document.getElementById('search');
const btnSearch = document.querySelector('.btn-search');

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

// Search for projects with given name
btnSearch.addEventListener('click', () => window.location.replace(`/search?q=${inputSearch.value}`));
