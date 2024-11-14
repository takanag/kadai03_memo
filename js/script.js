$(document).ready(function () {
  // アイテムを次の買い物リストに追加する関数
  function addNextBuyItem(item) {
    const date = new Date().toLocaleDateString();
    const nextBuyList = localStorage.getItem("nextBuyList") || "";
    localStorage.setItem("nextBuyList", nextBuyList + date + "|" + item + ",");
    displayNextBuyList();
  }

  // お気に入りリストにアイテムを追加する関数
  function addFavoriteItem(item) {
    const favoriteList = localStorage.getItem("favoriteList") || "";
    if (!favoriteList.includes(item)) {
      localStorage.setItem("favoriteList", favoriteList + item + ",");
    }
    displayFavoriteList();
  }

  // 買い物メモを表示する関数
  function displayShoppingList() {
    const shoppingList = localStorage.getItem("shoppingList") || "";
    const items = shoppingList ? shoppingList.split(",").filter(Boolean) : [];
    const groupedItems = {};

    items.forEach((entry) => {
      const [date, item] = entry.split("|");
      if (!groupedItems[date]) {
        groupedItems[date] = [];
      }
      groupedItems[date].push(item);
    });

    $("#shopping-list").empty();

    let accordionIndex = 0;
    for (const date in groupedItems) {
      const itemList = groupedItems[date]
        .map(
          (item) => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item}
                        <button class="btn btn-favorite btn-sm" data-item="${item}">お気に入り</button>
                    </li>
                `
        )
        .join("");

      $("#shopping-list").append(`
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${accordionIndex}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${accordionIndex}" aria-expanded="false" aria-controls="collapse${accordionIndex}">
                                ${date}
                            </button>
                        </h2>
                        <div id="collapse${accordionIndex}" class="accordion-collapse collapse" aria-labelledby="heading${accordionIndex}" data-bs-parent="#shopping-list">
                            <div class="accordion-body">
                                <ul class="list-group">${itemList}</ul>
                            </div>
                        </div>
                    </div>
                `);
      accordionIndex++;
    }
  }

  // お気に入りリストを表示する関数
  function displayFavoriteList() {
    const favoriteList = localStorage.getItem("favoriteList") || "";
    const items = favoriteList ? favoriteList.split(",").filter(Boolean) : [];
    $("#favorite-list").empty();
    items.forEach((item) => {
      $("#favorite-list").append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item}
                        <div>
                            <button class="btn btn-delete btn-sm" data-item="${item}">削除</button>
                            <button class="btn btn-primary btn-sm" data-item="${item}">次の買い物</button>
                        </div>
                    </li>
                `);
    });
  }

  // 次の買い物リストを表示する関数
  function displayNextBuyList() {
    const nextBuyList = localStorage.getItem("nextBuyList") || "";
    const items = nextBuyList ? nextBuyList.split(",").filter(Boolean) : [];
    const groupedItems = {};

    items.forEach((entry) => {
      const [date, item] = entry.split("|");
      if (!groupedItems[date]) {
        groupedItems[date] = [];
      }
      groupedItems[date].push(item);
    });

    $("#next-buy-list").empty();
    for (const date in groupedItems) {
      const itemList = groupedItems[date]
        .map((item) => `<li class="list-group-item">${item}</li>`)
        .join("");
      $("#next-buy-list").append(`
                    <h5>${date}</h5>
                    <ul class="list-group mb-2">${itemList}</ul>
                `);
    }
  }

  // 各種リストのクリアや削除
  function deleteFavoriteItem(item) {
    let favoriteList = localStorage.getItem("favoriteList") || "";
    favoriteList = favoriteList
      .split(",")
      .filter((favItem) => favItem !== item)
      .join(",");
    localStorage.setItem("favoriteList", favoriteList);
    displayFavoriteList();
  }

  function clearNextBuyList() {
    localStorage.removeItem("nextBuyList");
    displayNextBuyList();
  }

  function saveNextBuyToShoppingList() {
    const nextBuyList = localStorage.getItem("nextBuyList") || "";
    const shoppingList = localStorage.getItem("shoppingList") || "";
    const updatedShoppingList = shoppingList + nextBuyList;
    localStorage.setItem("shoppingList", updatedShoppingList);
    clearNextBuyList();
    displayShoppingList();
  }

  $("#add-item").click(function () {
    const itemName = $("#item-name").val().trim();
    if (itemName) {
      addNextBuyItem(itemName);
      $("#item-name").val("");
    }
  });

  $(document).on("click", ".btn-favorite", function () {
    const item = $(this).data("item");
    addFavoriteItem(item);
  });

  $(document).on("click", ".btn-primary[data-item]", function () {
    const item = $(this).data("item");
    addNextBuyItem(item);
  });

  $(document).on("click", ".btn-delete", function () {
    const item = $(this).data("item");
    deleteFavoriteItem(item);
  });

  $("#clear-next-buy-list").click(clearNextBuyList);
  $("#save-to-shopping-list").click(saveNextBuyToShoppingList);

  displayNextBuyList();
  displayFavoriteList();
  displayShoppingList();
});
