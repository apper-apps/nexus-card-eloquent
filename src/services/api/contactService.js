import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all contacts
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "firstName" } },
        { field: { Name: "lastName" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "lifecycleStage" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "updatedAt" } },
        { field: { Name: "notes" } },
        { field: { Name: "companyId" } }
      ],
      orderBy: [
        {
          fieldName: "createdAt",
          sorttype: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_contact', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching contacts:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error fetching contacts:", error.message);
      toast.error("Failed to fetch contacts");
    }
    return [];
  }
};

// Get contact by ID
export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "firstName" } },
        { field: { Name: "lastName" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "lifecycleStage" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "updatedAt" } },
        { field: { Name: "notes" } },
        { field: { Name: "companyId" } }
      ]
    };

    const response = await apperClient.getRecordById('app_contact', parseInt(id), params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching contact with ID ${id}:`, error.message);
      toast.error("Failed to fetch contact");
    }
    return null;
  }
};

// Create new contact
export const create = async (contactData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Name: contactData.Name || `${contactData.firstName} ${contactData.lastName}`,
        Tags: contactData.Tags || "",
        Owner: contactData.Owner || "",
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || "",
        lifecycleStage: contactData.lifecycleStage || "Lead",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: contactData.notes || "",
        companyId: contactData.companyId ? parseInt(contactData.companyId) : null
      }]
    };

    const response = await apperClient.createRecord('app_contact', payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Contact created successfully!");
        return successfulRecords[0].data;
      }
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating contact:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error creating contact:", error.message);
      toast.error("Failed to create contact");
    }
    return null;
  }
};

// Update contact
export const update = async (id, contactData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: contactData.Name || `${contactData.firstName} ${contactData.lastName}`,
        Tags: contactData.Tags || "",
        Owner: contactData.Owner || "",
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || "",
        lifecycleStage: contactData.lifecycleStage || "Lead",
        updatedAt: new Date().toISOString(),
        notes: contactData.notes || "",
        companyId: contactData.companyId ? parseInt(contactData.companyId) : null
      }]
    };

    const response = await apperClient.updateRecord('app_contact', payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success("Contact updated successfully!");
        return successfulUpdates[0].data;
      }
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating contact:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error updating contact:", error.message);
      toast.error("Failed to update contact");
    }
    return null;
  }
};

// Delete contact
export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('app_contact', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success("Contact deleted successfully!");
        return true;
      }
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting contact:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error deleting contact:", error.message);
      toast.error("Failed to delete contact");
    }
    return false;
  }
};

// Bulk delete multiple contacts
export const bulkDelete = async (contactIds) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: contactIds.map(id => parseInt(id))
    };

    const response = await apperClient.deleteRecord('app_contact', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete contacts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success(`${successfulDeletions.length} contacts deleted successfully!`);
        return true;
      }
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting contacts:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error deleting contacts:", error.message);
      toast.error("Failed to delete contacts");
    }
    return false;
  }
};

// Bulk update lifecycle stage
export const bulkUpdateLifecycleStage = async (contactIds, lifecycleStage) => {
  try {
    const apperClient = getApperClient();
    
    const records = contactIds.map(id => ({
      Id: parseInt(id),
      lifecycleStage: lifecycleStage,
      updatedAt: new Date().toISOString()
    }));

    const payload = { records };

    const response = await apperClient.updateRecord('app_contact', payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update contacts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`${successfulUpdates.length} contacts updated successfully!`);
        return successfulUpdates.map(result => result.data);
      }
    }

    return [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating contacts:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error updating contacts:", error.message);
      toast.error("Failed to update contacts");
    }
    return [];
  }
};