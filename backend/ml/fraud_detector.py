import re

FRAUD_KEYWORDS = [
    "guaranteed salary", "no experience needed", "work from home unlimited",
    "earn money fast", "easy money", "get rich", "instant approval",
    "no interview", "immediate joining", "urgently hiring 1000",
    "send your bank details", "registration fee", "pay to apply",
    "deposit required", "mlm", "multi level marketing", "pyramid",
    "click the link below", "whatsapp only", "no qualification required",
    "earn per day", "lakhs per month guaranteed", "free laptop",
    "government approved", "100% job guarantee", "foreign job",
    "overseas placement", "no age limit no qualification"
]

TRUSTED_SIGNALS = [
    "responsibilities", "requirements", "qualifications", "benefits",
    "about the company", "about us", "apply through", "job description",
    "experience required", "skills required", "education", "location",
    "salary range", "full time", "part time", "contract", "permanent",
    "team", "department", "report to", "interview process"
]

SUSPICIOUS_PATTERNS = [
    r'\b\d+,\d+\s*per\s*day\b',
    r'\b\d+\s*lakhs?\s*per\s*month\b',
    r'whatsapp\s*:?\s*\+?\d+',
    r'call\s*:?\s*\+?\d{10}',
    r'no\s*experience\s*required',
    r'work\s*from\s*home\s*\d+',
    r'earn\s*\d+\s*per\s*hour',
]

def detect_fraud(job_description: str) -> dict:
    text_lower = job_description.lower()
    
    fraud_found = []
    for keyword in FRAUD_KEYWORDS:
        if keyword in text_lower:
            fraud_found.append(keyword)
    
    trusted_found = []
    for signal in TRUSTED_SIGNALS:
        if signal in text_lower:
            trusted_found.append(signal)
    
    pattern_matches = []
    for pattern in SUSPICIOUS_PATTERNS:
        matches = re.findall(pattern, text_lower)
        if matches:
            pattern_matches.extend(matches)
    
    word_count = len(job_description.split())
    
    fraud_score = 0
    fraud_score += len(fraud_found) * 15
    fraud_score += len(pattern_matches) * 20
    fraud_score -= len(trusted_found) * 10
    
    if word_count < 50:
        fraud_score += 20
    elif word_count > 200:
        fraud_score -= 10
    
    if not any(char.isupper() for char in job_description):
        fraud_score += 10
    
    fraud_score = max(0, min(100, fraud_score))
    genuine_score = 100 - fraud_score
    
    if fraud_score >= 60:
        verdict = "FRAUDULENT"
        color = "#ef4444"
        message = "⚠️ This job posting shows multiple signs of fraud! Do NOT share personal information or pay any fees."
    elif fraud_score >= 30:
        verdict = "SUSPICIOUS"
        color = "#f97316"
        message = "⚠️ This job posting has some suspicious elements. Research the company carefully before applying."
    else:
        verdict = "GENUINE"
        color = "#22c55e"
        message = "✅ This job posting appears to be legitimate. Always verify the company independently."
    
    return {
        "verdict": verdict,
        "fraud_score": fraud_score,
        "genuine_score": genuine_score,
        "color": color,
        "message": message,
        "fraud_signals": fraud_found[:5],
        "trusted_signals": trusted_found[:5],
        "word_count": word_count
    }