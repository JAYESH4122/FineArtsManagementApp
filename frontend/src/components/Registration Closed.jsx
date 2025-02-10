import React from "react";

const RegistrationClosed = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.text}>Registration Closed</h2>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8d7da",
  },
  text: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#721c24",
    padding: "20px",
    backgroundColor: "#f5c6cb",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default RegistrationClosed;
