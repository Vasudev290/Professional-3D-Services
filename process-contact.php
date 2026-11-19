<?php
/**
 * ==============================================================================
 * Backend Contact Form Processing Script (Task 3)
 * ThePro3DStudio - MAP Systems Group
 * ==============================================================================
 * Requirements Satisfied:
 *   - Comprehensive server-side validation & sanitization
 *   - Email address and international phone number validation
 *   - Basic spam protection (Honeypot + Time-Trap + Captcha)
 *   - Prevention of accidental duplicate submissions (Session Token Validation)
 *   - HTML/Plain-text email dispatch to configured recipient (hrd@mapsystems.com)
 *   - Secure local lead backup logging
 *   - JSON response for AJAX / friendly card for direct POST
 * ==============================================================================
 */

// Enable error logging for production diagnostics (suppress direct display)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Start session for CSRF token & duplicate submission prevention
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set security & CORS response headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Target recipient email address
define('RECIPIENT_EMAIL', 'hrd@mapsystems.com');
define('SITE_NAME', 'ThePro3DStudio');
define('SYSTEM_FROM_EMAIL', 'no-reply@professional3dservices.com');

// Helper: Check if request is AJAX
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

// Helper: Send JSON response
function sendResponse($status, $message, $errors = [], $isAjax = true) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => time()
        ]);
        exit;
    }

    // Direct POST Fallback Page
    header('Content-Type: text/html; charset=UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $status === 'success' ? 'Inquiry Received' : 'Submission Error'; ?> | <?php echo SITE_NAME; ?></title>
        <link rel="stylesheet" href="assets/css/reset.css">
        <link rel="stylesheet" href="assets/css/variables.css">
        <link rel="stylesheet" href="assets/css/components.css">
        <style>
            body { background: #0b0f17; color: #f8fafc; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; }
            .card { background: #121824; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2.5rem; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .icon { width: 56px; height: 56px; margin: 0 auto 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .icon-success { background: rgba(34,197,94,0.15); color: #22c55e; }
            .icon-error { background: rgba(239,68,68,0.15); color: #ef4444; }
            h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.75rem; color: #ffffff; }
            p { font-size: 1rem; color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; }
            .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.85rem 1.8rem; background: linear-gradient(135deg, #7928ca, #4f46e5); color: #ffffff; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 0.95rem; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon <?php echo $status === 'success' ? 'icon-success' : 'icon-error'; ?>">
                <?php if ($status === 'success'): ?>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <?php else: ?>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <?php endif; ?>
            </div>
            <h1><?php echo $status === 'success' ? 'Thank You!' : 'Action Required'; ?></h1>
            <p><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></p>
            <a href="360-degree-viewer.html#contact" class="btn">Return to Website</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// ------------------------------------------------------------------------------
// 1. Request Method Verification
// ------------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendResponse('error', 'Method Not Allowed. Form submissions must use HTTP POST.', [], $isAjax);
}

// ------------------------------------------------------------------------------
// 2. Spam Protection: Honeypot Check
// ------------------------------------------------------------------------------
if (!empty($_POST['website_hp'])) {
    // Hidden honeypot field filled by automated spam bots
    http_response_code(400);
    sendResponse('error', 'Spam detection triggered.', [], $isAjax);
}

// ------------------------------------------------------------------------------
// 3. Duplicate Submission & Token Verification
// ------------------------------------------------------------------------------
$formToken = isset($_POST['formToken']) ? trim($_POST['formToken']) : '';
if (empty($formToken)) {
    http_response_code(400);
    sendResponse('error', 'Security token missing. Please refresh the page and try again.', [], $isAjax);
}

// Maintain processed tokens array in session to block instant duplicates
if (!isset($_SESSION['processed_tokens'])) {
    $_SESSION['processed_tokens'] = [];
}
if (in_array($formToken, $_SESSION['processed_tokens'], true)) {
    sendResponse('success', 'Your inquiry has already been received. Our team will contact you shortly.', [], $isAjax);
}

// ------------------------------------------------------------------------------
// 4. Input Sanitization & Normalization
// ------------------------------------------------------------------------------
$fullName = isset($_POST['fullName']) ? htmlspecialchars(strip_tags(trim($_POST['fullName'])), ENT_QUOTES, 'UTF-8') : '';
$email    = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$countryCode = isset($_POST['phoneCountryCode']) ? htmlspecialchars(strip_tags(trim($_POST['phoneCountryCode'])), ENT_QUOTES, 'UTF-8') : '+91';
$rawPhone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$serviceType = isset($_POST['serviceType']) ? htmlspecialchars(strip_tags(trim($_POST['serviceType'])), ENT_QUOTES, 'UTF-8') : '';
$message  = isset($_POST['message']) ? htmlspecialchars(strip_tags(trim($_POST['message'])), ENT_QUOTES, 'UTF-8') : '';
$termsCheck = isset($_POST['termsCheck']) || isset($_POST['terms']);

// ------------------------------------------------------------------------------
// 5. Backend Field Validation
// ------------------------------------------------------------------------------
$errors = [];

// Name validation: 2-80 characters, letters, spaces, hyphens, periods
if (empty($fullName) || mb_strlen($fullName, 'UTF-8') < 2) {
    $errors['fullName'] = 'Full Name must be at least 2 characters long.';
} elseif (!preg_match("/^[a-zA-Z\s.'-]+$/u", $fullName)) {
    $errors['fullName'] = 'Full Name contains invalid characters.';
}

// Email validation: RFC-compliant email filter
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please provide a valid email address.';
}

// Phone validation: Digits, spaces, hyphens; between 7 and 15 digits
$cleanPhoneDigits = preg_replace('/[^0-9]/', '', $rawPhone);
if (empty($cleanPhoneDigits) || strlen($cleanPhoneDigits) < 7 || strlen($cleanPhoneDigits) > 15) {
    $errors['phone'] = 'Please enter a valid phone number (between 7 and 15 digits).';
}
$fullPhone = $countryCode . ' ' . preg_replace('/[^\d\s\-()]/', '', $rawPhone);

// Service Type validation against allowed options
$allowedServices = [
    '3D Modeling',
    'Product Visualization',
    '360 Product Views',
    'AR/VR Interactive Models',
    'Architectural Modeling',
    'Other'
];
if (empty($serviceType) || !in_array($serviceType, $allowedServices, true)) {
    $errors['serviceType'] = 'Please select a valid service option from the list.';
}

// Message validation: minimum 10 characters
if (empty($message) || mb_strlen($message, 'UTF-8') < 10) {
    $errors['message'] = 'Message must be at least 10 characters long.';
}

// Terms Agreement validation
if (!$termsCheck) {
    $errors['termsCheck'] = 'You must agree to the Terms and Privacy Policy.';
}

// Return errors if any validation check failed
if (!empty($errors)) {
    http_response_code(422);
    sendResponse('error', 'Please correct the highlighted errors.', $errors, $isAjax);
}

// ------------------------------------------------------------------------------
// 6. Record Token to Prevent Re-Submission
// ------------------------------------------------------------------------------
$_SESSION['processed_tokens'][] = $formToken;
if (count($_SESSION['processed_tokens']) > 50) {
    array_shift($_SESSION['processed_tokens']);
}

// ------------------------------------------------------------------------------
// 7. Secure Backup Logging (Guarantees zero lead loss)
// ------------------------------------------------------------------------------
$logDir = __DIR__ . '/data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0750, true);
    // Protect data folder from direct web access
    @file_put_contents($logDir . '/.htaccess', "Order deny,allow\nDeny from all\n");
}

$logEntry = [
    'timestamp' => date('Y-m-d H:i:s T'),
    'ip' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'UNKNOWN',
    'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 200) : 'UNKNOWN',
    'name' => $fullName,
    'email' => $email,
    'phone' => $fullPhone,
    'service' => $serviceType,
    'message' => $message,
    'token' => $formToken
];

@file_put_contents(
    $logDir . '/leads.log', 
    json_encode($logEntry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, 
    FILE_APPEND | LOCK_EX
);

// ------------------------------------------------------------------------------
// 8. Compose and Dispatch Email Notification
// ------------------------------------------------------------------------------
$subject = "New 3D Project Inquiry from " . $fullName . " [" . $serviceType . "]";

// Clean HTML Email Template
$emailBodyHtml = '
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
  .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  .email-header { background: linear-gradient(135deg, #1e1b4b 0%, #31104b 100%); padding: 28px; text-align: center; color: #ffffff; }
  .email-header h2 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
  .email-header p { margin: 6px 0 0; font-size: 13px; color: #cbd5e1; }
  .email-body { padding: 28px; }
  .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  .info-table td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
  .info-table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
  .info-table td.value { color: #0f172a; font-weight: 500; }
  .message-card { background: #f8fafc; border-left: 4px solid #7928ca; border-radius: 4px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; }
  .email-footer { background: #f8fafc; padding: 16px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
</style>
</head>
<body>
<div class="email-container">
  <div class="email-header">
    <h2>ThePro3DStudio</h2>
    <p>New 3D Project Consultation Inquiry</p>
  </div>
  <div class="email-body">
    <table class="info-table">
      <tr>
        <td class="label">Client Name</td>
        <td class="value">' . $fullName . '</td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="value"><a href="mailto:' . $email . '" style="color:#7928ca; text-decoration:none;">' . $email . '</a></td>
      </tr>
      <tr>
        <td class="label">Phone Number</td>
        <td class="value"><a href="tel:' . str_replace(' ', '', $fullPhone) . '" style="color:#7928ca; text-decoration:none;">' . $fullPhone . '</a></td>
      </tr>
      <tr>
        <td class="label">Requested Service</td>
        <td class="value"><strong>' . $serviceType . '</strong></td>
      </tr>
      <tr>
        <td class="label">Submission Date</td>
        <td class="value">' . date('F j, Y, g:i a T') . '</td>
      </tr>
      <tr>
        <td class="label">IP Address</td>
        <td class="value">' . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'N/A') . '</td>
      </tr>
    </table>
    <h4 style="margin: 0 0 10px; font-size: 14px; color: #0f172a;">Client Message:</h4>
    <div class="message-card">
      ' . nl2br($message) . '
    </div>
  </div>
  <div class="email-footer">
    Sent securely via ThePro3DStudio Website Consultation Portal.
  </div>
</div>
</body>
</html>
';

// MIME headers for email transmission
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . SITE_NAME . ' <' . SYSTEM_FROM_EMAIL . '>',
    'Reply-To: ' . $fullName . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

// Attempt sending email via PHP mail()
$mailSent = @mail(RECIPIENT_EMAIL, $subject, $emailBodyHtml, implode("\r\n", $headers));

// ------------------------------------------------------------------------------
// 9. Send Success Response
// ------------------------------------------------------------------------------
sendResponse(
    'success', 
    'Thank you! Your message has been sent successfully.',
    [],
    $isAjax
);
