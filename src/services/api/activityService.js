import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all activities
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "type" } },
        { field: { Name: "description" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "contactId" } },
        { field: { Name: "dealId" } }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_Activity', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error fetching activities:", error.message);
      toast.error("Failed to fetch activities");
    }
    return [];
  }
};

// Get activity by ID
export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "type" } },
        { field: { Name: "description" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "contactId" } },
        { field: { Name: "dealId" } }
      ]
    };

    const response = await apperClient.getRecordById('app_Activity', parseInt(id), params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching activity with ID ${id}:`, error.message);
      toast.error("Failed to fetch activity");
    }
    return null;
  }
};

// Get activities by contact ID
export const getByContactId = async (contactId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "type" } },
        { field: { Name: "description" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "contactId" } },
        { field: { Name: "dealId" } }
      ],
      where: [
        {
          FieldName: "contactId",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_Activity', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities by contact ID:", error?.response?.data?.message);
    } else {
      console.error("Error fetching activities by contact ID:", error.message);
    }
    return [];
  }
};

// Get activities by deal ID
export const getByDealId = async (dealId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "type" } },
        { field: { Name: "description" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "contactId" } },
        { field: { Name: "dealId" } }
      ],
      where: [
        {
          FieldName: "dealId",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_Activity', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities by deal ID:", error?.response?.data?.message);
    } else {
      console.error("Error fetching activities by deal ID:", error.message);
    }
    return [];
  }
};

// Create new activity
export const create = async (activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Name: activityData.Name || activityData.type || "Activity",
        Tags: activityData.Tags || "",
        Owner: activityData.Owner || "",
        type: activityData.type,
        description: activityData.description,
        timestamp: activityData.timestamp || new Date().toISOString(),
        contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
        dealId: activityData.dealId ? parseInt(activityData.dealId) : null
      }]
    };

    const response = await apperClient.createRecord('app_Activity', payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Activity created successfully!");
        return successfulRecords[0].data;
      }
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating activity:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error creating activity:", error.message);
      toast.error("Failed to create activity");
    }
    return null;
  }
};

// Update activity
export const update = async (id, activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: activityData.Name || activityData.type || "Activity",
        Tags: activityData.Tags || "",
        Owner: activityData.Owner || "",
        type: activityData.type,
        description: activityData.description,
        timestamp: activityData.timestamp || new Date().toISOString(),
        contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
        dealId: activityData.dealId ? parseInt(activityData.dealId) : null
      }]
    };

    const response = await apperClient.updateRecord('app_Activity', payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success("Activity updated successfully!");
        return successfulUpdates[0].data;
      }
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating activity:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error updating activity:", error.message);
      toast.error("Failed to update activity");
    }
    return null;
  }
};

// Delete activity
export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('app_Activity', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success("Activity deleted successfully!");
        return true;
      }
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting activity:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } else {
      console.error("Error deleting activity:", error.message);
      toast.error("Failed to delete activity");
    }
    return false;
  }
};