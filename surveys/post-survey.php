<?php
// Saves the post-survey as one row in `postsurvey`, linked to the participant from the pre-survey.
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Please fill out the post-survey form first.');
}

// ── Retrieve player ID from session or cookie ────────────────────────────────
if (isset($_SESSION['id'])) {
    $playerID = (int) $_SESSION['id'];
} else if (isset($_COOKIE['id'])) {
    $playerID = (int) $_COOKIE['id'];
} else {
    $playerID = 0;
}
if ($playerID <= 0) {
    fail("We couldn't find your pre-survey. Please complete the pre-survey before submitting the post-survey, using the same browser.");
}

$con = db_connect('post-survey');

// ── Insert into postsurvey ───────────────────────────────────────────────────
$fields = array_merge(SURVEY_FIELDS, ['questionThoughts', 'questionImprovement', 'comments']);
$values = array_map('post', $fields);

$result = insert_row($con, 'postsurvey',
    array_merge(['playerid'], $fields),
    array_merge([$playerID], $values),
    'i' . str_repeat('s', count($values)));
$con->close();

if ($result !== true) {
    if ($result['errno'] === 1062) {
        // Duplicate playerid: this participant already submitted a post-survey.
        header('Location: thank-you.html?already=1');
        exit;
    }
    if ($result['errno'] === 1452) {
        // No matching row in `players` (e.g. an old cookie from a cleared database).
        fail("We couldn't find your pre-survey. Please complete the pre-survey before submitting the post-survey, using the same browser.",
             'postsurvey insert: no player with id ' . $playerID);
    }
    fail('Your answers could not be saved. Please go back, screenshot your filled-in post-survey, and email it to your instructor.',
         'postsurvey insert failed: ' . $result['error']);
}

header('Location: thank-you.html');
exit;
