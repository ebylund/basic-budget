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

function reDisplayTransactions() {
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

    addTransactionToList({
        date: inputValues.inputDate.value,
        description: inputValues.inputDescription.value,
        amount: inputValues.inputAmount.value,
        category: inputValues.inputCategory.value
    });

    reDisplayTransactions();
}
