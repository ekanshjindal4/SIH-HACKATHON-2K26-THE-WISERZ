"use client";

import { useEffect, useMemo, useState } from "react";

type ProviderStatus = "Active" | "Inactive";

type Provider = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  status: ProviderStatus;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const emptyForm = {
  name: "",
  specialty: "",
  hospital: "",
  location: "",
  status: "Active" as ProviderStatus,
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // LOAD DOCTORS FROM SUPABASE
  // ==========================================

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/doctors`);

      if (!response.ok) {
        throw new Error("Failed to load doctors");
      }

      const data = await response.json();

      setProviders(data);
    } catch (error) {
      console.error("Failed to load providers:", error);
      setError("Unable to load providers from server.");
    } finally {
      setIsLoading(false);
    }
  };

  // LOAD WHEN PAGE OPENS
  useEffect(() => {
    loadProviders();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProviders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return providers;
    }

    return providers.filter((provider) => {
      return (
        provider.name.toLowerCase().includes(searchText) ||
        provider.specialty.toLowerCase().includes(searchText) ||
        provider.hospital.toLowerCase().includes(searchText) ||
        provider.location.toLowerCase().includes(searchText) ||
        provider.status.toLowerCase().includes(searchText)
      );
    });
  }, [providers, search]);

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  const showSuccessMessage = (message: string) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.specialty.trim() ||
      !form.hospital.trim() ||
      !form.location.trim()
    ) {
      return "Please fill in all required fields.";
    }

    if (!/^[a-zA-Z.\s]+$/.test(form.name.trim())) {
      return "Doctor name can contain only letters, spaces and dots.";
    }

    if (form.name.trim().length < 4) {
      return "Doctor name is too short.";
    }

    if (form.specialty.trim().length < 3) {
      return "Please enter a valid specialty.";
    }

    if (form.hospital.trim().length < 3) {
      return "Please enter a valid hospital name.";
    }

    if (form.location.trim().length < 2) {
      return "Please enter a valid location.";
    }

    const duplicate = providers.some((provider) => {
      if (provider.id === editingId) {
        return false;
      }

      return (
        provider.name.trim().toLowerCase() ===
        form.name.trim().toLowerCase()
      );
    });

    if (duplicate) {
      return "A doctor with this name already exists.";
    }

    return "";
  };

  // ==========================================
  // ADD / EDIT DOCTOR
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const doctorData = {
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        hospital: form.hospital.trim(),
        location: form.location.trim(),
        status: form.status,
      };

      // ======================================
      // EDIT DOCTOR
      // ======================================

      if (editingId !== null) {
        const response = await fetch(
          `${API_URL}/api/doctors/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorData),
          }
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.error || "Failed to update doctor"
          );
        }

        const updatedDoctor = await response.json();

        setProviders((currentProviders) =>
          currentProviders.map((provider) =>
            provider.id === editingId
              ? updatedDoctor
              : provider
          )
        );

        showSuccessMessage(
          "Doctor updated successfully."
        );
      }

      // ======================================
      // ADD DOCTOR
      // ======================================

      else {
        const response = await fetch(
          `${API_URL}/api/doctors`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorData),
          }
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.error || "Failed to add doctor"
          );
        }

        const newDoctor = await response.json();

        setProviders((currentProviders) => [
          ...currentProviders,
          newDoctor,
        ]);

        showSuccessMessage(
          "Doctor added successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error("Save doctor error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving doctor."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (provider: Provider) => {
    setForm({
      name: provider.name,
      specialty: provider.specialty,
      hospital: provider.hospital,
      location: provider.location,
      status: provider.status,
    });

    setEditingId(provider.id);
    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE DOCTOR
  // ==========================================

  const handleDelete = async (id: number) => {
    const provider = providers.find(
      (item) => item.id === id
    );

    if (!provider) {
      setError("Doctor not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${provider.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/providers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.error || "Failed to delete doctor"
        );
      }

      // Remove from screen
      setProviders((currentProviders) =>
        currentProviders.filter(
          (item) => item.id !== id
        )
      );

      showSuccessMessage(
        `${provider.name} deleted successfully.`
      );
    } catch (error) {
      console.error("Delete doctor error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete doctor."
      );
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const toggleStatus = async (provider: Provider) => {
    const newStatus =
      provider.status === "Active"
        ? "Inactive"
        : "Active";

    try {
      const response = await fetch(
        `${API_URL}/api/doctors/${provider.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: provider.name,
            specialty: provider.specialty,
            hospital: provider.hospital,
            location: provider.location,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedDoctor = await response.json();

      setProviders((currentProviders) =>
        currentProviders.map((item) =>
          item.id === provider.id
            ? updatedDoctor
            : item
        )
      );

      showSuccessMessage(
        "Doctor status updated."
      );
    } catch (error) {
      console.error(error);
      setError("Unable to update doctor status.");
    }
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>
        <div>
          <p style={styles.breadcrumb}>
            Admin / Providers
          </p>

          <h1 style={styles.title}>
            Provider Management
          </h1>

          <p style={styles.subtitle}>
            Manage doctors registered in MedIndia Care.
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={openAddForm}
        >
          + Add Provider
        </button>
      </header>

      {/* SUCCESS */}

      {success && (
        <div style={styles.successMessage}>
          ✓ {success}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div style={styles.errorMessage}>
          ⚠ {error}

          <button
            style={styles.dismissButton}
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <div style={styles.formHeader}>
            <div>
              <h2 style={styles.formTitle}>
                {editingId !== null
                  ? "Edit Provider"
                  : "Add New Provider"}
              </h2>

              <p style={styles.formSubtitle}>
                Enter doctor information below.
              </p>
            </div>

            <button
              type="button"
              style={styles.closeButton}
              onClick={resetForm}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              <div>
                <label style={styles.label}>
                  Doctor Name *
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>
                  Specialty *
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Cardiology"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specialty: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>
                  Hospital *
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="MedIndia Hospital"
                  value={form.hospital}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hospital: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>
                  Location *
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="New Delhi"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div>
  <label style={styles.label}>
    Status
  </label>

  <select
    style={styles.input}
    value="Active"
    disabled
  >
    <option value="Active">Active</option>
  </select>
</div>

            </div>

            <div style={styles.formActions}>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={resetForm}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.saveButton}
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Provider"
                  : "Add Provider"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* SEARCH */}

      <div style={styles.searchCard}>

        <div>
          <h2 style={styles.sectionTitle}>
            Providers
          </h2>

          <p style={styles.countText}>
            {isLoading
              ? "Loading..."
              : `${filteredProviders.length} provider${
                  filteredProviders.length !== 1
                    ? "s"
                    : ""
                } found`}
          </p>
        </div>

        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search provider, specialty, hospital..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* TABLE */}

      <div style={styles.tableCard}>

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>
                  Provider
                </th>

                <th style={styles.th}>
                  Specialty
                </th>

                <th style={styles.th}>
                  Hospital
                </th>

                <th style={styles.th}>
                  Location
                </th>

                <th style={styles.th}>
                  Status
                </th>

                <th style={styles.th}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {isLoading ? (

                <tr>
                  <td
                    colSpan={6}
                    style={styles.emptyState}
                  >
                    Loading doctors...
                  </td>
                </tr>

              ) : filteredProviders.length > 0 ? (

                filteredProviders.map(
                  (provider) => (

                    <tr key={provider.id}>

                      <td style={styles.td}>
                        <div
                          style={
                            styles.providerInfo
                          }
                        >
                          <div
                            style={styles.avatar}
                          >
                            {provider.name
                              .replace(
                                "Dr. ",
                                ""
                              )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {provider.name}
                          </strong>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {provider.specialty}
                      </td>

                      <td style={styles.td}>
                        {provider.hospital}
                      </td>

                      <td style={styles.td}>
                        {provider.location}
                      </td>

                      <td style={styles.td}>

                        <button
                          onClick={() =>
                            toggleStatus(provider)
                          }
                         type="button"
    style={styles.activeStatus}
                        >
                          {provider.status}
                        </button>

                      </td>

                      <td style={styles.td}>

                        <div
                          style={
                            styles.actionButtons
                          }
                        >

                          <button
                            style={
                              styles.editButton
                            }
                            onClick={() =>
                              handleEdit(
                                provider
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            style={
                              styles.deleteButton
                            }
                            onClick={() =>
                              handleDelete(
                                provider.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan={6}
                    style={styles.emptyState}
                  >
                    <div
                      style={styles.emptyIcon}
                    >
                      🔍
                    </div>

                    <strong>
                      No providers found
                    </strong>

                    <p>
                      Try another search term.
                    </p>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* BACK */}

      <button
        style={styles.backButton}
        onClick={() => {
          window.location.href = "/admin";
        }}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles: Record<
  string,
  React.CSSProperties
> = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "35px",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  breadcrumb: {
    color: "#2563eb",
    fontSize: "13px",
    margin: "0 0 8px",
  },

  title: {
    fontSize: "30px",
    margin: 0,
  },

  subtitle: {
    color: "#7b8495",
    marginTop: "7px",
  },

  addButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },

  successMessage: {
    background: "#eaf8ef",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    padding: "13px 16px",
    borderRadius: "9px",
    marginBottom: "20px",
  },

  errorMessage: {
    background: "#fff1f2",
    color: "#dc2626",
    border: "1px solid #fecdd3",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dismissButton: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "#dc2626",
    cursor: "pointer",
  },

  formCard: {
    background: "#ffffff",
    border: "1px solid #e5e9f0",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "20px",
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  formTitle: {
    margin: 0,
    fontSize: "20px",
  },

  formSubtitle: {
    margin: "5px 0 0",
    color: "#7b8495",
    fontSize: "13px",
  },

  closeButton: {
    border: "none",
    background: "#f1f3f6",
    borderRadius: "8px",
    width: "35px",
    height: "35px",
    cursor: "pointer",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dce1e8",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
  },

  cancelButton: {
    border: "1px solid #d9dee7",
    background: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  saveButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  searchCard: {
    background: "#ffffff",
    border: "1px solid #e5e9f0",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  countText: {
    margin: "5px 0 0",
    color: "#7b8495",
    fontSize: "13px",
  },

  searchInput: {
    width: "350px",
    maxWidth: "100%",
    border: "1px solid #dce1e8",
    borderRadius: "9px",
    padding: "12px 15px",
    fontSize: "14px",
    outline: "none",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e5e9f0",
    borderRadius: "15px",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    background: "#f8fafc",
    padding: "15px",
    textAlign: "left",
    fontSize: "12px",
    color: "#687386",
    borderBottom:
      "1px solid #e5e9f0",
  },

  td: {
    padding: "15px",
    borderBottom:
      "1px solid #edf0f4",
    fontSize: "13px",
  },

  providerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#eaf1ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  activeStatus: {
    border: "none",
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  inactiveStatus: {
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  actionButtons: {
    display: "flex",
    gap: "7px",
  },

  editButton: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 11px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteButton: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "7px 11px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px",
    color: "#7b8495",
  },

  emptyIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  backButton: {
    marginTop: "20px",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
  },
};