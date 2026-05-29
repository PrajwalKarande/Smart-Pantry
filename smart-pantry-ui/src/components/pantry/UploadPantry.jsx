import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Loader2, CheckCircle2 } from 'lucide-react';

export default function UploadPantry({ onUploadText, onUploadImage }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ─── Image Drop Zone ───
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', acceptedFiles[0]);
      await onUploadImage(formData);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
    setUploading(false);
  }, [onUploadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // ─── Text Submit ───
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setUploading(true);
    try {
      await onUploadText(textInput);
      setTextInput('');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Text upload failed:', err);
    }
    setUploading(false);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📤 Upload Pantry Data</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'text'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Text List
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'image'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Image className="w-4 h-4" />
          Photo Upload
        </button>
      </div>

      {/* Text Input Tab */}
      {activeTab === 'text' && (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Enter ingredients, one per line:\n\nTomatoes, 2025-07-20, 5\nChicken breast, 2025-07-15, 2\nRice, 2025-12-01, 3 kg\nOnions, 2025-08-01, 6\nGarlic, 2025-09-15, 10 cloves`}
            rows={8}
            className="input-field font-mono text-sm resize-none"
          />
          <p className="text-[11px] text-gray-500 mt-2 mb-3">
            Format: <code className="bg-gray-100 px-1.5 py-0.5 rounded">Name, Expiry(YYYY-MM-DD), Quantity</code>
          </p>
          <button
            onClick={handleTextSubmit}
            disabled={uploading || !textInput.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Processing...' : 'Parse & Add Items'}
          </button>
        </div>
      )}

      {/* Image Upload Tab */}
      {activeTab === 'image' && (
        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              ) : uploadSuccess ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : (
                <Image className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-700">
                  {uploading
                    ? 'AI is analyzing your image...'
                    : uploadSuccess
                      ? 'Items added successfully!'
                      : isDragActive
                        ? 'Drop your photo here...'
                        : 'Drag & drop a pantry/fridge photo'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {!uploading && !uploadSuccess && 'or click to browse (PNG, JPG up to 10MB)'}
                </p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            📸 AI will identify ingredients from the photo and add them to your pantry
          </p>
        </div>
      )}
    </div>
  );
}