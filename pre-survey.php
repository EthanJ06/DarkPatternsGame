<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
session_start();

$config = parse_ini_file('/home/sites/35a/5/5ebeb37313/database-darkpatterns.ini');
$con = new mysqli($config['host'], $config['user'], $config['pass'], $config['db']);

// ── Insert into players ──────────────────────────────────────────────────────
$stmt = $con->prepare("
    INSERT INTO players (
        first_name,
        last_name,
        email,
        age,
        gender,
        race,
        school,
        course,
        major
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "sssssssss",
    $firstName,
    $lastName,
    $email,
    $age,
    $gender,
    $race,
    $school,
    $course,
    $major
);

$firstName = $_POST['first_name'];
$lastName  = $_POST['last_name'];
$email     = $_POST['email'];
$age       = $_POST['age'];
$gender    = $_POST['gender'];
$race      = $_POST['race'];
$school    = $_POST['school'];
$course    = $_POST['course'];
$major     = $_POST['major'];

$stmt->execute();
$playerID = $con->insert_id;
$_SESSION['id'] = $playerID;
setcookie("id", $playerID, time() + (60 * 60 * 24 * 30));
$stmt->close();

// ── Insert into presurvey ────────────────────────────────────────────────────
$stmt = $con->prepare("
    INSERT INTO presurvey (
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
        scenarioConcernsWhy
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "issssssssssssssssss",
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
    $scenarioConcernsWhy
);

$likertRecognize       = $_POST['likertRecognize'];
$likertResponsibility  = $_POST['likertResponsibility'];
$likertEngagement      = $_POST['likertEngagement'];
$likertUnethical       = $_POST['likertUnethical'];
$likertAvoid           = $_POST['likertAvoid'];
$likertConcerns        = $_POST['likertConcerns'];
$likertRedesign        = $_POST['likertRedesign'];
$scenarioSubscribe     = $_POST['scenarioSubscribe'];
$scenarioSubscribeWhy  = $_POST['scenarioSubscribeWhy'];
$scenarioReject        = $_POST['scenarioReject'];
$scenarioRejectWhy     = $_POST['scenarioRejectWhy'];
$scenarioAdvertisement    = $_POST['scenarioAdvertisement'];
$scenarioAdvertisementWhy = $_POST['scenarioAdvertisementWhy'];
$scenarioWarranty      = $_POST['scenarioWarranty'];
$scenarioWarrantyWhy   = $_POST['scenarioWarrantyWhy'];
$scenarioUrgency       = $_POST['scenarioUrgency'];
$scenarioUrgencyWhy    = $_POST['scenarioUrgencyWhy'];
$scenarioConcerns      = $_POST['scenarioConcerns'];
$scenarioConcernsWhy   = $_POST['scenarioConcernsWhy'];

$stmt->execute();
$stmt->close();

// ── Verify inserts ───────────────────────────────────────────────────────────
$playerCheck    = mysqli_query($con, "SELECT id FROM players WHERE id = '$playerID' LIMIT 1");
$presurveyCheck = mysqli_query($con, "SELECT id FROM presurvey WHERE id = '$playerID' LIMIT 1");

if (!$playerCheck || mysqli_num_rows($playerCheck) == 0) {
    echo '<script>alert("Player database insertion failed. Please return to the previous page, screenshot your filled-in pre-survey, and email it to your instructor.")</script>';
} else if (!$presurveyCheck || mysqli_num_rows($presurveyCheck) == 0) {
    echo '<script>alert("Pre-survey database insertion failed. Please return to the previous page, screenshot your filled-in pre-survey, and email it to your instructor.")</script>';
}

$con->close();
header("Location: ../index.html");
exit;
?>
