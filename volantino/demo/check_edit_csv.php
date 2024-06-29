<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    // Process the data and add to CSV
    $products = $data['products'];

    // Assume $csvFilePath is the path to your CSV file
    $csvFilePath = './archivio personale.csv';
    $fileHandle = fopen($csvFilePath, 'a');

    if ($fileHandle === false) {
        echo json_encode(['error' => 'Unable to open CSV file']);
        exit;
    }

    foreach ($products as $product) {
        $line = $product['Nome prodotto'] . ';' . $product['immagine'] . "\n";
        fwrite($fileHandle, $line);
    }
    

    fclose($fileHandle);

    echo json_encode(['success' => 'Products added successfully']);
    exit;
}

echo json_encode(['error' => 'Invalid request method']);


?>
