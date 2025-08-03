const CONVENIENCE_FEES = 99;
const DELIVERY_CHARGES = 80;
const Coupons_applied = ['Welcome 100', 'NewUser 50'];
onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;

  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES + DELIVERY_CHARGES - Coupons_applied.reduce((acc, coupon) => {
    welcomeCoupon = coupon.match(/(\d+)/);
    return acc + (welcomeCoupon ? parseInt(welcomeCoupon[1]) : 0);
  }, 0);

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
    <div class="price-header">PRICE DETAILS (${totalItem} Items) </div>
    <div class="price-item">
      <span class="price-item-tag">Total MRP</span>
      <span class="price-item-value">₹${totalMRP}</span>
    </div>
    <div class="price-item">
      <span class="price-item-tag">Discount on MRP</span>
      <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
    </div>
    <div class="price-item">
      <span class="price-item-tag">Convenience Fee</span>
      <span class="price-item-value">₹99</span>
    </div>
    <div class="price-item">
      <span class="price-item-tag">Delivery Charges</span>
      <span class="price-item-value">₹80</span>
    </div>
    <div class="price-item">
      <span class="price-item-tag">Coupon applied</span>
      <span class="price-item-value">-₹${Coupons_applied.reduce((acc, coupon) => {
        welcomeCoupon = coupon.match(/(\d+)/);
        return acc + (welcomeCoupon ? parseInt(welcomeCoupon[1]) : 0);
      }, 0)}</span>
    </div>
    <hr>
    <div class="price-footer">
      <span class="price-item-tag">Total Amount</span>
      <span class="price-item-value">₹${finalPayment}</span>
    </div>
  </div>
  <button class="btn-place-order">
    <div class="css-xjhrni">PLACE ORDER</div>
  </button>
  `;
  const btn = bagSummaryElement.querySelector('.btn-place-order');
  if (btn) {
    btn.onclick = function() {
      showOrderPopup(
        finalPayment,
        totalMRP,
        totalDiscount,
        Coupons_applied.reduce((acc, coupon) => {
          let welcomeCoupon = coupon.match(/(\d+)/);
          return acc + (welcomeCoupon ? parseInt(welcomeCoupon[1]) : 0);
        }, 0),
        CONVENIENCE_FEES,
        DELIVERY_CHARGES
      );
    };
  }

}

// ...existing code...


function loadBagItemObjects() {
  console.log(bagItems);
  bagItemObjects = bagItems.map(itemId => {
    for (let i = 0; i < items.length; i++) {
      if (itemId == items[i].id) {
        return items[i];
      }
    }
  });
  console.log(bagItemObjects);
}

function displayBagItems() {
  let containerElement = document.querySelector('.bag-items-container');
  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
  bagItems = bagItems.filter(bagItemId => bagItemId != itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagIcon();
  displayBagItems();
  displayBagSummary();
}

function generateItemHTML(item) {
  return `<div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="../${item.image}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days">${item.return_period} days</span> return available
      </div>
      <div class="delivery-details">
        Delivery by
        <span class="delivery-details-days">${item.delivery_date}</span>
      </div>
    </div>

    <div class="remove-from-cart" onclick="removeFromBag(${item.id})">X</div>
  </div>`;
}
// ...existing code...
function showOrderPopup(finalPayment, totalMRP, totalDiscount, coupons, convenience, delivery) {
  const existing = document.getElementById('order-confirmation');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'order-confirmation';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = '#f2f2f2';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.zIndex = '9999';
  container.style.fontFamily = 'Arial, sans-serif';

  container.innerHTML = `
    <div style="
      background: #fff;
      padding: 32px 40px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      color: #333;
    ">
      <h2 style="margin-bottom: 20px;">Order Placed Successfully!</h2>
      <div style="text-align: left; margin-bottom: 20px;">
        <p><strong>Total MRP:</strong> ₹${totalMRP}</p>
        <p><strong>Discount:</strong> -₹${totalDiscount}</p>
        <p><strong>Coupons:</strong> -₹${coupons}</p>
        <p><strong>Convenience Fee:</strong> ₹${convenience}</p>
        <p><strong>Delivery Charges:</strong> ₹${delivery}</p>
        <hr style="margin: 16px 0; border-top: 1px solid #ccc;">
        <p style="font-size: 1.1em;"><strong>Final Amount:</strong> ₹${finalPayment}</p>
      </div>
      <button id="continue-shopping-btn" style="
        margin-top: 10px;
        padding: 10px 24px;
        background-color: rgba(255, 63, 108, 1);
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 1em;
        cursor: pointer;
      ">Continue Shopping</button>
    </div>
  `;

  document.body.appendChild(container);

  // Button Action
  document.getElementById('continue-shopping-btn').addEventListener('click', () => {
    container.remove();
    // Redirect or action here (optional)
    // window.location.href = '/shop';
  });
}