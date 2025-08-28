# Security Policy

## 🔒 Security Overview

Live JS takes security seriously. This document outlines our security measures and how to report security vulnerabilities.

## Security Measures

### Code Execution Security
- **JavaScript execution sandboxing** - Code runs in isolated environment
- **Timeout protection** - Prevents infinite loops and long-running processes
- **Memory and CPU limits** - Resource usage is controlled and limited
- **Input/output sanitization** - All user inputs are properly sanitized
- **Process isolation** - Each execution runs in a separate process

### Web Application Security
- **CORS** properly configured to prevent unauthorized access
- **Content Security Policy** implemented
- **XSS protection** through input sanitization
- **CSRF protection** for state-changing operations
- **Secure headers** implemented (HSTS, X-Frame-Options, etc.)

### Data Protection
- **No persistent storage** of user code on servers
- **Local storage only** for user preferences
- **No sensitive data collection**
- **Encrypted connections** (HTTPS/WSS)

## Limitations and Restrictions

### Execution Environment
- System module imports are restricted
- Limited file system access
- Network access is controlled
- Execution in isolated environment
- Resource usage monitoring

### Known Limitations
- Code execution timeout: 30 seconds maximum
- Memory limit: 128MB per execution
- No access to system files or directories
- Limited to standard JavaScript APIs

## Reporting Security Vulnerabilities

### How to Report
If you discover a security vulnerability, please report it responsibly:

1. **Email**: Send details to [security@live-js.com](mailto:security@live-js.com)
2. **GitHub**: Create a private security advisory
3. **Include**: Detailed description, steps to reproduce, and potential impact

### What to Include
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)
- Your contact information

### Response Timeline
- **Initial response**: Within 24 hours
- **Assessment**: Within 72 hours
- **Fix deployment**: Within 7 days for critical issues
- **Public disclosure**: After fix is deployed and tested

## Security Best Practices for Users

### When Using Live JS
- Don't execute untrusted code from unknown sources
- Be cautious with code that makes network requests
- Avoid sharing sensitive information in code
- Use the platform responsibly

### When Sharing Code
- Review code before sharing publicly
- Don't include API keys, passwords, or secrets
- Be mindful of intellectual property
- Consider the audience when sharing

## Security Updates

### Update Policy
- Security patches are prioritized and deployed quickly
- Users are notified of security updates through:
  - GitHub releases
  - Security advisories
  - Platform notifications

### Supported Versions
- Only the latest version receives security updates
- Users are encouraged to use the latest deployment
- Legacy versions are not supported

## Contact Information

- **Security Email**: [security@live-js.com](mailto:security@live-js.com)
- **General Issues**: [GitHub Issues](https://github.com/zkjon/live-js/issues)
- **Security Advisories**: [GitHub Security](https://github.com/zkjon/live-js/security)

---

**Thank you for helping keep Live JS secure! 🔒**