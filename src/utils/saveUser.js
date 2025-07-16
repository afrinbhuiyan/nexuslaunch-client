const saveUser = async (axiosSecure, user) => {
  try {
    // 🔍 1. Check if user already exists
    const existing = await axiosSecure.get(`/api/users/${user.email}`);

    // ✅ 2. Preserve existing role and subscription status
    const userInfo = {
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      role: existing.data.role || "user",
      isSubscribed: existing.data.isSubscribed || false,
    };

    // 🔄 3. Upsert with existing data preserved
    await axiosSecure.put(`/api/users/${user.email}`, userInfo);
    return true;
  } catch (error) {
    console.error("User save failed:", error);
    return false;
  }
};


export default saveUser;
