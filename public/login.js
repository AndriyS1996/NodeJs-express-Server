
let loginForm = document.forms.login;

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch('/login', {
        method: 'POST',
        headers: {
                    "Content-Type": "application/json"
                },
        body: JSON.stringify({
            email: loginForm.elements.email.value,
            password: loginForm.elements.password.value,
        })
    });

    switch (response.status) {
        case 200:
            let redirectPath = await response.text();
            window.location = redirectPath;
            break;
        case 400:
            let res1 = await response.text();
            error_notification.innerText = res1;
            break;
        case 500:
            error_notification.innerText = 'Some problems with db, try to register a bit later'
            break;
    }
}