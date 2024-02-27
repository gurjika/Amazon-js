import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js'
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "../data/deliveryOptions.js"



// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// deliveryDate.format('dddd, MMMM D');
// const deliveryDateFormmatted = deliveryDate.format('dddd, MMMM D');

function renderCheckout() {
  let cartHTML = '';

  cart.forEach( (cartItem) => {
    const productId = cartItem.productId;
    let mathingProduct;
    

    products.forEach((product) => {
        if (product.id === productId) {
            mathingProduct = product;
        }
    });


    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;


    deliveryOptions.forEach((option) => {
      if(option.id === deliveryOptionId){
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays, 'days'
    );


    const dateString = deliveryDate.format(
      'dddd, MMMM d', 
    );
      
    const priceString = deliveryOption.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOption.priceCents)} -`;
    

    cartHTML += `
    <div class="cart-item-container js-cart-item-container-${mathingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${mathingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${mathingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(mathingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${mathingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
             
              ${deliveryOptionsHTML(mathingProduct, cartItem)}
              </div>
            </div>
          </div>
    `


});


document.querySelector('.js-cart-items').innerHTML = cartHTML;

document.querySelectorAll('.js-delete-link')
    .forEach( (link) => {
         link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            document.querySelector(`.js-cart-item-container-${productId}`).remove();

         });
    })

    function deliveryOptionsHTML (matchingProduct, cartItem) {
      
      let html = '';
  
      console.log(deliveryOptions);
      
  
      deliveryOptions.forEach( (deliveryOption) => {
          const today = dayjs();
          const deliveryDate = today.add(
            deliveryOption.deliveryDays, 'days'
          );

  
          const dateString = deliveryDate.format(
            'dddd, MMMM d', 
          );
            
          const priceString = deliveryOption.priceCents === 0
          ? 'FREE'
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

          const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
            

          html += `
        
          <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : ''}
              class="delivery-option-input "
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                  ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
        
  
          `
      });


  
  
      return html;
  }


  document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        element.addEventListener('click', () => {
          const {productId, deliveryOptionId} = element.dataset
          updateDeliveryOption(productId, deliveryOptionId);
          renderCheckout();
        });
      });
  
}


renderCheckout();