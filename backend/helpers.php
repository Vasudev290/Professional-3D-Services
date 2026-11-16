<?php
/**
 * Security & Validation Helper Functions
 * Task 3 Backend Implementation
 */

if (!defined('APP_SECURE')) {
    define('APP_SECURE', true);
}

/**
 * Sanitizes plain text input by stripping tags, special chars and extra whitespace
 */
function sanitize_string(?string $input): string {
    if ($input === null) return '';
    $clean = trim($input);
    $clean = strip_tags($clean);
    return htmlspecialchars($clean, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Validates and sanitizes email address
 */
function sanitize_email(?string $email): ?string {
    if ($email === null) return null;
    $clean = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    return filter_var($clean, FILTER_VALIDATE_EMAIL) ? $clean : null;
}

/**
 * Validates international and domestic phone number formats (7 to 15 digits)
 */
function validate_phone(?string $phone): bool {
    if (empty($phone)) return false;
    $digitsOnly = preg_replace('/[^0-9]/', '', $phone);
    return (strlen($digitsOnly) >= 7 && strlen($digitsOnly) <= 15);
}

/**
 * Defends against Email Header Injection attacks (\r, \n, %0a, %0d)
 */
function sanitize_header_value(string $value): string {
    return preg_replace('/[\r\n\t%]+/', ' ', trim($value));
}

/**
 * Sends a structured JSON response and terminates script execution
 */
function send_json_response(string $status, string $message, array $errors = [], int $httpCode = 200): void {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'status'  => $status,
        'message' => $message,
        'errors'  => $errors,
        'timestamp' => time()
    ]);
    exit;
}
