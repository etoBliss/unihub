import path from 'path';

export const verifyAssetMimetypeAndMetadata = (req, res, next) => {
  if (!req.file) {
    req.approvalStatus = 'rejected';
    req.rejectionReason = 'No file payload attached';
    req.verifiedBy = 'Verification_Bot';
    return next();
  }

  // Audit 1: File size audit (empty check)
  if (req.file.size === 0) {
    req.approvalStatus = 'rejected';
    req.rejectionReason = 'Empty document payload detected';
    req.verifiedBy = 'Verification_Bot';
    return next();
  }

  // Audit 2: File extension and Mime check (Limit to PDF/DOCX)
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.docx', '.doc'];

  const isValidMime = allowedMimeTypes.includes(req.file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (!isValidMime || !isValidExt) {
    req.approvalStatus = 'rejected';
    req.rejectionReason = `Unsupported document type (${ext}). Only PDF, DOC, and DOCX formats are valid.`;
    req.verifiedBy = 'Verification_Bot';
    return next();
  }

  // Audit 3: Executable scripting scan
  const bufferHeader = req.file.buffer.slice(0, 4096).toString('utf-8');
  const threatPatterns = [
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    'eval(',
    'unescape(',
    'document.cookie',
    'window.location'
  ];

  const containsThreat = threatPatterns.some(pattern => bufferHeader.toLowerCase().includes(pattern));

  if (containsThreat) {
    req.approvalStatus = 'rejected';
    req.rejectionReason = 'Security scan failed: Scripting code signatures detected inside asset payload.';
    req.verifiedBy = 'Verification_Bot';
    return next();
  }

  // Audits passed
  req.approvalStatus = 'approved';
  req.verifiedBy = 'Verification_Bot';
  next();
};
