import React, { useState } from "react";
import type { KycDocUploaderProps } from "../types";

export const KycDocUploader = React.forwardRef<HTMLDivElement, KycDocUploaderProps>(
  (
    {
      title = "Identity Document Upload",
      description = "Upload government-issued ID card or passport (PNG, JPG, PDF up to 10MB)",
      acceptedFormats = ".jpg,.jpeg,.png,.pdf",
      maxSizeMb = 10,
      onFileSelect,
      onFileRemove,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFileName(file.name);
        onFileSelect?.(file);
      }
    };

    const handleRemove = () => {
      setSelectedFileName(null);
      onFileRemove?.();
    };

    const classes = ["fc-kyc-doc-uploader", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Identity Document Upload"}
        {...props}
      >
        <div className="fc-kyc-doc-uploader__header">
          <h3 className="fc-kyc-doc-uploader__title">{title}</h3>
          <p className="fc-kyc-doc-uploader__subtitle">{description}</p>
        </div>

        {selectedFileName ? (
          <div className="fc-kyc-doc-uploader__preview">
            <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📄 {selectedFileName}
            </span>
            <button
              type="button"
              className="fc-kyc-doc-uploader__remove-btn"
              onClick={handleRemove}
              aria-label={`Remove file ${selectedFileName}`}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="fc-kyc-doc-uploader__dropzone" tabIndex={0} role="button" aria-label="Upload document dropzone">
            <input
              type="file"
              accept={acceptedFormats}
              onChange={handleFileChange}
              className="fc-kyc-doc-uploader__input-hidden"
              aria-label="Upload document input"
            />
            <div className="fc-kyc-doc-uploader__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="fc-kyc-doc-uploader__prompt">Click to browse or drag file here</p>
            <p className="fc-kyc-doc-uploader__hint">Max file size: {maxSizeMb}MB</p>
          </div>
        )}
      </div>
    );
  },
);

KycDocUploader.displayName = "KycDocUploader";
export default KycDocUploader;
