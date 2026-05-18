const STORE_WHATSAPP = "5584991433732";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const menu = {
  sizes: [
    { id: "300ml", name: "Açaí 300ml", price: 14.9, desc: "Ideal para matar a vontade" },
    { id: "500ml", name: "Açaí 500ml", price: 22.9, desc: "Mais cremoso, mais completo" },
  ],
  creams: [
    { id: "ninho", name: "Creme de Ninho", price: 0, desc: "Doce e bem cremoso" },
    { id: "pacoca", name: "Creme de Paçoca", price: 0, desc: "Sabor brasileiro clássico" },
    { id: "cupuuacu", name: "Creme de Cupuaçu", price: 0, desc: "Tropical e levemente azedinho" },
    { id: "morango", name: "Creme de Morango", price: 0, desc: "Frutado e suave" },
    { id: "chocolate", name: "Creme de Chocolate", price: 0, desc: "Para uma mistura intensa" },
  ],
  fillings: [
    { id: "granola", name: "Granola", price: 0, desc: "Crocante tradicional" },
    { id: "leite-po", name: "Leite em pó", price: 0, desc: "Finalização cremosa" },
    { id: "confete", name: "Confete", price: 0, desc: "Colorido e doce" },
    { id: "amendoim", name: "Amendoim", price: 0, desc: "Crocância extra" },
    { id: "chocoball", name: "Chocoball", price: 0, desc: "Bolinha de chocolate" },
  ],
  fruits: [
    { id: "banana", name: "Banana", price: 0, desc: "Combina com tudo" },
    { id: "morango-fruta", name: "Morango", price: 0, desc: "Fresco e docinho" },
    { id: "kiwi", name: "Kiwi", price: 1.5, desc: "Extra tropical" },
    { id: "manga", name: "Manga", price: 1.5, desc: "Doce e suculenta" },
  ],
  toppings: [
    { id: "leite-condensado", name: "Leite condensado", price: 0, desc: "Cobertura clássica" },
    { id: "chocolate-calda", name: "Calda de chocolate", price: 0, desc: "Doce na medida" },
    { id: "morango-calda", name: "Calda de morango", price: 0, desc: "Frutada e brilhante" },
    { id: "mel", name: "Mel", price: 0, desc: "Toque natural" },
  ],
  extras: [
    { id: "nutella", name: "Nutella", price: 4, desc: "Camada extra especial" },
    { id: "ovomaltine", name: "Ovomaltine", price: 3, desc: "Crocante maltado" },
    { id: "bis", name: "Bis picado", price: 3, desc: "Chocolate crocante" },
    { id: "dose-acai", name: "Dose extra de açaí", price: 5, desc: "Mais sabor no copo" },
  ],
};

const state = {
  size: null,
  creams: [],
  fillings: [],
  fruits: [],
  topping: null,
  extras: [],
};

const limits = {
  creams: 3,
  fillingsAndFruits: 3,
  toppings: 1,
};

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".option-panel");
const cartLines = document.querySelector("#cartLines");
const cartTotal = document.querySelector("#cartTotal");
const clearCart = document.querySelector("#clearCart");
const checkoutForm = document.querySelector("#checkoutForm");
const formNote = document.querySelector("#formNote");

function getItem(category, id) {
  return menu[category].find((item) => item.id === id);
}

function selectedFillingsCount() {
  return state.fillings.length + state.fruits.length;
}

function optionPrice(item) {
  return item.price > 0 ? `+ ${currency.format(item.price)}` : "Incluso";
}

function renderOptions() {
  Object.keys(menu).forEach((category) => {
    const grid = document.querySelector(`[data-options="${category}"]`);
    grid.innerHTML = "";

    menu[category].forEach((item) => {
      const button = document.createElement("button");
      button.className = "option-card";
      button.type = "button";
      button.dataset.category = category;
      button.dataset.id = item.id;
      button.innerHTML = `
        <strong>${item.name}</strong>
        <span>${item.desc}</span>
        <span>${category === "sizes" ? currency.format(item.price) : optionPrice(item)}</span>
      `;
      button.addEventListener("click", () => toggleOption(category, item.id));
      grid.appendChild(button);
    });
  });

  updateSelectedCards();
}

function toggleFromList(list, id, limit) {
  if (list.includes(id)) {
    return list.filter((itemId) => itemId !== id);
  }

  if (list.length >= limit) {
    formNote.textContent = `Você pode escolher até ${limit} opções nessa categoria.`;
    return list;
  }

  formNote.textContent = "";
  return [...list, id];
}

