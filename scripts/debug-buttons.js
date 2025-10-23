let buttons = document.querySelectorAll('button');
console.log('Total buttons:', buttons.length);
buttons.forEach((btn, i) => {
  console.log('Button', i, ':', btn.innerText.trim(), '- disabled:', btn.disabled);
});
