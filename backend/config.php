<?php
/**
 * Contact Form Configuration & Environment Settings
 * Task 3 Backend Implementation
 */

// Strict error reporting for clean code execution
error_reporting(E_ALL);
ini_set('display_errors', '0');

return [
    // Recipient email configuration (As specified in assignment submission guidelines)
    'recipient_email' => 'hrd@mapsystems.com',
    'recipient_name'  => 'MAP Systems HR & Inquiries',
    
    // Sender configuration (Avoid spam flags by sending from domain)
    'sender_email'    => 'no-reply@professional3dservices.com',
    'sender_name'     => 'ThePro3DStudio Web Inquiry',
    
    // Email subject template
    'subject_prefix'  => '[New 3D Project Inquiry] ',
    
    // Security & Spam settings
    'enable_honeypot'      => true,
    'enable_token_check'   => true,
    'max_message_length'   => 5000,
    
    // Whitelist of valid service categories
    'allowed_services' => [
        'White Background Product Renders',
        'Lifestyle & Contextual Scenes',
        '360-Degree Interactive Spins',
        'Augmented Reality (AR) 3D Modeling',
        'Furniture & Decor 3D Rendering',
        'Consumer Electronics & Industrial',
        'Other Custom 3D Services'
    ]
];
