const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: "USD",
    minimumFractionDigits: 2
});

var transactionList = [];

function validateFields() {
    var v = fetchInputValues();
    return v.inputDate.value !== "" &&
        v.inputDescription.value !== "" &&
        v.inputCategory.value !== "" &&
        v.inputAmount.value !== ""
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

function updateTransactionHandler(event) {
    var transNode = event.target.parentNode.parentNode.parentNode;
    var dataId = Number(transNode.getAttribute("data-id"));
    var trans = transactionList.find(trans => trans.id === dataId);
    destroyTransaction(dataId)
        .then(function () {
            var inputValues = fetchInputValues();
            inputValues.inputDate.value = trans.date.split("T")[0];
            inputValues.inputDescription.value = trans.description;
            inputValues.inputCategory.value = trans.category;
            inputValues.inputAmount.value = trans.amount;
        })
}

function destroyTransactionHandler(event) {
    var dataId = event.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    destroyTransaction(dataId)
        .then(function () {
            console.log("destroyed!")
        })

}

function createTransactionFromTemplate(t) {
    var newTransaction = document
        .getElementById("transaction-template")
        .content
        .cloneNode(true)
        .querySelector(".transaction");

    newTransaction.setAttribute("data-id", t.id);
    newTransaction.setAttribute("data-created-on", t.createdOn);
    newTransaction.querySelector(".trans-date").innerText = new Date(t.date).toLocaleDateString();
    newTransaction.querySelector(".trans-description").innerText = t.description;
    newTransaction.querySelector(".trans-category").innerText = t.category;
    newTransaction.querySelector(".trans-amount").innerText = "-" + formatter.format(t.amount);
    newTransaction.querySelector("#update").addEventListener("click", updateTransactionHandler);
    newTransaction.querySelector("#destroy").addEventListener("click", destroyTransactionHandler);

    return newTransaction;
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
        var newTransaction = createTransactionFromTemplate(transaction);
        transactionContainer.appendChild(newTransaction);
    });
}

function addTransaction() {
    var inputValues = fetchInputValues();
    Object.values(inputValues).forEach(input => input.classList.remove("input-error"));
    if (!validateFields()) {
        var inputs = Object.values(inputValues);
        var invalidInputs = inputs.filter(input => input.value === "");
        invalidInputs.forEach(input => input.classList.add("input-error"));
        return;
    }
    postTransaction({
        date: inputValues.inputDate.value,
        description: inputValues.inputDescription.value,
        category: inputValues.inputCategory.value,
        amount: inputValues.inputAmount.value
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

function destroyTransaction(id) {
    return fetch(`http://localhost:5225/transactions/${id}`, {method: "DELETE"})
        .then(function () {
            fetchTransactionsAndPopulateList()
                .then(function() {
                    refreshTransactions();
                    return true;
                });
            return true;
        })
}

function uploadcsv(item) {
    if (item.files === undefined || item.files.length === 0) return;
    var file = item.files[0];
    if (file === undefined) return;
    if (confirm(`Confirm import for file: ${file.name}`)) {
        var formData = new FormData();
        formData.append('file', file);
        fetch("http://localhost:5225/transactions/upload-csv", {
            method: "POST",
            body: formData
        })
            .then(function () {
                fetchTransactionsAndPopulateList()
                    .then(function() {
                        refreshTransactions();
                    });
            })
    }
    item.value = "";
}

fetchTransactionsAndPopulateList()
    .then(function() {
        refreshTransactions();
    });
