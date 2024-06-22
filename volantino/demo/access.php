<?php
function checkCredentials($username, $password) {
    // Credenziali fisse
    $correctUsername = "admin";
    $correctPassword = "admin";

    // Controllare le credenziali
    return $username === $correctUsername && $password === $correctPassword;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $inputUsername = $_POST['username'];
    $inputPassword = $_POST['password'];

    $isValid = checkCredentials($inputUsername, $inputPassword);

    // Restituire la risposta JSON
    echo json_encode($isValid);
}

?>