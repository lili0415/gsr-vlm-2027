// A geometric illustration, not benchmark data: 27 cuboids form one consistent cube.
const svgNS = 'http://www.w3.org/2000/svg';
const pieces = document.querySelector('#cube-pieces');
const project = (x, y, z) => [280 + (x - y) * 45, 358 + (x + y) * 24 - z * 51];
const points = vertices => vertices.map(v => project(...v).join(',')).join(' ');
const blocks = [];
for (let z = 0; z < 3; z++) {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) blocks.push({ x, y, z });
  }
}
blocks.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));
blocks.forEach(({ x, y, z }) => {
  const g = document.createElementNS(svgNS, 'g');
  g.classList.add('cube-piece');
  const ox = x - 1.5, oy = y - 1.5, oz = z + .55, size = .94;
  const red = (x === 2 && y === 0) || (x === 1 && y === 0 && z === 2);
  const colors = red ? ['#d97350', '#b34932', '#e98b66'] : ['#d5d8c7', '#a4af96', '#edf0df'];
  const faces = [
    [[ox,oy+size,oz],[ox+size,oy+size,oz],[ox+size,oy+size,oz+size],[ox,oy+size,oz+size]],
    [[ox+size,oy,oz],[ox+size,oy+size,oz],[ox+size,oy+size,oz+size],[ox+size,oy,oz+size]],
    [[ox,oy,oz+size],[ox+size,oy,oz+size],[ox+size,oy+size,oz+size],[ox,oy+size,oz+size]]
  ];
  faces.forEach((vertices, index) => {
    const polygon = document.createElementNS(svgNS, 'polygon');
    polygon.setAttribute('points', points(vertices));
    polygon.setAttribute('fill', colors[index]);
    g.appendChild(polygon);
  });
  g.dataset.dx = (x - y) * 22;
  g.dataset.dy = (x + y - 2) * 11 - (z - 1) * 30;
  g.style.transform = `translate(${g.dataset.dx}px, ${g.dataset.dy}px)`;
  pieces.appendChild(g);
});
const assemble = document.querySelector('#assemble-button');
assemble.addEventListener('click', () => {
  const assembled = assemble.getAttribute('aria-pressed') !== 'true';
  assemble.setAttribute('aria-pressed', String(assembled));
  document.querySelectorAll('.cube-piece').forEach(piece => {
    piece.style.transform = assembled ? 'translate(0px, 0px)' : `translate(${piece.dataset.dx}px, ${piece.dataset.dy}px)`;
  });
  document.querySelector('#assemble-label').textContent = assembled ? 'Separate' : 'Assemble';
  document.querySelector('#figure-state').textContent = assembled ? 'Assembled structure' : 'Separate components';
  document.querySelector('#geometry').setAttribute('aria-label', assembled ? 'The geometric pieces assembled into one consistent cube' : 'An exploded geometric cube that can be assembled into a consistent structure');
});

// WAI-ARIA tabs: both groups support arrow, Home, and End keys.
document.querySelectorAll('[role="tablist"]').forEach(list => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  function activate(target) {
    tabs.forEach(tab => {
      const selected = tab === target;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
});
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
