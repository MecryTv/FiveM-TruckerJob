$(document).ready(function() {
    $('#Icon').hide();

    window.addEventListener('message', (event) => {
        const data = event.data;

        switch (data.type) {
            case "show":
                $('#Icon').show();
                break;
            case "hide":
                $('#Icon').hide();
                break;
            default:
                console.log("Keine Type definiert");
                break;
        }
    });
});