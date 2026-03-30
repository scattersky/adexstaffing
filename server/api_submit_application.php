<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

// Supports both JSON and multipart/form-data payloads.
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
  $data = $_POST;
} else {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body']);
    exit;
  }
}

$requiredFields = ['first_name', 'last_name', 'email', 'phone', 'years_experience', 'job_id'];
foreach ($requiredFields as $field) {
  if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => "Missing required field: {$field}"]);
    exit;
  }
}

$firebaseUid = $data['firebase_uid'] ?? '';
$jobId = (string)$data['job_id'];
$jobTitle = $data['job_title'] ?? '';
$jobCity = $data['job_city'] ?? '';
$jobState = $data['job_state'] ?? '';
$firstName = trim((string)$data['first_name']);
$lastName = trim((string)$data['last_name']);
$email = trim((string)$data['email']);
$phone = trim((string)$data['phone']);
$yearsExperience = trim((string)$data['years_experience']);
$statesLicensure = $data['states_licensure'] ?? [];
$statesLicensureCsv = $data['states_licensure_csv'] ?? '';
$resumeUrl = trim((string)($data['resume_url'] ?? ''));
$additionalFilesUrls = $data['additional_files_urls'] ?? [];
$referrerName = $data['referrer_name'] ?? '';
$uploadedNewResume = false;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Invalid email']);
  exit;
}

if (is_array($statesLicensure) && $statesLicensureCsv === '') {
  $statesLicensureCsv = implode(',', $statesLicensure);
}

if (is_string($additionalFilesUrls)) {
  $decodedFiles = json_decode($additionalFilesUrls, true);
  if (is_array($decodedFiles)) {
    $additionalFilesUrls = $decodedFiles;
  } else {
    $additionalFilesUrls = [];
  }
}

$additionalFilesJson = is_array($additionalFilesUrls) ? json_encode($additionalFilesUrls) : json_encode([]);

if (isset($_FILES['resume_file']) && ($_FILES['resume_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
  if ($_FILES['resume_file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Resume upload failed']);
    exit;
  }

  $maxBytes = 10 * 1024 * 1024; // 10MB
  if (($_FILES['resume_file']['size'] ?? 0) > $maxBytes) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Resume file must be 10MB or less']);
    exit;
  }

  $originalName = $_FILES['resume_file']['name'] ?? '';
  $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
  $allowedExtensions = ['pdf', 'doc', 'docx', 'rtf', 'txt'];

  if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid resume file type']);
    exit;
  }

  $uploadDir = __DIR__ . '/resumes';
  if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create resumes directory']);
    exit;
  }

  $safeBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
  $fileName = $safeBaseName . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $extension;
  $targetPath = $uploadDir . '/' . $fileName;

  if (!move_uploaded_file($_FILES['resume_file']['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded resume']);
    exit;
  }

  $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? '';
  $baseUrl = getenv('APP_BASE_URL');
  if (!$baseUrl) {
    $baseUrl = $host ? ($scheme . '://' . $host) : '';
  }
  $baseUrl = rtrim($baseUrl, '/');
  $resumeUrl = $baseUrl . '/resumes/' . $fileName;
  $uploadedNewResume = true;
}

if ($resumeUrl === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Resume file or resume URL is required']);
  exit;
}

// Update these DB values for your server.
$dbHost = 'localhost';
$dbName = 'your_database_name';
$dbUser = 'your_database_user';
$dbPass = 'your_database_password';

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($mysqli->connect_error) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Database connection error',
    'error' => $mysqli->connect_error
  ]);
  exit;
}

$mysqli->set_charset('utf8mb4');

$sql = "INSERT INTO job_applications (
  firebase_uid,
  job_id,
  job_title,
  job_city,
  job_state,
  first_name,
  last_name,
  email,
  phone,
  years_experience,
  states_licensure,
  resume_url,
  additional_files_urls,
  referrer_name,
  created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Database prepare error',
    'error' => $mysqli->error
  ]);
  $mysqli->close();
  exit;
}

$stmt->bind_param(
  'ssssssssssssss',
  $firebaseUid,
  $jobId,
  $jobTitle,
  $jobCity,
  $jobState,
  $firstName,
  $lastName,
  $email,
  $phone,
  $yearsExperience,
  $statesLicensureCsv,
  $resumeUrl,
  $additionalFilesJson,
  $referrerName
);

if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Database insert error',
    'error' => $stmt->error
  ]);
  $stmt->close();
  $mysqli->close();
  exit;
}

$applicationId = (int)$mysqli->insert_id;

// If a new resume was uploaded for a known user, sync it to the users table too.
if ($uploadedNewResume && $firebaseUid !== '') {
  $userStmt = $mysqli->prepare("UPDATE users SET resume_url = ?, years_experience = ? WHERE firebase_uid = ? LIMIT 1");
  if ($userStmt) {
    $userStmt->bind_param('sss', $resumeUrl, $yearsExperience, $firebaseUid);
    $userStmt->execute();
    $userStmt->close();
  }
}

$stmt->close();
$mysqli->close();

echo json_encode([
  'success' => true,
  'status' => 'success',
  'message' => 'Application saved successfully',
  'application_id' => $applicationId,
  'resume_url' => $resumeUrl
]);
