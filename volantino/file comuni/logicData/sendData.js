// Genera un session ID unico al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
    console.log("Session ID generato:", sessionId);
});


// Funzione per inviare i dati a un file PHP
export function inviaStoricoAlServer(jsonData) {
    // Recupera il session ID dalla sessionStorage
    const sessionId = sessionStorage.getItem('session_id');
    
    if (!sessionId) {
        console.error('Session ID non trovato!');
        return;
    }

    // Aggiungi il session_id ai dati JSON da inviare al server
    const dataToSend = {
        session_id: sessionId,
        ...jsonData // Aggiungi tutti i dati del JSON originale
    };

    // Invia i dati al server
    fetch('./storicoHandler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'invio dei dati al server.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Risposta dal server:', data);
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}
