// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//   console.log('Send');
//   chrome.tabs.sendMessage(tabs[0].id, 'message', response => {
//     console.log('Recv response = ' + response.title);
//     document.getElementById('title').innerText = response.title;
//   });
// });

document.querySelector('form').addEventListener('submit', e => {
  const inputs = [...e.currentTarget.querySelectorAll('[type="number"]')].map(el => [
    el.name,
    Number(el.value),
  ]);
  const obj = Object.fromEntries(inputs);
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0].url?.match('https://.*.cjdropshipping.com/.*')) {
      chrome.tabs.sendMessage(tabs[0].id, obj);
    }

    window.close();
  });
});
