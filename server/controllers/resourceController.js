import Resource from '../models/Resource.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_secret',
});

export const uploadResource = async (req, res) => {
  const { title, courseCode } = req.body;

  try {
    let fileUrl = '';
    let fileType = 'unknown';

    if (req.file) {
      fileType = req.file.mimetype;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      if (cloudName && cloudName !== 'dummy_cloud') {
        const uploadPromise = () => new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'unihub_resources' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
        fileUrl = await uploadPromise();
      } else {
        fileUrl = `/uploads/${Date.now()}-${req.file.originalname}`;
      }
    } else {
      fileUrl = req.body.url || 'https://res.cloudinary.com/dummy-cloud/raw/upload/v1/dummy_document.pdf';
    }

    const approvalStatus = req.approvalStatus || 'pending';
    const verifiedBy = req.verifiedBy || 'Verification_Bot';

    const resource = new Resource({
      courseCode: courseCode || 'GEN101',
      title: title || 'Untitled Course Document',
      url: fileUrl,
      fileType,
      uploadedBy: req.user._id,
      approvalStatus,
      verifiedBy,
    });

    const savedResource = await resource.save();
    const populated = await savedResource.populate('uploadedBy', 'name email matricNumber department level');

    if (approvalStatus === 'rejected') {
      return res.status(200).json({
        message: `Upload processed but rejected by security scanner: ${req.rejectionReason || 'Verification failed.'}`,
        resource: populated
      });
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: `Resource upload failed: ${error.message}` });
  }
};

export const getResources = async (req, res) => {
  const { search } = req.query;

  try {
    // Refactored: Students can ONLY query and download approved assets
    let query = { approvalStatus: 'approved' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name email matricNumber department level')
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: `Fetch resources failed: ${error.message}` });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, approvalStatus: 'approved' })
      .populate('uploadedBy', 'name email matricNumber department level');
      
    if (!resource) {
      return res.status(404).json({ message: 'Approved resource document not found' });
    }
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: `Fetch resource by ID failed: ${error.message}` });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Students can delete only their own uploaded resources
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Unauthorized file deletion action' });
    }

    await resource.deleteOne();
    return res.json({ message: 'Resource record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: `Resource deletion failed: ${error.message}` });
  }
};
