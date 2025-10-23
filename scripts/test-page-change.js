console.log('Testing page navigation...');

function goToPage(pageNum) {
  console.log('Attempting to go to page', pageNum);

  let inputs = document.querySelectorAll('input');
  console.log('Found', inputs.length, 'inputs');

  inputs.forEach((input, i) => {
    console.log('Input', i, '- type:', input.type, '- value:', input.value);
  });

  let pageInput = inputs[0];
  console.log('Using input 0, current value:', pageInput.value);

  pageInput.value = pageNum;
  console.log('Set value to:', pageInput.value);

  pageInput.focus();

  let changeEvent = new Event('change', { bubbles: true });
  pageInput.dispatchEvent(changeEvent);

  let enterEvent = new KeyboardEvent('keypress', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true
  });
  pageInput.dispatchEvent(enterEvent);

  pageInput.blur();

  console.log('Events dispatched');
}

console.log('Current page input value:', document.querySelectorAll('input')[0].value);
console.log('');
console.log('Running test: going to page 2 in 2 seconds...');

setTimeout(() => {
  goToPage(2);
  console.log('Check if page changed!');
}, 2000);
