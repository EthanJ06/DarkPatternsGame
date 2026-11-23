<?php
// Saves the pre-survey: one row in `players` and one in `presurvey`, then sends the participant to the game.
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Please fill out the pre-survey form first.');
}

$con = db_connect('pre-survey');

// Both rows are saved together: if the second insert fails, the first is undone,
// so there are never players without a pre-survey.
$con->begin_transaction();

// ── Insert into players ──────────────────────────────────────────────────────
$playerFields = ['first_name', 'last_name', 'email', 'age', 'gender', 'race', 'school', 'course', 'major'];
$playerValues = array_map('post', $playerFields);

$result = insert_row($con, 'players', $playerFields, $playerValues, str_repeat('s', count($playerValues)));
if ($result !== true) {
    $con->rollback();
    fail('Your answers could not be saved. Please go back, screenshot your filled-in pre-survey, and email it to your instructor.',
         'players insert failed: ' . $result['error']);
}
$playerID = $con->insert_id;

// ── Insert into presurvey ────────────────────────────────────────────────────
$surveyValues = array_map('post', SURVEY_FIELDS);

$result = insert_row($con, 'presurvey',
    array_merge(['playerid'], SURVEY_FIELDS),
    array_merge([$playerID], $surveyValues),
    'i' . str_repeat('s', count($surveyValues)));
if ($result !== true) {
    $con->rollback();
    fail('Your answers could not be saved. Please go back, screenshot your filled-in pre-survey, and email it to your instructor.',
         'presurvey insert failed: ' . $result['error']);
}

$con->commit();
$con->close();

// Remember who this participant is, so the post-survey can be linked to them.
$_SESSION['id'] = $playerID;
setcookie('id', (string) $playerID, [
    'expires'  => time() + 60 * 60 * 24 * 30,
    'path'     => '/',
    'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax',
]);

header('Location: ../index.html');
exit;
