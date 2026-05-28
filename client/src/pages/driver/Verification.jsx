import { useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../passenger/PassengerDashboard";
import { ShieldCheck, Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function Verification() {
  const { user, refreshUser } = useAuth();
  const [cnicImage, setCnicImage] = useState(user?.cnicImage || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.cnicImage || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnicImage(reader.result);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function submit(event) {
    event.preventDefault();
    if (!cnicImage) {
      return setMessage("Please select a CNIC file or enter a reference first.");
    }
    try {
      setLoading(true);
      setMessage("");
      await api.post("/verification/upload", { cnicImage });
      await refreshUser();
      setMessage("Verification submitted and instantly approved!");
    } catch (err) {
      setMessage(err.message || "Failed to submit verification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageTitle title="Driver Verification" copy="Submit your CNIC or identity documentation to activate ride publishing capabilities." />

      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "1.25rem" }}>
            <div className="card-body p-4 text-center">
              <div 
                className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
                style={{ 
                  backgroundColor: user?.isVerified ? "rgba(44, 125, 105, 0.1)" : "rgba(242, 193, 78, 0.1)",
                  color: user?.isVerified ? "#2c7d69" : "#f2c14e"
                }}
              >
                <ShieldCheck size={40} className={user?.isVerified ? "" : "animate-pulse"} />
              </div>
              <h4 className="fw-bold mb-2">Verification Status</h4>
              <p className="text-muted small px-3">
                {user?.isVerified 
                  ? "Your identity document is fully verified. You can now publish and manage active rides." 
                  : "Submit your CNIC document below to immediately activate your driver profile."}
              </p>
              
              <div 
                className="badge px-4 py-2.5 rounded-pill fw-semibold border-0 text-capitalize mb-2" 
                style={{ 
                  backgroundColor: user?.isVerified ? "rgba(44, 125, 105, 0.15)" : "rgba(242, 193, 78, 0.15)", 
                  color: user?.isVerified ? "#1f5c4c" : "#a07000",
                  fontSize: "0.9rem" 
                }}
              >
                {user?.isVerified ? "Verified Partner" : "Verification Required"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {message && (
            <div className="alert alert-success border-0 shadow-sm px-4 py-3 mb-4 d-flex align-items-center gap-3" style={{ borderRadius: "0.75rem" }}>
              <CheckCircle size={24} className="text-success flex-shrink-0" />
              <div className="fw-medium text-success-emphasis">{message}</div>
            </div>
          )}

          <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
            <div className="card-body p-4">
              <h3 className="h5 fw-bold mb-3 text-dark">Identity Documentation</h3>
              
              {user?.isVerified ? (
                <div className="text-center py-4">
                  <CheckCircle className="text-success mb-3" size={48} />
                  <h5 className="fw-bold text-success">Profile Fully Verified</h5>
                  <p className="text-muted small mx-auto" style={{ maxWidth: "400px" }}>
                    Your CNIC is active and registered. If you need to make changes to your documentation in the future, please contact support.
                  </p>
                  {previewUrl && (
                    <div className="mt-4 p-2 bg-light rounded-3 d-inline-block border">
                      <div className="small text-muted mb-2 fw-semibold"><FileText size={14} className="me-1" /> CNIC Document Registered</div>
                      <img 
                        src={previewUrl} 
                        alt="CNIC Reference" 
                        className="rounded img-fluid border shadow-sm" 
                        style={{ maxHeight: "160px", objectFit: "contain" }} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <form className="vstack gap-4" onSubmit={submit}>
                  <div>
                    <label className="form-label fw-semibold text-secondary small mb-2"><FileText size={16} className="me-1" /> Select CNIC File</label>
                    <div 
                      className="border border-2 border-dashed rounded-3 p-4 text-center bg-light position-relative"
                      style={{ transition: "all 0.2s ease-in-out", cursor: "pointer" }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = "#198754"}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = "#dee2e6"}
                    >
                      <input 
                        type="file" 
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
                        style={{ cursor: "pointer" }}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Upload size={36} className="text-secondary mb-2 opacity-60" />
                      <p className="mb-1 fw-bold text-dark small">Drag and drop your CNIC image here</p>
                      <p className="text-muted small mb-0">or click to browse local files (PNG, JPG up to 5MB)</p>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="small text-muted mb-2 fw-semibold">Preview Selected File</div>
                      <div className="position-relative d-inline-block">
                        <img 
                          src={previewUrl} 
                          alt="CNIC Preview" 
                          className="rounded img-fluid border shadow-sm" 
                          style={{ maxHeight: "180px", objectFit: "contain" }} 
                        />
                      </div>
                    </div>
                  )}

                  <div className="vstack gap-2">
                    <label className="form-label fw-semibold text-secondary small mb-0"><FileText size={16} className="me-1" /> Custom CNIC Reference / Link (Optional)</label>
                    <input 
                      className="form-control px-3 py-2.5" 
                      style={{ borderRadius: "0.5rem" }}
                      placeholder="Or paste a CNIC image URL or reference..." 
                      value={cnicImage.startsWith("data:") ? "" : cnicImage} 
                      onChange={(e) => {
                        setCnicImage(e.target.value);
                        setPreviewUrl(e.target.value);
                      }} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success px-4 py-2.5 fw-bold d-inline-flex align-items-center justify-content-center gap-2 align-self-start"
                    disabled={loading}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} style={{ animation: "spin 1s linear infinite" }} />
                        Verifying Profile...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Submit & Auto-Verify Profile
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
