emailjs.init("I94Plb7JWPDHKXocV");

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_3fspgrn', 'template_wk1mjas', this)
        .then(function() {
            alert('Sent!');
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        }, function(error) {
            alert('Error:\n ' + JSON.stringify(error));
        });
});
