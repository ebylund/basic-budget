var transactionList = [];

function addTransactionToList(transaction) {
    transactionList.unshift(transaction);
}

function validateFields() {

}

function resetFields() {

}

function fetchInputValues() {
    return {
        inputDate: document.getElementById("trans-date-input"),
        inputDescription: document.getElementById("trans-description-input"),
        inputAmount: document.getElementById("trans-amount-input"),
        inputCategory: document.getElementById("trans-category-input")
    };
}

function createDomTransaction(t) {
    var newTransactionRow = document.createElement("div");
    newTransactionRow.className = "transaction";
    newTransactionRow.setAttribute("data-id", t.id);
    newTransactionRow.setAttribute("data-created-on", t.createdOn);
    t.date = new Date(t.date).toLocaleDateString();
    t.amount = `-$${t.amount.toFixed(2)}`;
    [t.date, t.description, t.amount, t.category].forEach(item => {
        var newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.innerText = item;
        newTransactionRow.appendChild(newItem);
    });

    return newTransactionRow
}

function removeDisplayedTransactions() {
    var transactionContainer = document.getElementById("transactions-container");
    while (transactionContainer.firstChild) {
        transactionContainer.removeChild(transactionContainer.firstChild);
    }
}

function refreshTransactions() {
    removeDisplayedTransactions();
    var transactionContainer = document.getElementById("transactions-container");
    transactionList.forEach(transaction => {
        var newTransactionRow = createDomTransaction(transaction);
        transactionContainer.appendChild(newTransactionRow);
    });
}

function addTransaction() {
    var inputValues = fetchInputValues();

    // TODO: validate fields
    validateFields();

    postTransaction({
        date: inputValues.inputDate.value,
        description: inputValues.inputDescription.value,
        amount: inputValues.inputAmount.value,
        category: inputValues.inputCategory.value
    });
}

function fetchTransactions() {
    return fetch("http://localhost:5225/transactions")
        .then(function (response) {
            return response.json();
        })
}

function fetchTransactionsAndPopulateList() {
    return fetchTransactions()
        .then(function(transactions) {
            transactionList = transactions;
        })
}

function postTransaction(transaction) {
    console.log(transaction);
    fetch("http://localhost:5225/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    }).then(function () {
        fetchTransactionsAndPopulateList()
            .then(function() {
                refreshTransactions();
            });
    })
}

fetchTransactionsAndPopulateList()
    .then(function() {
        refreshTransactions();
    });
