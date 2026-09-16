<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
session_start();

$config = parse_ini_file('/home/sites/35a/5/5ebeb37313/database-darkpatterns.ini');
$con = new mysqli($config['host'], $config['user'], $config['pass'], $config['db']);

// ── Retrieve player ID from session or cookie ────────────────────────────────
if (isset($_SESSION['id'])) {
    $playerID = $_SESSION['id'];
} else if (isset($_COOKIE['id'])) {
    $playerID = $_COOKIE['id'];
} else {
    echo '<script>alert("Session expired. Please complete the pre-survey before submitting the post-survey.")</script>';
    exit;
}

// ── Insert into postsurvey ───────────────────────────────────────────────────
$stmt = $con->prepare("
    INSERT INTO postsurvey (
        id,
        likertRecognize,
        likertResponsibility,
        likertEngagement,
        likertUnethical,
        likertAvoid,
        likertConcerns,
        likertRedesign,
        scenarioSubscribe,
        scenarioSubscribeWhy,
        scenarioReject,
        scenarioRejectWhy,
        scenarioAdvertisement,
        scenarioAdvertisementWhy,
        scenarioWarranty,
        scenarioWarrantyWhy,
        scenarioUrgency,
        scenarioUrgencyWhy,
        scenarioConcerns,
        scenarioConcernsWhy,
        questionThoughts,
        questionImprovement,
        comments
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "issssssssssssssssssssss",
    $playerID,
    $likertRecognize,
    $likertResponsibility,
    $likertEngagement,
    $likertUnethical,
    $likertAvoid,
    $likertConcerns,
    $likertRedesign,
    $scenarioSubscribe,
    $scenarioSubscribeWhy,
    $scenarioReject,
    $scenarioRejectWhy,
    $scenarioAdvertisement,
    $scenarioAdvertisementWhy,
    $scenarioWarranty,
    $scenarioWarrantyWhy,
    $scenarioUrgency,
    $scenarioUrgencyWhy,
    $scenarioConcerns,
    $scenarioConcernsWhy,
    $questionThoughts,
    $questionImprovement,
    $comments
);

$likertRecognize          = $_POST['likertRecognize'];
$likertResponsibility     = $_POST['likertResponsibility'];
$likertEngagement         = $_POST['likertEngagement'];
$likertUnethical          = $_POST['likertUnethical'];
$likertAvoid              = $_POST['likertAvoid'];
$likertConcerns           = $_POST['likertConcerns'];
$likertRedesign           = $_POST['likertRedesign'];
$scenarioSubscribe        = $_POST['scenarioSubscribe'];
$scenarioSubscribeWhy     = $_POST['scenarioSubscribeWhy'];
$scenarioReject           = $_POST['scenarioReject'];
$scenarioRejectWhy        = $_POST['scenarioRejectWhy'];
$scenarioAdvertisement    = $_POST['scenarioAdvertisement'];
$scenarioAdvertisementWhy = $_POST['scenarioAdvertisementWhy'];
$scenarioWarranty         = $_POST['scenarioWarranty'];
$scenarioWarrantyWhy      = $_POST['scenarioWarrantyWhy'];
$scenarioUrgency          = $_POST['scenarioUrgency'];
$scenarioUrgencyWhy       = $_POST['scenarioUrgencyWhy'];
$scenarioConcerns         = $_POST['scenarioConcerns'];
$scenarioConcernsWhy      = $_POST['scenarioConcernsWhy'];
$questionThoughts         = $_POST['questionThoughts'];
$questionImprovement      = $_POST['questionImprovement'];
$comments                 = $_POST['comments'];

$stmt->execute();
$stmt->close();

// ── Verify insert ────────────────────────────────────────────────────────────
$postsurveyCheck = mysqli_query($con, "SELECT id FROM postsurvey WHERE id = '$playerID' LIMIT 1");

if (!$postsurveyCheck || mysqli_num_rows($postsurveyCheck) == 0) {
    echo '<script>alert("Post-survey database insertion failed. Please screenshot your filled-in post-survey and email it to your instructor.")</script>';
}

$con->close();
header("Location: /placeholder-thank-you.html");
exit;
?>
