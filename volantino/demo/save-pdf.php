<?php


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $pdf_content = file_get_contents($_FILES['pdf_content']['tmp_name']);

    $save_path = 'Volantino_digitale.pdf';

    if (file_exists($save_path)) { unlink($save_path); }

    file_put_contents($save_path, $pdf_content);

    echo 'PDF salvato con successo nella stessa cartella del file PHP.';
} else {
    
    http_response_code(405);
    echo 'Metodo non consentito';
}



?>
