

let registerForm = document.forms.register;

console.log(registerForm.elements.name.value);
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch('/register', {
        method: 'POST',
        headers: {
                    "Content-Type": "application/json"
                },
        body: JSON.stringify({
            name: registerForm.elements.name.value,
            email: registerForm.elements.email.value,
            password: registerForm.elements.password.value,
        })
    });

    switch (response.status) {
        case 201:
            let res = await response.json();
            error_notification.innerText = 'hi ' + res.name + ', you successfully registered, and go ';
            let a = document.createElement('a');
            a.setAttribute('href', '/login');
            a.textContent = 'Login in';
            error_notification.append(a);
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