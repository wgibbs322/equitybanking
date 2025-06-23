let adminUnlocked = false;

function checkAdminCode() {
    const code = document.getElementById('admin-code').value;
    const panel = document.getElementById('admin-panel');
    if (code === "3237") {
        panel.style.display = 'block';
        adminUnlocked = true;
        showDeleteButtons();
    } else {
        panel.style.display = 'none';
        adminUnlocked = false;
        hideDeleteButtons();
    }
}

function showDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'inline-block');
}
function hideDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'none');
}

async function handleAdminTransaction(e) {
    e.preventDefault();
    const description = document.getElementById('admin-description').value;
    const amount = parseFloat(document.getElementById('admin-amount').value);
    const status = document.getElementById('admin-status').value;
    const customBalance = document.getElementById('admin-balance').value;

    const balance = customBalance ? parseFloat(customBalance) : (status === "Completed" ? amount : "Pending");

    try {
        const res = await fetch('https://equitybackend.onrender.com/api/addadmin/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount, status, balance })
        });
        const data = await res.json();
        if (res.ok) {
            const table = document.querySelector('.transaction-history tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date().toLocaleDateString()}</td>
                <td>${description}</td>
                <td>${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}</td>
                <td>${balance}</td>
                <td><button class="delete-btn" onclick="deleteTransaction('${data._id}', this)">Delete</button></td>
            `;
            table.appendChild(row);
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTransaction(id, btn) {
    try {
        const res = await fetch(`https://equitybackend.onrender.com/api/addadmin/transactions/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            btn.closest('tr').remove();
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleBalanceUpdate(e) {
    e.preventDefault();
    const newBalance = parseFloat(document.getElementById('update-balance-input').value);
    try {
        const res = await fetch('https://equitybackend.onrender.com/api/addadmin/balance', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newBalance })
        });
        if (res.ok) {
            document.getElementById('balance-amount').textContent = `$${newBalance.toFixed(2)}`;
        }
    } catch (err) {
        console.error(err);
    }
}
