import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ObjectUploaderProps {
  maxFileSize?: number;
  onComplete?: (imageUrl: string) => void;
  buttonClassName?: string;
  children: ReactNode;
  token: string;
}

/**
 * A simplified file upload component for product images.
 * 
 * Features:
 * - File selection with drag and drop support
 * - Image preview
 * - Upload progress indication
 * - Direct upload to cloud storage
 * 
 * @param props - Component props
 * @param props.maxFileSize - Maximum file size in bytes (default: 5MB)
 * @param props.onComplete - Callback function called when upload is complete
 * @param props.buttonClassName - Optional CSS class name for the button
 * @param props.children - Content to be rendered inside the button
 * @param props.token - Authentication token for API calls
 */
export function ObjectUploader({
  maxFileSize = 5242880, // 5MB default
  onComplete,
  buttonClassName,
  children,
  token,
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      alert(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      // Get upload URL from server
      const uploadResponse = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await uploadResponse.json();

      // Upload file directly to cloud storage
      const uploadResult = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file');
      }

      // Convert uploaded URL to public serving URL
      const url = new URL(uploadURL);
      const pathParts = url.pathname.split('/');
      const objectPath = pathParts.slice(2).join('/');
      const publicUrl = `/public-objects/${objectPath}`;

      onComplete?.(publicUrl);
      setPreview(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-image-file"
      />
      
      <Button 
        type="button" 
        onClick={handleButtonClick}
        className={buttonClassName}
        disabled={isUploading}
        data-testid="button-upload-image"
      >
        {isUploading ? 'Uploading...' : children}
      </Button>

      {preview && (
        <div className="mt-2">
          <img 
            src={preview}
            alt="Upload preview" 
            className="max-w-32 max-h-32 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
}