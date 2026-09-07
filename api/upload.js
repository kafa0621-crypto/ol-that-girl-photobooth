import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dataUrl } = req.body || {};
    const match = typeof dataUrl === 'string' && dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Missing or invalid dataUrl' });
    }

    const contentType = match[1];
    const ext = contentType === 'image/png' ? 'png' : 'jpg';
    const buffer = Buffer.from(match[2], 'base64');

    // Vercel's platform payload limit is 4.5MB regardless of any bodyParser
    // config, so keep the composed image compressed (JPEG) on the client.
    if (buffer.length > 4.3 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image too large' });
    }

    const blob = await put(`4cut/ol-that-girl-${Date.now()}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('upload error', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
