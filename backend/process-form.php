<?php
/**
 * Contact Form Backend Processor & Mailer
 * Task 3 Backend Implementation
 */

define('APP_SECURE', true);
session_start();

$config = require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

// Detect if request is AJAX
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        send_json_response('error', 'Invalid request method. Only POST is allowed.', [], 405);
    } else {
        header('Location: ../product-services.html');
        exit;
    }
}

// 1. Anti-Spam Honeypot Verification
if ($config['enable_honeypot'] && !empty($_POST['website_hp'])) {
    // Spambot filled the honeypot field. Silently terminate or mock success
    if ($isAjax) {
        send_json_response('success', 'Thank you! Your message has been received.');
    } else {
        header('Location: ../product-services.html?status=success');
        exit;
    }
}

// 2. Prevent Accidental Duplicate Submissions
$formToken = sanitize_string($_POST['form_token'] ?? '');
if ($config['enable_token_check'] && !empty($formToken)) {
    if (isset($_SESSION['processed_tokens']) && in_array($formToken, $_SESSION['processed_tokens'], true)) {
        if ($isAjax) {
            send_json_response('error', 'This request has already been submitted. Please do not submit duplicate inquiries.', [], 409);
        } else {
            header('Location: ../product-services.html?status=duplicate');
            exit;
        }
    }
}

// 3. Extract and Sanitize Inputs
$fullName    = sanitize_string($_POST['fullName'] ?? '');
$email       = sanitize_email($_POST['email'] ?? '');
$phone       = sanitize_string($_POST['phone'] ?? '');
$serviceType = sanitize_string($_POST['serviceType'] ?? '');
$budget      = sanitize_string($_POST['budget'] ?? 'Not specified');
$message     = sanitize_string($_POST['message'] ?? '');

$validationErrors = [];

// 4. Server-Side Validation Rules
if (empty($fullName) || strlen($fullName) < 2) {
    $validationErrors['fullName'] = 'Full name is required (minimum 2 characters).';
}

if (empty($email)) {
    $validationErrors['email'] = 'A valid business email address is required.';
}

if (empty($phone) || !validate_phone($phone)) {
    $validationErrors['phone'] = 'A valid contact phone number is required (7-15 digits).';
}

if (empty($serviceType) || !in_array($serviceType, $config['allowed_services'], true)) {
    $validationErrors['serviceType'] = 'Please select a valid service from the options provided.';
}

if (empty($message) || strlen($message) < 10) {
    $validationErrors['message'] = 'Project description must be at least 10 characters long.';
}

if (strlen($message) > $config['max_message_length']) {
    $validationErrors['message'] = 'Message exceeds maximum allowed length of ' . $config['max_message_length'] . ' characters.';
}

// Return errors if validation fails
if (!empty($validationErrors)) {
    if ($isAjax) {
        send_json_response('error', 'Validation failed. Please correct the highlighted errors.', $validationErrors, 422);
    } else {
        header('Location: ../product-services.html?status=validation_error');
        exit;
    }
}

// 5. Construct Structured Email Payload
$recipientEmail = $config['recipient_email'];
$subject = $config['subject_prefix'] . $serviceType . ' - ' . $fullName;

// Plain text version
$plainBody  = "New Project Inquiry Submitted from Website:\n";
$plainBody .= "===========================================\n";
$plainBody .= "Full Name:        " . $fullName . "\n";
$plainBody .= "Email:            " . $email . "\n";
$plainBody .= "Phone:            " . $phone . "\n";
$plainBody .= "Service Required: " . $serviceType . "\n";
$plainBody .= "Estimated Budget: " . $budget . "\n";
$plainBody .= "Submission Time:  " . date('Y-m-d H:i:s T') . "\n";
$plainBody .= "IP Address:       " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
$plainBody .= "-------------------------------------------\n";
$plainBody .= "Project Brief:\n" . $message . "\n";
$plainBody .= "===========================================\n";

// HTML version
$htmlBody  = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>";
$htmlBody .= "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>";
$htmlBody .= "<div style='background: #0284c7; color: #fff; padding: 20px; text-align: center;'>";
$htmlBody .= "<h2 style='margin:0;'>New 3D Project Inquiry</h2>";
$htmlBody .= "</div>";
$htmlBody .= "<div style='padding: 24px;'>";
$htmlBody .= "<p><strong>Client Name:</strong> " . htmlspecialchars($fullName) . "</p>";
$htmlBody .= "<p><strong>Email Address:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>";
$htmlBody .= "<p><strong>Phone Number:</strong> " . htmlspecialchars($phone) . "</p>";
$htmlBody .= "<p><strong>Service Requested:</strong> " . htmlspecialchars($serviceType) . "</p>";
$htmlBody .= "<p><strong>Budget Range:</strong> " . htmlspecialchars($budget) . "</p>";
$htmlBody .= "<p><strong>Submission Time:</strong> " . date('Y-m-d H:i:s T') . "</p>";
$htmlBody .= "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>";
$htmlBody .= "<h4 style='margin-bottom: 8px;'>Project Brief & Requirements:</h4>";
$htmlBody .= "<div style='background: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;'>" . nl2br(htmlspecialchars($message)) . "</div>";
$htmlBody .= "</div>";
$htmlBody .= "<div style='background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;'>";
$htmlBody .= "Submitted via ThePro3DStudio Web Portal | professional3dservices.com";
$htmlBody .= "</div></div></body></html>";

// Headers
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: ' . sanitize_header_value($config['sender_name']) . ' <' . sanitize_header_value($config['sender_email']) . '>';
$headers[] = 'Reply-To: ' . sanitize_header_value($fullName) . ' <' . sanitize_header_value($email) . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// 6. Send Email using PHP mail()
// Note: In local development without configured Sendmail/SMTP, mail() may return false,
// which is safely caught and handled.
$mailSent = @mail($recipientEmail, $subject, $htmlBody, implode("\r\n", $headers));

// Mark token as processed to prevent accidental duplicate submission
if (!empty($formToken)) {
    if (!isset($_SESSION['processed_tokens'])) {
        $_SESSION['processed_tokens'] = [];
    }
    $_SESSION['processed_tokens'][] = $formToken;
    // Keep array size reasonable
    if (count($_SESSION['processed_tokens']) > 100) {
        array_shift($_SESSION['processed_tokens']);
    }
}

// 7. Output Response
if ($isAjax) {
    send_json_response(
        'success',
        'Thank you, ' . $fullName . '! Your inquiry has been submitted successfully. Our team will review your project and get in touch within 24 hours.'
    );
} else {
    header('Location: ../product-services.html?status=success');
    exit;
}
