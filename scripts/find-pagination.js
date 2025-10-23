console.log('Looking for pagination...');

let buttons = document.querySelectorAll('button');
buttons.forEach((btn, i) => {
  let ariaLabel = btn.getAttribute('aria-label');
  let title = btn.getAttribute('title');
  let className = btn.className;
  console.log('Button', i, '- aria:', ariaLabel, '- title:', title, '- class:', className);
});

console.log('Checking for page input...');
let inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
inputs.forEach((input, i) => {
  console.log('Input', i, '- value:', input.value, '- placeholder:', input.placeholder);
});

console.log('Checking for select dropdown...');
let selects = document.querySelectorAll('select');
selects.forEach((sel, i) => {
  console.log('Select', i, '- value:', sel.value, '- options:', sel.options.length);
});
