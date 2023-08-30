const cardNumber = document.getElementById("card-number");
const cardHolderName = document.getElementById("card-holder-name");
const cardNameInput = document.getElementById("card-name-input");
const displayValidity = document.getElementById("validity");
const validityInput = document.getElementById("validity-input");
const cardNumberDisplay = document.querySelectorAll(".card-number-display"); // Add "." before "card-number-display"
const cvvInput = document.getElementById("cvv");
const cvvDisplay = document.getElementById("cvv-display");
const cardContainer = document.querySelector(".credit-card");
let currentSpanIndex = 0;

cardNumber.addEventListener("input", () => {
  const inputNumber = cardNumber.value.replace(/\D/g, ""); // Use "cardNumber.value" instead of "cardNumber.ariaValueMax"
  cardNumber.value = inputNumber.slice(0, 16);
  
  for (let i = 0; i < cardNumberDisplay.length; i++) {
    if (i < inputNumber.length) {
      cardNumberDisplay[i].textContent = inputNumber[i];
    } else {
      cardNumberDisplay[i].textContent = "_";
    }
  }
  
  if (inputNumber.length <= cardNumberDisplay.length) {
    currentSpanIndex = inputNumber.length;
  } else {
    currentSpanIndex = cardNumberDisplay.length;
  }
});


cardNameInput.addEventListener('input', ()=>{
    if(cardNameInput.value.length<1){
        cardHolderName.innerText="your Name Here";
    }
    else if(cardNameInput.value.length>30){
        cardNameInput.value=cardNameInput.value.slice(0, 30);
    }
    else{
        cardHolderName.innerText=cardNameInput.value;
    }
})

validityInput.addEventListener('input', ()=>{
    const inputString=validityInput.value;
    if(inputString.length<1){
        displayValidity.innerText="06/28";
        return false;
    }
    const parts=inputString.split("-");
    const year=parts[0].slice(2);
    const month=parts[1];

    // Final Formated String
    const formattedString=`${month}/${year}`;
    displayValidity.innerText=formattedString;
})


cvvInput.addEventListener('input', ()=>{
    const userInput=cvvInput.value;
    const sanitizedInput= userInput.slice(0,3);
    const numericInput=sanitizedInput.replace(/\D/g,"");
    cvvInput.value=numericInput;
    cvvDisplay.innerText=numericInput;

})

// Flip
// cvvInput.addEventListener('click',()=>{
//     document.getElementById('card').style.transform="rotateY(180deg)";
// })
// // Reflip card
// document.addEventListener('click',()=>{
//     if(document.activeElement.id!="cvv"){
//         document.getElementById('card').style.transform="rotateY(0deg)";
//     }
// })
cvvInput.addEventListener("focus", () => {
  cardContainer.classList.add("flipped");
});

cvvInput.addEventListener("blur", () => {
  cardContainer.classList.remove("flipped");
});

window.onload=()=>{
    cvvInput.value="";
    validityInput.value="";
    cardNameInput.value="";
    cardNumber.value="";

}