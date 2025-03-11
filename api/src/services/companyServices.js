const Company = require("../models/Company");

exports.createCompany = async (payload) => {
  try {
    const company = await Company.create(payload);
    return { success: true, company };
  } catch (error) {
    let errorMessage = "Error creating company.";

    if (error.code === 11000) {
      errorMessage = "Company name already exists.";
    } else if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    return { success: false, error: error.message, message: errorMessage };
  }
};

exports.getCompanyById = async (companyId) => {
  try {
    const company = await Company.findOne({ companyId }).notDeleted();
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, company };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching company details.",
    };
  }
};

exports.getAllCompanies = async () => {
  try {
    const companies = await Company.find().notDeleted();
    return { success: true, companies };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error fetching companies.",
    };
  }
};

exports.updateCompany = async (companyId, updates) => {
  try {
    const company = await Company.findOneAndUpdate({ companyId }, updates, {
      new: true,
    }).notDeleted();
    if (!company)
      return { success: false, message: "Company not found or deleted" };
    return { success: true, company };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error updating company.",
    };
  }
};

exports.softDeleteCompany = async (companyId) => {
  try {
    const company = await Company.findOneAndUpdate(
      { companyId },
      { isDeleted: true },
      { new: true }
    );
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, message: "Company soft deleted successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting company.",
    };
  }
};

exports.restoreCompany = async (companyId) => {
  try {
    const company = await Company.findOneAndUpdate(
      { companyId },
      { isDeleted: false },
      { new: true }
    );
    if (!company)
      return { success: false, message: "Company not found or already active" };
    return { success: true, message: "Company restored successfully" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error restoring company.",
    };
  }
};

exports.permanentlyDeleteCompany = async (companyId) => {
  try {
    const company = await Company.findOneAndDelete({ companyId });
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, message: "Company permanently deleted" };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Error deleting company permanently.",
    };
  }
};
