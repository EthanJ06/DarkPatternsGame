<?php
// Shared database connection and helpers for pre-survey.php and post-survey.php.

// Set to true while testing to see PHP and database errors on screen.
// Keep it false when participants are using the survey.
const DEBUG = false;

// The database login lives outside the public web folder so it can't be downloaded.
const DB_CONFIG = __DIR__ . '/../../../database-darkpatterns.ini';

error_reporting(E_ALL);
ini_set('display_errors', DEBUG ? '1' : '0');
ini_set('log_errors', '1');
mysqli_report(MYSQLI_REPORT_OFF); // every result is checked below
session_start();

// Shows an error page to the participant and stops.
// $detail (e.g. the database error) is written to the server's error log, and shown on screen only when DEBUG is on.
function fail($message, $detail = null) {
    if ($detail !== null) error_log('[dark-patterns survey] ' . $detail);
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Survey error</title></head>'
       . '<body style="font-family:Arial,sans-serif;max-width:640px;margin:60px auto;padding:0 16px;">'
       . '<h1 style="font-size:22px;">Something went wrong</h1><p>' . htmlspecialchars($message) . '</p>'
       . (DEBUG && $detail !== null ? '<pre style="white-space:pre-wrap;color:#a00">' . htmlspecialchars($detail) . '</pre>' : '')
       . '<p><a href="javascript:history.back()">Go back to the survey</a></p></body></html>';
    exit;
}

// Reads a POST field; missing or empty fields (e.g. a hidden "which option" question) become NULL.
function post($key) {
    return isset($_POST[$key]) && trim($_POST[$key]) !== '' ? trim($_POST[$key]) : null;
}

// Opens the database connection, or shows an error page.
function db_connect($screenshotWhich) {
    $config = @parse_ini_file(DB_CONFIG);
    if (!$config || !isset($config['host'], $config['user'], $config['pass'], $config['db'])) {
        fail("The survey isn't set up correctly. Please screenshot your filled-in $screenshotWhich and email it to your instructor.",
             'Could not read database settings from ' . DB_CONFIG);
    }
    $con = @new mysqli($config['host'], $config['user'], $config['pass'], $config['db']);
    if ($con->connect_error) {
        fail("Could not connect to the database. Please screenshot your filled-in $screenshotWhich and email it to your instructor.",
             'Connect error: ' . $con->connect_error);
    }
    $con->set_charset('utf8mb4');
    return $con;
}

// The answer fields shared by both surveys, in the same order as the table columns.
const SURVEY_FIELDS = [
    'likertRecognize',
    'likertResponsibility',
    'likertEngagement',
    'likertUnethical',
    'likertAvoid',
    'likertConcerns',
    'likertRedesign',
    'likertRecognizeAI',
    'likertResponsibilityAI',
    'scenarioDifficult',     'scenarioDifficultWhy',
    'scenarioSubscribe',     'scenarioSubscribeWhy',
    'scenarioWarranty',      'scenarioWarrantyWhy',
    'scenarioAdvertisement', 'scenarioAdvertisementWhy',
    'scenarioReject',        'scenarioRejectWhy',
    'scenarioUrgency',       'scenarioUrgencyWhy',
    'scenarioManipulateAI',  'scenarioManipulateAIWhy',
    'scenarioSponsoredAI',   'scenarioSponsoredAIWhy',
    'scenarioDifficultAI',   'scenarioDifficultAIWhy',
];

// Inserts one row. Returns true, or the MySQL error number on failure.
function insert_row($con, $table, $fields, $values, $types) {
    $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES ('
         . implode(', ', array_fill(0, count($fields), '?')) . ')';
    $stmt = $con->prepare($sql);
    if (!$stmt) return ['errno' => $con->errno, 'error' => $con->error];
    $stmt->bind_param($types, ...$values);
    $ok = $stmt->execute();
    $result = $ok ? true : ['errno' => $stmt->errno, 'error' => $stmt->error];
    $stmt->close();
    return $result;
}
