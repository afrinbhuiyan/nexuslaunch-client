const saveUser = async (axiosSecure, user) => {
  const userInfo = {
    name: user.displayName,
    email: user.email,
    image: user.photoURL,
    role: 'user',
    isSubscribed: false,
  };

  try {
    await axiosSecure.put(`api/users/${user.email}`, userInfo);
    return true;
  } catch (error) {
    console.error("User save failed:", error);
    return false;
  }
};

export default saveUser;