function toggleOption(category, id) {
  if (category === "sizes") {
    state.size = id;
  }

  if (category === "creams") {
    state.creams = toggleFromList(state.creams, id, limits.creams);
  }

  if (category === "fillings") {
    if (state.fillings.includes(id)) {
      state.fillings = state.fillings.filter((itemId) => itemId !== id);
    } else if (selectedFillingsCount() < limits.fillingsAndFruits) {
      state.fillings = [...state.fillings, id];
      formNote.textContent = "";
    } else {
      formNote.textContent = "Você pode escolher até 3 itens entre recheios e frutas.";
    }
  }

  if (category === "fruits") {
    if (state.fruits.includes(id)) {
      state.fruits = state.fruits.filter((itemId) => itemId !== id);
    } else if (selectedFillingsCount() < limits.fillingsAndFruits) {
      state.fruits = [...state.fruits, id];
      formNote.textContent = "";
    } else {
      formNote.textContent = "Você pode escolher até 3 itens entre recheios e frutas.";
    }
  }

  if (category === "toppings") {
    state.topping = state.topping === id ? null : id;
  }

  if (category === "extras") {
    state.extras = state.extras.includes(id)
      ? state.extras.filter((itemId) => itemId !== id)
      : [...state.extras, id];
  }

  updateSelectedCards();
  renderCart();
}

function updateSelectedCards() {
  document.querySelectorAll(".option-card").forEach((card) => {
    const category = card.dataset.category;
    const id = card.dataset.id;
    const selected =
      (category === "sizes" && state.size === id) ||
      (category === "creams" && state.creams.includes(id)) ||
      (category === "fillings" && state.fillings.includes(id)) ||
      (category === "fruits" && state.fruits.includes(id)) ||
      (category === "toppings" && state.topping === id) ||
      (category === "extras" && state.extras.includes(id));

    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function getSelections() {
  const size = state.size ? getItem("sizes", state.size) : null;
  const creams = state.creams.map((id) => getItem("creams", id));
  const fillings = state.fillings.map((id) => getItem("fillings", id));
  const fruits = state.fruits.map((id) => getItem("fruits", id));
  const topping = state.topping ? getItem("toppings", state.topping) : null;
  const extras = state.extras.map((id) => getItem("extras", id));
  return { size, creams, fillings, fruits, topping, extras };
}

function calculateTotal() {
  const selections = getSelections();
  const groups = [
    selections.size ? [selections.size] : [],
    selections.creams,
    selections.fillings,
    selections.fruits,
    selections.topping ? [selections.topping] : [],
    selections.extras,
  ];

  return groups.flat().reduce((total, item) => total + item.price, 0);
}

function names(items) {
  return items.length ? items.map((item) => item.name).join(", ") : "Nenhum selecionado";
}

function renderCart() {
  const selections = getSelections();
  const total = calculateTotal();
  cartTotal.textContent = currency.format(total);

  if (!selections.size) {
    cartLines.innerHTML = `<div class="empty-cart">Escolha um tamanho para começar seu pedido.</div>`;
    return;
  }

  cartLines.innerHTML = `
    <div class="cart-line"><strong>Tamanho</strong><span>${selections.size.name}</span></div>
    <div class="cart-line"><strong>Cremes</strong><span>${names(selections.creams)}</span></div>
    <div class="cart-line"><strong>Recheios</strong><span>${names(selections.fillings)}</span></div>
    <div class="cart-line"><strong>Frutas</strong><span>${names(selections.fruits)}</span></div>
    <div class="cart-line"><strong>Cobertura</strong><span>${selections.topping ? selections.topping.name : "Nenhuma selecionada"}</span></div>
    <div class="cart-line"><strong>Extras</strong><span>${names(selections.extras)}</span></div>
  `;
}

function resetOrder() {
  state.size = null;
  state.creams = [];
  state.fillings = [];
  state.fruits = [];
  state.topping = null;
  state.extras = [];
  formNote.textContent = "";
  updateSelectedCards();
  renderCart();
}

function buildWhatsappMessage() {
  const selections = getSelections();
  const name = document.querySelector("#customerName").value.trim();
  const phone = document.querySelector("#customerPhone").value.trim();
  const address = document.querySelector("#customerAddress").value.trim();
  const payment = document.querySelector("#paymentMethod").value;
  const notes = document.querySelector("#orderNotes").value.trim() || "Sem observações";

  return [
    "Olá, Tropical Açaí! Quero finalizar meu pedido:",
    "",
    `Cliente: ${name}`,
    `WhatsApp: ${phone}`,
    `Endereço: ${address}`,
    `Pagamento: ${payment}`,
    "",
    `Tamanho: ${selections.size.name}`,
    `Cremes: ${names(selections.creams)}`,
    `Recheios: ${names(selections.fillings)}`,
    `Frutas: ${names(selections.fruits)}`,
    `Cobertura: ${selections.topping ? selections.topping.name : "Nenhuma selecionada"}`,
    `Extras: ${names(selections.extras)}`,
    "",
    `Observações: ${notes}`,
    `Total: ${currency.format(calculateTotal())}`,
  ].join("\n");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
  });
});

clearCart.addEventListener("click", resetOrder);

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.size) {
    formNote.textContent = "Escolha o tamanho do açaí antes de finalizar.";
    document.querySelector("#cardapio").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!state.topping) {
    formNote.textContent = "Escolha uma cobertura antes de finalizar.";
    document.querySelector('[data-tab="toppings"]').click();
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const message = encodeURIComponent(buildWhatsappMessage());
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`, "_blank");
});

renderOptions();
renderCart();
