<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $sessionId = $data['session_id'];

    // Connessione al database
    $conn = new mysqli("localhost", "username", "password", "database");

    if ($conn->connect_error) {
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    // Verifica se esiste già uno storico con quel session_id
    $stmt = $conn->prepare("SELECT id FROM storico_sessioni_db WHERE session_id = ?");
    $stmt->bind_param("s", $sessionId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Lo storico esiste già, recuperiamo il suo id
        $row = $result->fetch_assoc();
        $storicoId = $row['id'];

        // Itera sui prodotti nel JSON
        foreach ($data['prodotti'] as $productKey => $product) {
            // Verifica se il prodotto esiste già per la sessione corrente
            $stmtCheckProdotto = $conn->prepare("SELECT id FROM prodotti_storico WHERE storico_id = ? AND indice_prodotto = ?");
            $stmtCheckProdotto->bind_param("is", $storicoId, $productKey);
            $stmtCheckProdotto->execute();
            $resultProdotto = $stmtCheckProdotto->get_result();

            if ($resultProdotto->num_rows == 0) {
                // Il prodotto non esiste ancora, quindi inseriscilo nel database
                $stmtProdotti = $conn->prepare("INSERT INTO prodotti_storico (storico_id, indice_prodotto, product_key, nome_prodotto, descrizione, euro, centesimi, immagine, pagina) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmtProdotti->bind_param(
                    "isssdssss",
                    $storicoId,
                    $productKey,  // indice_prodotto (prodotto1, prodotto2, ecc.)
                    $product['productKey'],
                    $product['nomeProdotto'],
                    $product['Descrizione'],
                    $product['Euro'],
                    $product['Centesimi'],
                    $product['Immagine'],
                    $product['Pagina']
                );
                $stmtProdotti->execute();
            } else {
                // Prodotto già esistente, non aggiungere nuovamente
                echo json_encode(['message' => "Prodotto già esistente: $productKey"]);
            }
        }

        echo json_encode(['success' => 'Prodotti elaborati con successo']);
    } else {
        // Inserisci un nuovo storico nel database
        $userId = 1; // ID utente (può essere passato dai dati della richiesta o dalla sessione)
        $tipoVolantino = $data['tipo_volantino'];
        $descrizione = $data['descrizione'];

        $stmtInsert = $conn->prepare("INSERT INTO storico_sessioni_db (user_id, tipo_volantino, descrizione, session_id) VALUES (?, ?, ?, ?)");
        $stmtInsert->bind_param("isss", $userId, $tipoVolantino, $descrizione, $sessionId);
        $stmtInsert->execute();
        $storicoId = $stmtInsert->insert_id;

        // Inserisci tutti i prodotti nel database per il nuovo storico
        foreach ($data['prodotti'] as $productKey => $product) {
            $stmtProdotti = $conn->prepare("INSERT INTO prodotti_storico (storico_id, indice_prodotto, product_key, nome_prodotto, descrizione, euro, centesimi, immagine, pagina) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtProdotti->bind_param(
                "isssdssss",
                $storicoId,
                $productKey,  // indice_prodotto (prodotto1, prodotto2, ecc.)
                $product['productKey'],
                $product['nomeProdotto'],
                $product['Descrizione'],
                $product['Euro'],
                $product['Centesimi'],
                $product['Immagine'],
                $product['Pagina']
            );
            $stmtProdotti->execute();
        }

        echo json_encode(['success' => 'Nuovo storico creato con successo']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
