// TBD: Add tooltip for editing each input
// current problem - after showing tooltip, focus goes to
// submit button and there is no posibility to change
// input value directly

// const Tooltip = ({ top, left } = {}) => `
// <div class="tooltip js-tooltip" style="
//   top: ${top}px;
//   left: ${left}px;
// ">
//   <div>
//     <label for="fees">Fees:</label>
//     <input
//       type="number"
//       name="fees"
//       id="fees"
//       min="0"
//       value="15"
//     />
//   </div>
//   <div>
//     <label for="fee-ammount">Fee ammount:</label>
//     <input
//       type="number"
//       name="fee-ammount"
//       id="fee-ammount"
//       min="0"
//       value="0.3"
//       step="0.1"
//     />
//   </div>
//   <div>
//     <label for="profit">Profit:</label>
//     <input
//       type="number"
//       name="profit"
//       id="profit"
//       value="10"
//     />
//   </div>
//   <div class="buttons">
//     <button type="button" data-type="cancel">Cancel</button>
//     <button type="button" data-type="submit">Submit</button>
//   </div>
//   <style>
//     .tooltip {
//       position: fixed;
//       z-index: 5555560;
//       width: 150px;
//       height: 250px;
//       padding: 0.5rem;
//       transform: translate(-50%, 0);
//       background-color: #F0EDE7;
//     }

//     .tooltip > div {
//       margin-bottom: 0.5rem;
//     }

//     label {
//       display: block;
//       margin-bottom: 0.15rem;
//       font-size: 12px;
//     }

//     input {
//       width: 100%;
//       height: 32px;
//       border-radius: 4px;
//       border: 1px solid #d9d9d9;
//       padding: 0 4px 0 5px;
//       font-size: 12px;
//     }

//     input:hover, input:focus {
//       border-color: var(--color-theme-1);
//     }

//     .buttons {
//       display: flex;
//       align-items: center;
//       gap: 4px;
//       margin-top: 1rem;
//       margin-bottom: 0;
//     }

//     button {
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       text-align: center;

//       min-width: 50px;
//       height: 24px;
//       font-size: 14px;
//       font-weight: 400;
//       border-radius: 2px;
//       border: 1px solid;
//       padding: 0 8px;

//       cursor: pointer;
//     }

//     [data-type="submit"] {
//       background-color: var(--color-theme-1);
//       color: var(--color-font-4);
//       border-color: var(--color-theme-1);
//     }

//     [data-type="cancel"] {
//       color: var(--color-font-2);
//       background: #F9F9F9;
//       border: 1px solid #E4E4E4;
//     }
//   </style>
// </div>
// `;

// let tooltipNode = null;
// let focusedInput = null;
// let dropshippingPrice = 0;

// const showTooltip = e => {
//   const node = document.createElement('div');
//   const { top, left, height, width } = e.target.getBoundingClientRect();
//   const addOnTop = window.innerHeight - (top + height) <= 250; // 250 - tooltip height
//   const t = addOnTop ? top - 250 - 15 : top + height + 15;
//   const l = left + width / 2;
//   node.innerHTML = Tooltip({ top: t, left: l });
//   document.body.appendChild(node);

//   const submitButton = node.querySelector('[data-type="submit"');
//   if (submitButton) submitButton.focus();

//   if (tooltipNode) removeTooltip();
//   tooltipNode = node;
// };

// const removeTooltip = () => {
//   tooltipNode.remove();
//   tooltipNode = null;
//   focusedInput = null;
//   dropshippingPrice = 0;
// };

// const onFocus = e => {
//   const input = e.target.closest('#pdlist-Table-li input[ng-model="item.price"]');
//   if (!input) return;

//   focusedInput = input;

//   dropshippingPrice = input.closest('div')?.previousElementSibling?.innerText;
//   if (dropshippingPrice) dropshippingPrice = Number(dropshippingPrice.replace(/^\D+/g, ''));
//   if (!dropshippingPrice) return;

//   showTooltip(e);
// };
// // const onBlur = () => {

// // };

// const onClick = e => {
//   const input = e.target.closest('#pdlist-Table-li input.edprice');
//   if (input) {
//     return;
//   }

//   const tooltip = e.target.closest('.js-tooltip');
//   if (!tooltip) {
//     if (tooltipNode) removeTooltip();
//     return;
//   }

//   const closeBtn = e.target.closest('[data-type="cancel"]');
//   const submitBtn = e.target.closest('[data-type="submit"]');

//   if (closeBtn) removeTooltip();

//   if (submitBtn && focusedInput) {
//     try {
//       const productCost = dropshippingPrice;
//       const fixedTransactionFee = +tooltip.querySelector('[name="fee-ammount"]')?.value;
//       const profit = +tooltip.querySelector('[name="profit"]')?.value;
//       const ebayFee = +tooltip.querySelector('[name="fees"]')?.value;

//       const soldPrice = (productCost + fixedTransactionFee + profit) / (1 - ebayFee / 100);

//       if (!isNaN(soldPrice)) focusedInput.value = soldPrice.toFixed(2);

//       removeTooltip();
//     } catch (error) {
//       return;
//     }
//   }
// };

// setTimeout(() => {
//   const manualListIframe = document.getElementById('manualListIframe');
//   if (!manualListIframe) return;

//   manualListIframe.contentDocument.addEventListener('focus', onFocus, { capture: true });
//   manualListIframe.contentDocument.addEventListener('click', onClick);
//   document.addEventListener('click', onClick);
// }, 10000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message) {
    const manualListIframe = document.getElementById('manualListIframe');
    if (!manualListIframe) {
      sendResponse({
        received: true,
      });
      return;
    }

    const items = manualListIframe.contentDocument.querySelectorAll('#pdlist-Table-li');

    if (!items.length) {
      sendResponse({
        received: true,
      });
      return;
    }
    items.forEach(item => {
      const checkbox = item.querySelector('.check-box .iconfont');
      const isSelected = checkbox?.classList.contains('iconicon');
      if (!isSelected) return;

      const input = item.querySelector('input[ng-model="item.price"]');

      let dropshippingPrice = input.closest('div')?.previousElementSibling?.innerText;
      if (dropshippingPrice) dropshippingPrice = Number(dropshippingPrice.replace(/^\D+/g, ''));
      if (!dropshippingPrice) return;

      const productCost = dropshippingPrice;
      const fixedTransactionFee = message['fee-ammount'];
      const dollarProfit = message['dollar-profit'];
      const percentageProfit = message['percentage-profit'];
      const ebayFee = message.fees;

      const soldPrice =
        (productCost +
          fixedTransactionFee +
          (productCost * percentageProfit) / 100 +
          dollarProfit) /
        (1 - ebayFee / 100);

      if (!isNaN(soldPrice)) {
        input.value = soldPrice.toFixed(2);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  sendResponse({
    received: true,
  });
});
