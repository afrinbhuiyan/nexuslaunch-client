const saveUser = async (axiosSecure, user) => {
  try {
    if (!user || !user.email) {
      throw new Error("Invalid user data - missing email");
    }

    // 1. Prepare default user info
    const defaultUserInfo = {
      name: user.displayName || "",
      email: user.email,
      image: user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png",
      role: "user",
      isSubscribed: false,
      uid: user.uid,
      createdAt: new Date().toISOString()
    };

    // 2. Try to get existing user data if available
    let existingUserData = {};
    try {
      const response = await axiosSecure.get(`/api/users/by-email/${user.email}`);
      if (response.data) {
        existingUserData = {
          role: response.data.role,
          isSubscribed: response.data.isSubscribed,
          // Preserve any existing additional fields
          ...response.data
        };
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.warn("Error checking existing user:", error.message);
      }
      // Continue with default if user doesn't exist (404)
    }

    // 3. Merge data (preserve existing role/subscription if available)
    const userInfo = {
      ...defaultUserInfo,
      ...existingUserData
    };

    // 4. Save/update user in database
    const response = await axiosSecure.put(
      `/api/users/email/${user.email}`,
      userInfo
    );

    if (!response.data?.success) {
      throw new Error("Failed to save user data");
    }

    return true;
  } catch (error) {
    console.error("User save failed:", error.message);
    
    // Special handling for network errors
    if (error.message.includes("Network Error")) {
      console.warn("Network issue - user data might not be saved");
      // You might want to implement retry logic or offline handling here
    }
    
    return false;
  }
};

export default saveUser;