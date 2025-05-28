import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from './Button';
import { Input } from './Input';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
  bucket: string;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  bucket,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ['image/*']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onUploadComplete(publicUrl);
    } catch (error) {
      const message = (error as Error).message;
      setUploadError(message);
      onError?.(message);
    } finally {
      setIsUploading(false);
    }
  }, [bucket, onUploadComplete, onError]);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    try {
      // Validate URL
      const url = new URL(imageUrl);
      
      // Basic image URL validation
      if (!acceptedFileTypes.some(type => 
        type === '*/*' || 
        url.pathname.toLowerCase().endsWith('.jpg') ||
        url.pathname.toLowerCase().endsWith('.jpeg') ||
        url.pathname.toLowerCase().endsWith('.png') ||
        url.pathname.toLowerCase().endsWith('.gif')
      )) {
        throw new Error('Invalid image URL. Please provide a direct link to an image file.');
      }

      setPreview(imageUrl);
      onUploadComplete(imageUrl);
      setUploadError(null);
    } catch (error) {
      const message = 'Please enter a valid image URL';
      setUploadError(message);
      onError?.(message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false
  });

  const clearPreview = () => {
    setPreview(null);
    setImageUrl('');
    setUploadError(null);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Button
          variant={uploadMethod === 'file' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
          leftIcon={<Upload size={16} />}
        >
          Upload File
        </Button>
        <Button
          variant={uploadMethod === 'url' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          leftIcon={<LinkIcon size={16} />}
        >
          Image URL
        </Button>
      </div>

      {uploadMethod === 'url' ? (
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            leftIcon={<LinkIcon size={16} />}
            fullWidth
          />
          <Button type="submit" size="sm" fullWidth>
            Use Image URL
          </Button>
        </form>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
            }`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag & drop a file here, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {uploadError}
        </p>
      )}
    </div>
  );
};