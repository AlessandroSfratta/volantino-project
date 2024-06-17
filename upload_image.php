<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileSize = $_FILES['image']['size'];
        $fileType = $_FILES['image']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');
        if (in_array($fileExtension, $allowedfileExtensions)) {

            $uploadFileDir = 'immagini_utente/'; 
            $currentDate = date('d_m_Y');
            $newFileName = $currentDate . '_' . $fileName;

            $i = 1;
            while (file_exists($uploadFileDir . $newFileName)) {
                $newFileName = $currentDate . '_' . $i . '_' . $fileName;
                $i++;
            }

            $dest_path = $uploadFileDir . $newFileName;

            if(move_uploaded_file($fileTmpPath, $dest_path)) {
                $domain = $_SERVER['HTTP_HOST'];

                    // work
                // $imageUrl = "http://$domain/$dest_path";

                //test
                $imageUrl = "https://$domain/volantino-project/$dest_path";


                
                $response = array(
                    'success' => true,
                    'url' => $imageUrl
                );
            } else {
                $response = array(
                    'success' => false,
                    'message' => 'Errore durante lo spostamento del file caricato.'
                );
            }
        } else {
            $response = array(
                'success' => false,
                'message' => 'Tipo di file non supportato.'
            );
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Nessun file caricato o errore durante il caricamento.'
        );
    }

    echo json_encode($response);
} else {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}
?>
